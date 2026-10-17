import hashlib
import json
import logging
import os
import sqlite3
import time
import sys
from pathlib import Path
from typing import Optional, List, Any

import bcrypt
import jwt
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException, UploadFile, File, Form, Header, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Absolute paths to ensure backend works from any working directory
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
DB_PATH = BASE_DIR / "ce50.db"
UPLOADS_DIR = BASE_DIR / "uploads"

# Load environment variables from backend/.env or root .env
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

limiter = Limiter(key_func=get_remote_address)

fastapi_kwargs = {
    "title": "CE50 API",
    "version": "1.0.0",
}
if os.getenv("ENVIRONMENT") == "production":
    fastapi_kwargs.update({
        "docs_url": None,
        "redoc_url": None,
        "openapi_url": None,
    })

app = FastAPI(**fastapi_kwargs)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

JWT_SECRET = os.getenv("JWT_SECRET", "ce50_jwt_super_secret_key_change_in_prod")
if os.getenv("ENVIRONMENT") == "production" and (not JWT_SECRET or JWT_SECRET == "ce50_jwt_super_secret_key_change_in_prod"):
    raise RuntimeError("JWT_SECRET must be set to a secure secret in production")
elif not JWT_SECRET or JWT_SECRET == "ce50_jwt_super_secret_key_change_in_prod":
    JWT_SECRET = "ce50_jwt_super_secret_key_change_in_prod"
    logging.warning("Using default JWT_SECRET in development. Set JWT_SECRET in .env for production.")

JWT_ALGORITHM = "HS256"
security_bearer = HTTPBearer(auto_error=True)

# Cache configuration for external GNews API (multi-category / country)
GNEWS_CACHES = {}
CACHE_TTL_SECONDS = 3000  # 50 minutes cache duration to strictly conserve 100 requests/day quota

FALLBACK_STOCK_ARTICLES = [
    {
        "title": "NVIDIA and TSMC Lead Global Semiconductor Stock Surge Amid AI Infrastructure Boom",
        "description": "Tech heavyweights push Nasdaq to new highs as enterprise demand for advanced AI accelerators continues to outpace supply.",
        "content": "Wall Street analysts raise price targets for major chipmakers...",
        "url": "https://www.bloomberg.com",
        "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-02T16:00:00Z",
        "source": {"name": "Bloomberg Markets", "url": "https://www.bloomberg.com"}
    },
    {
        "title": "Big Tech Earnings Preview: Cloud and AI Monetization in Focus for Q3",
        "description": "Alphabet, Microsoft, and Amazon face investor scrutiny on AI capital expenditure returns and cloud enterprise growth.",
        "content": "Market watchers expect double-digit revenue expansion in hyperscale cloud divisions...",
        "url": "https://www.reuters.com",
        "image": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-02T14:20:00Z",
        "source": {"name": "Reuters", "url": "https://www.reuters.com"}
    },
    {
        "title": "Apple Market Cap Stabilizes as Global Smartphone Shipments Rebound",
        "description": "Supply chain indicators point to strong demand for next-generation hardware and localized edge services in Asia.",
        "content": "Institutional investors maintain overweight ratings on consumer tech fundamentals...",
        "url": "https://www.cnbc.com",
        "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-01T20:10:00Z",
        "source": {"name": "CNBC", "url": "https://www.cnbc.com"}
    },
    {
        "title": "Cybersecurity and SaaS Stocks Outperform on Enterprise Defense Spending",
        "description": "Enterprise software valuations rebound as chief information security officers expand budgets for cloud defense architectures.",
        "content": "Cloud security providers see multi-year contracts driven by zero-trust mandates...",
        "url": "https://www.wsj.com",
        "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-01T11:45:00Z",
        "source": {"name": "Wall Street Journal", "url": "https://www.wsj.com"}
    }
]

# Keywords to prioritize Computer Engineering topics (AI, Quantum, Network, Web, etc.)
CE_PRIORITY_KEYWORDS = [
    "ai", "quantum", "network", "web", "computer", "computing", "software",
    "cyber", "security", "cloud", "chip", "semiconductor", "robot", "robotics",
    "ปัญญาประดิษฐ์", "คอมพิวเตอร์", "ควอนตัม", "เน็ตเวิร์ก", "เครือข่าย", "ความปลอดภัย", "ซอฟต์แวร์", "ฮาร์ดแวร์"
]

# Keywords to filter out gaming news
GAMING_EXCLUDE_KEYWORDS = [
    "game", "gaming", "gamer", "playstation", "xbox", "nintendo", "gta", "esports", "ps5", "เกม", "เกมมิ่ง"
]


def filter_and_prioritize_articles(articles: list, exclude_games: bool = True) -> list:
    filtered = []
    for a in articles:
        text = f"{a.get('title', '')} {a.get('description', '')}".lower()
        if exclude_games and any(g in text for g in GAMING_EXCLUDE_KEYWORDS):
            continue
        filtered.append(a)

    pool = filtered if filtered else articles

    def get_priority(a):
        text = f"{a.get('title', '')} {a.get('description', '')}".lower()
        score = 0
        for kw in CE_PRIORITY_KEYWORDS:
            if kw in text:
                score += 10
        return score

    return sorted(pool, key=get_priority, reverse=True)

FALLBACK_THAI_TECH_ARTICLES = [
    {
        "title": "กสทช. ร่วมกับสถาบันการศึกษา เดินหน้าผลักดันโครงสร้างพื้นฐาน 6G และระบบประมวลผล AI แห่งชาติ",
        "description": "ความร่วมมือด้านงานวิจัยวิศวกรรมคอมพิวเตอร์และโทรคมนาคม เพื่อยกระดับศูนย์ข้อมูล Data Center ในประเทศไทย",
        "content": "การประชุมสัมมนาเทคโนโลยีสื่อสารและคอมพิวเตอร์ระดับประเทศ...",
        "url": "https://droidsans.com",
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-02T10:00:00Z",
        "source": {"name": "DroidSans", "url": "https://droidsans.com"}
    },
    {
        "title": "วงการชิปเซมิคอนดักเตอร์เปิดตัวสถาปัตยกรรม RISC-V สำหรับระบบสมองกลฝังตัวรุ่นใหม่",
        "description": "นักวิจัยไทยและเครือข่ายวิศวกรรมพัฒนาชิปประมวลผลต้นแบบเพื่อการใช้งานในยานยนต์ไฟฟ้าและอุปกรณ์ IoT อัจฉริยะ",
        "content": "การพัฒนาฮาร์ดแวร์คอมพิวเตอร์แบบ Open Architecture กำลังได้รับความสนใจอย่างกว้างขวาง...",
        "url": "https://beartai.com",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-01T14:30:00Z",
        "source": {"name": "Beartai", "url": "https://beartai.com"}
    }
]

FALLBACK_TECH_ARTICLES = [
    {
        "title": "Quantum Computing Breakthrough: Researchers Achieve Record Coherence Times",
        "description": "Scientists demonstrate major progress in quantum qubit stability, opening new doors for fault-tolerant computing architectures and cryptography.",
        "content": "A research consortium has announced a breakthrough in quantum coherence times...",
        "url": "https://www.technologyreview.com",
        "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-02T12:00:00Z",
        "source": {"name": "MIT Technology Review", "url": "https://www.technologyreview.com"}
    },
    {
        "title": "Next-Gen AI Microchips Accelerate Edge Computing Deployment",
        "description": "Novel semiconductor design reduces edge AI power consumption by 40% while doubling neural inference throughput across smart devices.",
        "content": "Edge intelligence devices receive a major boost with newly fabricated chips...",
        "url": "https://spectrum.ieee.org",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-02T08:30:00Z",
        "source": {"name": "IEEE Spectrum", "url": "https://spectrum.ieee.org"}
    },
    {
        "title": "Global Cyber Defense Initiative Unveils Post-Quantum Cryptography Standards",
        "description": "Standardization bodies release final guidelines for enterprise transition to post-quantum encryption algorithms across telecommunication nodes.",
        "content": "Security agencies worldwide urge infrastructure providers to begin PQC migration...",
        "url": "https://krebsonsecurity.com",
        "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-01T15:45:00Z",
        "source": {"name": "Krebs on Security", "url": "https://krebsonsecurity.com"}
    },
    {
        "title": "Autonomous Robotics in Modern Semiconductor Cleanrooms",
        "description": "Smart robotics drive extreme precision in high-density chip assembly and automated wafer inspection systems.",
        "content": "Fab facilities are rapidly integrating autonomous guided vehicles and precision manipulation...",
        "url": "https://arstechnica.com",
        "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-10-01T10:15:00Z",
        "source": {"name": "Ars Technica", "url": "https://arstechnica.com"}
    },
    {
        "title": "WebAssembly 3.0 Standard Promises Near-Native Performance in Web Browsers",
        "description": "The new Wasm specification introduces advanced SIMD and multithreading primitives for browser-based CAD and simulation rendering.",
        "content": "Web applications are set to bridge the final performance gaps with desktop software...",
        "url": "https://www.infoq.com",
        "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-09-30T18:00:00Z",
        "source": {"name": "InfoQ", "url": "https://www.infoq.com"}
    },
    {
        "title": "Distributed Cloud Infrastructures Adopt Rust for Zero-Cost Abstraction Reliability",
        "description": "Major hyperscalers report 70% decrease in memory vulnerabilities after migrating critical network proxies and services to Rust.",
        "content": "Systems programming continues its shift toward memory-safe languages across global cloud nodes...",
        "url": "https://www.zdnet.com",
        "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60",
        "publishedAt": "2026-09-29T14:20:00Z",
        "source": {"name": "ZDNet", "url": "https://www.zdnet.com"}
    }
]

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    for origin in allowed_origins_env.split(","):
        cleaned = origin.strip()
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"^https?://([a-zA-Z0-9-]+\.)*(trycloudflare\.com|ce\.kmitl\.ac\.th)$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.middleware("http")
async def add_no_cache_headers(request: Request, call_next):
    response = await call_next(request)
    path = request.url.path
    if not path.startswith("/uploads"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

class CachedStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "public, max-age=86400, stale-while-revalidate=604800"
        return response

if UPLOADS_DIR.exists():
    app.mount("/uploads", CachedStaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS quiz_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT,
                user_agent TEXT,
                os TEXT,
                browser TEXT,
                device TEXT,
                top_career TEXT,
                top_career_th TEXT,
                top_matches_json TEXT,
                answers_json TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS hero_banners (
                banner_id INTEGER PRIMARY KEY AUTOINCREMENT,
                generation TEXT NOT NULL UNIQUE,
                banner_image TEXT NOT NULL,
                title TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        banner_count = conn.execute("SELECT COUNT(*) AS count FROM hero_banners").fetchone()["count"]
        if banner_count == 0:
            conn.execute(
                """
                INSERT INTO hero_banners (generation, banner_image, title)
                VALUES 
                    ('All', '/ce_all_banner.png', 'All Generations Banner'),
                    ('CE04', '/ce_04_cropped.webp', 'CE04 Banner')
                """
            )
        # Ensure company_location and company_email exist in companys table
        company_cols = [r["name"] for r in conn.execute("PRAGMA table_info(companys)").fetchall()]
        if "company_location" not in company_cols:
            conn.execute("ALTER TABLE companys ADD COLUMN company_location TEXT")
        if "company_email" not in company_cols:
            conn.execute("ALTER TABLE companys ADD COLUMN company_email TEXT")
        conn.commit()

init_db()


@app.get("/", response_class=HTMLResponse)
def home():
    return "<h1>CE50 API Server</h1>"


@app.get("/projects")
def projects():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM projects").fetchall()
        return [dict(row) for row in rows]


@app.get("/news")
def news():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM news_item").fetchall()
        return [dict(row) for row in rows]


@app.get("/students")
def students():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM students").fetchall()
        return [dict(row) for row in rows]


@app.get("/teachers")
def teachers():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM teachers").fetchall()
        return [dict(row) for row in rows]


@app.get("/rooms")
def rooms():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM rooms").fetchall()
        return [dict(row) for row in rows]


@app.get("/internship")
def internships():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM internships").fetchall()
        return [dict(row) for row in rows]


@app.get("/companys")
def companys():
    with get_db() as conn:
        rows = conn.execute("SELECT company_id, company_name, company_image, company_location, company_email FROM companys").fetchall()
        return [dict(row) for row in rows]


@app.get("/exam")
def exam_schedule(generation: Optional[str] = None, semester: Optional[int] = None):
    with get_db() as conn:
        query = "SELECT * FROM exam_schedules WHERE 1=1"
        params = []
        if generation and generation != "All":
            query += " AND generation = ?"
            params.append(generation)
        if semester:
            query += " AND semester = ?"
            params.append(semester)
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]


@app.get("/class")
def class_schedule(generation: Optional[str] = None, semester: Optional[int] = None):
    with get_db() as conn:
        query = "SELECT * FROM class_schedules WHERE 1=1"
        params = []
        if generation and generation != "All":
            query += " AND generation = ?"
            params.append(generation)
        if semester:
            query += " AND semester = ?"
            params.append(semester)
        rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]


@app.get("/gnews")
def gnews_tech(
    q: Optional[str] = Query(None, description="Search query keyword, e.g. 'crypto' or 'technology'"),
    category: str = Query("technology", description="News category"),
    country: Optional[str] = Query(None, description="Country code e.g. 'th' or 'us'"),
    lang: Optional[str] = Query(None, description="Language e.g. 'th' or 'en'"),
    max: int = Query(10, ge=1, le=10, description="Max articles to fetch")
):
    """
    Fetch technology and international/local news from GNews API v4.
    Includes caching and graceful fallback handling on rate limit or network error (TC_NWS_002, TC_NWS_003).
    """
    api_key = os.getenv("GNEWS_API_KEY", "").strip()
    now = time.time()
    
    # Determine defaults based on country and topic
    is_thai = (country == "th")
    is_stock = bool(q and "stock" in q.lower()) or (category == "business")
    target_lang = lang if lang else ("th" if is_thai else "en")
    
    if is_stock:
        fallback_pool = FALLBACK_STOCK_ARTICLES
    elif is_thai:
        fallback_pool = FALLBACK_THAI_TECH_ARTICLES
    else:
        fallback_pool = FALLBACK_TECH_ARTICLES

    # Cache key per configuration
    cache_key = f"{country}_{target_lang}_{category}_{q}_{max}"

    # Serve cached response if within TTL
    if cache_key in GNEWS_CACHES:
        cached = GNEWS_CACHES[cache_key]
        if now - cached["timestamp"] < CACHE_TTL_SECONDS:
            return cached["data"]

    # If no API key configured, return fallback cache gracefully
    if not api_key:
        return {
            "totalArticles": len(fallback_pool),
            "articles": fallback_pool[:max],
            "fallback": True,
            "message": "Using fallback tech news cache (GNEWS_API_KEY not set)"
        }

    try:
        fetch_limit = 10
        if q:
            url = "https://gnews.io/api/v4/search"
            params = {"q": q, "lang": target_lang, "max": fetch_limit, "apikey": api_key}
            if country:
                params["country"] = country
        else:
            url = "https://gnews.io/api/v4/top-headlines"
            params = {"category": category, "lang": target_lang, "max": fetch_limit, "apikey": api_key}
            if country:
                params["country"] = country

        with httpx.Client(timeout=8.0) as client:
            res = client.get(url, params=params)

        if res.status_code == 200:
            data = res.json()
            raw_articles = data.get("articles", [])
            # Filter games out and prioritize CE topics (AI, Quantum, Network, Web, Computer)
            articles = filter_and_prioritize_articles(raw_articles)
            if not articles:
                articles = fallback_pool

            result = {
                "totalArticles": len(articles),
                "articles": articles[:max]
            }
            GNEWS_CACHES[cache_key] = {"data": result, "timestamp": now}
            return result
        else:
            # Fallback on rate limit (HTTP 429) or other upstream errors
            return {
                "totalArticles": len(fallback_pool),
                "articles": fallback_pool[:max],
                "fallback": True,
                "status_code": res.status_code,
                "message": f"External GNews API error ({res.status_code}), serving fallback cache"
            }
    except Exception as e:
        # Fallback on timeout or network connection issues
        return {
            "totalArticles": len(fallback_pool),
            "articles": fallback_pool[:max],
            "fallback": True,
            "error": str(e),
            "message": "Connection to GNews API failed, serving fallback cache"
        }


# ==========================================
# Authentication & Access Control
# ==========================================

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="โทเค็นหมดอายุ กรุณาเข้าสู่ระบบใหม่",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="โทเค็นไม่ถูกต้องหรือไม่สามารถยืนยันตัวตนได้",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ข้อมูลผู้ใช้ในโทเค็นไม่ถูกต้อง",
            headers={"WWW-Authenticate": "Bearer"},
        )

    with get_db() as conn:
        row = conn.execute(
            "SELECT user_id, user_name, user_email, user_role FROM users WHERE user_id = ?",
            (user_id,)
        ).fetchone()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="ไม่พบผู้ใช้งานนี้ในระบบ",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = dict(row)
        if user.get("user_role") not in ("admin", "superadmin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="สิทธิ์การใช้งานไม่เพียงพอ (ต้องการสิทธิ์ admin)",
            )
        return user


class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/auth/login")
@limiter.limit("5/minute")
def auth_login(request: Request, req: LoginRequest):
    with get_db() as conn:
        row = conn.execute(
            "SELECT user_id, user_name, password_hash, user_email, user_role FROM users WHERE user_name = ?",
            (req.username.strip(),)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=401, detail="ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
        user = dict(row)
        stored_hash = user["password_hash"] or ""
        password_bytes = req.password.encode("utf-8")

        authenticated = False
        upgrade_needed = False

        # 1. Try bcrypt check if stored hash is formatted as bcrypt
        if stored_hash.startswith(("$2a$", "$2b$", "$2y$")):
            try:
                if bcrypt.checkpw(password_bytes, stored_hash.encode("utf-8")):
                    authenticated = True
            except Exception:
                authenticated = False
        else:
            # 2. Check legacy SHA-256
            sha256_hash = hashlib.sha256(password_bytes).hexdigest()
            if sha256_hash == stored_hash:
                authenticated = True
                upgrade_needed = True

        if not authenticated:
            raise HTTPException(status_code=401, detail="ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")

        # Transparently upgrade stored hash to bcrypt
        if upgrade_needed:
            new_bcrypt_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")
            conn.execute(
                "UPDATE users SET password_hash = ? WHERE user_id = ?",
                (new_bcrypt_hash, user["user_id"])
            )
            conn.commit()

        exp_time = int(time.time()) + 24 * 3600
        payload = {
            "sub": str(user["user_id"]),
            "username": user["user_name"],
            "role": user["user_role"],
            "exp": exp_time,
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return {
            "success": True,
            "token": token,
            "user": {
                "user_id": user["user_id"],
                "user_name": user["user_name"],
                "user_email": user["user_email"],
                "user_role": user["user_role"]
            }
        }

@app.get("/users")
def get_users(admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        rows = conn.execute("SELECT user_id, user_name, user_email, user_role, created_at FROM users").fetchall()
        return [dict(r) for r in rows]


# ==========================================
# Secure File Upload (TC_TCH_003, TC_TCH_004)
# ==========================================

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}
ALLOWED_MODULES = {"general", "teachers", "students", "news", "projects", "companys", "rooms", "banners"}
MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024   # 5 MB for images (TC_TCH_004)
MAX_DOC_FILE_SIZE = 25 * 1024 * 1024    # 25 MB for PDF project documents

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    module: str = Form("general"),
    admin: dict = Depends(get_current_admin)
):
    if module not in ALLOWED_MODULES:
        raise HTTPException(
            status_code=400,
            detail=f"โมดูลไม่อยู่ในรายการที่อนุญาต ({', '.join(sorted(ALLOWED_MODULES))})"
        )

    target_dir = (UPLOADS_DIR / module).resolve()
    uploads_dir_resolved = UPLOADS_DIR.resolve()
    if not target_dir.is_relative_to(uploads_dir_resolved) or target_dir == uploads_dir_resolved:
        raise HTTPException(
            status_code=400,
            detail="ตำแหน่งปลายทางการอัปโหลดไม่ถูกต้อง"
        )

    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"อนุญาตเฉพาะไฟล์รูปภาพหรือเอกสาร PDF ({', '.join(ALLOWED_EXTENSIONS)}) เท่านั้น (TC_TCH_003)"
        )
    
    content = await file.read()
    max_size = MAX_DOC_FILE_SIZE if ext == ".pdf" else MAX_IMAGE_FILE_SIZE
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"ขนาดไฟล์ต้องไม่เกิน {'25MB' if ext == '.pdf' else '5MB'} (TC_TCH_004)"
        )
    
    target_dir = UPLOADS_DIR / module
    target_dir.mkdir(parents=True, exist_ok=True)
    
    safe_name = f"{int(time.time())}_{Path(file.filename or 'upload').name}"
    file_path = target_dir / safe_name
    file_path.write_bytes(content)
    
    return {
        "success": True,
        "filename": safe_name,
        "url": f"/uploads/{module}/{safe_name}"
    }


# ==========================================
# Teachers CRUD
# ==========================================

class TeacherCreate(BaseModel):
    teacher_firstname: str
    teacher_lastname: str
    teacher_contact: str
    teacher_name_en: Optional[str] = None
    teacher_image: Optional[str] = None
    teacher_advise_year: Optional[str] = None

@app.post("/teachers")
def create_teacher(data: TeacherCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO teachers 
               (teacher_firstname, teacher_lastname, teacher_contact, teacher_name_en, teacher_image, teacher_advise_year)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (data.teacher_firstname, data.teacher_lastname, data.teacher_contact, data.teacher_name_en, data.teacher_image, data.teacher_advise_year)
        )
        conn.commit()
        return {"success": True, "teacher_id": cursor.lastrowid}

@app.put("/teachers/{teacher_id}")
def update_teacher(teacher_id: int, data: TeacherCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            """UPDATE teachers SET 
               teacher_firstname = ?, teacher_lastname = ?, teacher_contact = ?,
               teacher_name_en = ?, teacher_image = ?, teacher_advise_year = ?
               WHERE teacher_id = ?""",
            (data.teacher_firstname, data.teacher_lastname, data.teacher_contact, data.teacher_name_en, data.teacher_image, data.teacher_advise_year, teacher_id)
        )
        conn.commit()
        return {"success": True, "teacher_id": teacher_id}

@app.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM teachers WHERE teacher_id = ?", (teacher_id,))
        conn.commit()
        return {"success": True, "deleted_id": teacher_id}


# ==========================================
# Students CRUD
# ==========================================

class StudentCreate(BaseModel):
    student_id: Optional[int] = None
    student_firstname: str
    student_lastname: str
    student_lineage: str
    student_email: Optional[str] = None
    student_contact: Optional[str] = None
    student_instagram: Optional[str] = None
    student_role: Optional[str] = None
    student_image: Optional[str] = None

@app.post("/students")
def create_student(data: StudentCreate, admin: dict = Depends(get_current_admin)):
    email = data.student_email or data.student_contact or f"{data.student_id}@kmitl.ac.th"
    with get_db() as conn:
        cursor = conn.cursor()
        if data.student_id:
            cursor.execute(
                """INSERT INTO students 
                   (student_id, student_firstname, student_lastname, student_lineage, student_email, student_contact, student_instagram, student_role, student_image)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (data.student_id, data.student_firstname, data.student_lastname, data.student_lineage, email, email, data.student_instagram, data.student_role, data.student_image)
            )
        else:
            cursor.execute(
                """INSERT INTO students 
                   (student_firstname, student_lastname, student_lineage, student_email, student_contact, student_instagram, student_role, student_image)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (data.student_firstname, data.student_lastname, data.student_lineage, email, email, data.student_instagram, data.student_role, data.student_image)
            )
        conn.commit()
        return {"success": True, "student_id": data.student_id or cursor.lastrowid}

@app.put("/students/{student_id}")
def update_student(student_id: int, data: StudentCreate, admin: dict = Depends(get_current_admin)):
    new_student_id = data.student_id if data.student_id else student_id
    email = data.student_email or data.student_contact or f"{new_student_id}@kmitl.ac.th"
    with get_db() as conn:
        if new_student_id != student_id:
            conn.execute("PRAGMA foreign_keys = OFF;")
            conn.execute(
                """UPDATE students SET 
                   student_id = ?, student_firstname = ?, student_lastname = ?, student_lineage = ?,
                   student_email = ?, student_contact = ?, student_instagram = ?,
                   student_role = ?, student_image = ?
                   WHERE student_id = ?""",
                (new_student_id, data.student_firstname, data.student_lastname, data.student_lineage, email, email, data.student_instagram, data.student_role, data.student_image, student_id)
            )
            # Cascade update in internships and student_projects
            conn.execute("UPDATE internships SET student_id = ? WHERE student_id = ?", (str(new_student_id), str(student_id)))
            conn.execute("UPDATE student_projects SET student_id = ? WHERE student_id = ?", (str(new_student_id), str(student_id)))
            conn.execute("PRAGMA foreign_keys = ON;")
        else:
            conn.execute(
                """UPDATE students SET 
                   student_firstname = ?, student_lastname = ?, student_lineage = ?,
                   student_email = ?, student_contact = ?, student_instagram = ?,
                   student_role = ?, student_image = ?
                   WHERE student_id = ?""",
                (data.student_firstname, data.student_lastname, data.student_lineage, email, email, data.student_instagram, data.student_role, data.student_image, student_id)
            )
        conn.commit()
        return {"success": True, "student_id": new_student_id}

@app.delete("/students/{student_id}")
def delete_student(student_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("PRAGMA foreign_keys = OFF;")
        conn.execute("DELETE FROM student_projects WHERE student_id = ?", (str(student_id),))
        conn.execute("DELETE FROM internships WHERE student_id = ?", (str(student_id),))
        conn.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.commit()
        return {"success": True, "deleted_id": student_id}


# ==========================================
# News Item CRUD
# ==========================================

class NewsCreate(BaseModel):
    news_title: str
    news_description: str
    news_category: Optional[str] = "ทั่วไป"
    news_image: Optional[str] = None

@app.post("/news")
def create_news(data: NewsCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO news_item (news_title, news_description, news_category, news_image) VALUES (?, ?, ?, ?)",
            (data.news_title, data.news_description, data.news_category, data.news_image)
        )
        conn.commit()
        return {"success": True, "news_id": cursor.lastrowid}

@app.put("/news/{news_id}")
def update_news(news_id: int, data: NewsCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            "UPDATE news_item SET news_title = ?, news_description = ?, news_category = ?, news_image = ? WHERE news_id = ?",
            (data.news_title, data.news_description, data.news_category, data.news_image, news_id)
        )
        conn.commit()
        return {"success": True, "news_id": news_id}

@app.delete("/news/{news_id}")
def delete_news(news_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM news_item WHERE news_id = ?", (news_id,))
        conn.commit()
        return {"success": True, "deleted_id": news_id}


# ==========================================
# Projects CRUD
# ==========================================

class ProjectCreate(BaseModel):
    project_name: str
    project_description: str
    project_image: Optional[str] = None
    project_pdf: Optional[str] = None
    student_id: Optional[str] = None

@app.post("/projects")
def create_project(data: ProjectCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO projects (project_name, project_description, project_image, project_pdf) VALUES (?, ?, ?, ?)",
            (data.project_name, data.project_description, data.project_image, data.project_pdf)
        )
        pid = cursor.lastrowid
        if data.student_id:
            cursor.execute(
                "INSERT INTO student_projects (student_id, project_id) VALUES (?, ?)",
                (data.student_id, pid)
            )
        conn.commit()
        return {"success": True, "project_id": pid}

@app.put("/projects/{project_id}")
def update_project(project_id: int, data: ProjectCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            "UPDATE projects SET project_name = ?, project_description = ?, project_image = ?, project_pdf = ? WHERE project_id = ?",
            (data.project_name, data.project_description, data.project_image, data.project_pdf, project_id)
        )
        if data.student_id:
            conn.execute("DELETE FROM student_projects WHERE project_id = ?", (project_id,))
            conn.execute("INSERT INTO student_projects (student_id, project_id) VALUES (?, ?)", (data.student_id, project_id))
        conn.commit()
        return {"success": True, "project_id": project_id}

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM student_projects WHERE project_id = ?", (project_id,))
        conn.execute("DELETE FROM projects WHERE project_id = ?", (project_id,))
        conn.commit()
        return {"success": True, "deleted_id": project_id}


# ==========================================
# Companies & Internships CRUD
# ==========================================

class CompanyCreate(BaseModel):
    company_name: str
    company_image: Optional[str] = None
    company_location: Optional[str] = None
    company_email: Optional[str] = None

@app.post("/companys")
def create_company(data: CompanyCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO companys (company_name, company_image, company_location, company_email) VALUES (?, ?, ?, ?)",
            (data.company_name, data.company_image, data.company_location, data.company_email)
        )
        conn.commit()
        return {"success": True, "company_id": cursor.lastrowid}

@app.put("/companys/{company_id}")
def update_company(company_id: int, data: CompanyCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            "UPDATE companys SET company_name = ?, company_image = ?, company_location = ?, company_email = ? WHERE company_id = ?",
            (data.company_name, data.company_image, data.company_location, data.company_email, company_id)
        )
        conn.commit()
        return {"success": True, "company_id": company_id}

@app.delete("/companys/{company_id}")
def delete_company(company_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM companys WHERE company_id = ?", (company_id,))
        conn.commit()
        return {"success": True, "deleted_id": company_id}

class InternshipCreate(BaseModel):
    student_id: str
    internship_title: str
    company_id: int
    internship_description: str

@app.post("/internship")
def create_internship(data: InternshipCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO internships (student_id, internship_title, company_id, internship_description) VALUES (?, ?, ?, ?)",
            (data.student_id, data.internship_title, data.company_id, data.internship_description)
        )
        conn.commit()
        return {"success": True, "internship_id": cursor.lastrowid}

@app.put("/internship/{internship_id}")
def update_internship(internship_id: int, data: InternshipCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            "UPDATE internships SET student_id = ?, internship_title = ?, company_id = ?, internship_description = ? WHERE internship_id = ?",
            (data.student_id, data.internship_title, data.company_id, data.internship_description, internship_id)
        )
        conn.commit()
        return {"success": True, "internship_id": internship_id}

@app.delete("/internship/{internship_id}")
def delete_internship(internship_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM internships WHERE internship_id = ?", (internship_id,))
        conn.commit()
        return {"success": True, "deleted_id": internship_id}


# ==========================================
# Schedules CRUD (Class & Exam)
# ==========================================

class ClassScheduleCreate(BaseModel):
    teacher_id: int
    class_name: str
    room_id: int
    class_description: Optional[str] = None
    class_day: str
    class_start: str
    class_end: str
    generation: str = "CE04"
    semester: int = 1

@app.post("/class")
def create_class_schedule(data: ClassScheduleCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO class_schedules 
               (teacher_id, class_name, room_id, class_description, class_day, class_start, class_end, generation, semester)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (data.teacher_id, data.class_name, data.room_id, data.class_description, data.class_day, data.class_start, data.class_end, data.generation, data.semester)
        )
        conn.commit()
        return {"success": True, "class_id": cursor.lastrowid}

@app.put("/class/{class_id}")
def update_class_schedule(class_id: int, data: ClassScheduleCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            """UPDATE class_schedules SET 
               teacher_id = ?, class_name = ?, room_id = ?, class_description = ?,
               class_day = ?, class_start = ?, class_end = ?, generation = ?, semester = ?
               WHERE class_id = ?""",
            (data.teacher_id, data.class_name, data.room_id, data.class_description, data.class_day, data.class_start, data.class_end, data.generation, data.semester, class_id)
        )
        conn.commit()
        return {"success": True, "class_id": class_id}

@app.delete("/class/{class_id}")
def delete_class_schedule(class_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM class_schedules WHERE class_id = ?", (class_id,))
        conn.commit()
        return {"success": True, "deleted_id": class_id}

class ExamScheduleCreate(BaseModel):
    exam_code: str
    exam_name: str
    exam_final: int
    exam_date: str
    exam_start: str
    exam_end: str
    exam_room: str
    generation: str = "CE04"
    semester: int = 1

@app.post("/exam")
def create_exam_schedule(data: ExamScheduleCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO exam_schedules 
               (exam_code, exam_name, exam_final, exam_date, exam_start, exam_end, exam_room, generation, semester)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (data.exam_code, data.exam_name, data.exam_final, data.exam_date, data.exam_start, data.exam_end, data.exam_room, data.generation, data.semester)
        )
        conn.commit()
        return {"success": True, "exam_id": cursor.lastrowid}

@app.put("/exam/{exam_id}")
def update_exam_schedule(exam_id: int, data: ExamScheduleCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            """UPDATE exam_schedules SET 
               exam_code = ?, exam_name = ?, exam_final = ?, exam_date = ?,
               exam_start = ?, exam_end = ?, exam_room = ?, generation = ?, semester = ?
               WHERE exam_id = ?""",
            (data.exam_code, data.exam_name, data.exam_final, data.exam_date, data.exam_start, data.exam_end, data.exam_room, data.generation, data.semester, exam_id)
        )
        conn.commit()
        return {"success": True, "exam_id": exam_id}

@app.delete("/exam/{exam_id}")
def delete_exam_schedule(exam_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM exam_schedules WHERE exam_id = ?", (exam_id,))
        conn.commit()
        return {"success": True, "deleted_id": exam_id}


# ==========================================
# Rooms CRUD
# ==========================================

class RoomCreate(BaseModel):
    room_name: str
    room_description: str
    room_image: Optional[str] = None

@app.post("/rooms")
def create_room(data: RoomCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO rooms (room_name, room_description, room_image) VALUES (?, ?, ?)",
            (data.room_name, data.room_description, data.room_image)
        )
        conn.commit()
        return {"success": True, "room_id": cursor.lastrowid}

@app.put("/rooms/{room_id}")
def update_room(room_id: int, data: RoomCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute(
            "UPDATE rooms SET room_name = ?, room_description = ?, room_image = ? WHERE room_id = ?",
            (data.room_name, data.room_description, data.room_image, room_id)
        )
        conn.commit()
        return {"success": True, "room_id": room_id}

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        conn.execute("DELETE FROM rooms WHERE room_id = ?", (room_id,))
        conn.commit()
        return {"success": True, "deleted_id": room_id}


# ==========================================
# Hero Banners CRUD
# ==========================================

class HeroBannerCreate(BaseModel):
    generation: str
    banner_image: str
    title: Optional[str] = None

@app.get("/hero-banners")
def get_hero_banners():
    with get_db() as conn:
        rows = conn.execute("SELECT banner_id, generation, banner_image, title, created_at FROM hero_banners").fetchall()
        return [dict(row) for row in rows]

@app.post("/hero-banners")
def create_hero_banner(data: HeroBannerCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO hero_banners (generation, banner_image, title) VALUES (?, ?, ?)",
                (data.generation, data.banner_image, data.title)
            )
            conn.commit()
            return {"success": True, "banner_id": cursor.lastrowid}
        except sqlite3.IntegrityError:
            raise HTTPException(
                status_code=400,
                detail=f"Banner for generation '{data.generation}' already exists"
            )

@app.put("/hero-banners/{banner_id}")
def update_hero_banner(banner_id: int, data: HeroBannerCreate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        # Check if banner exists
        existing = conn.execute("SELECT banner_id FROM hero_banners WHERE banner_id = ?", (banner_id,)).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Hero banner not found")
        try:
            conn.execute(
                "UPDATE hero_banners SET generation = ?, banner_image = ?, title = ? WHERE banner_id = ?",
                (data.generation, data.banner_image, data.title, banner_id)
            )
            conn.commit()
            return {"success": True, "banner_id": banner_id}
        except sqlite3.IntegrityError:
            raise HTTPException(
                status_code=400,
                detail=f"Banner for generation '{data.generation}' already exists"
            )

@app.delete("/hero-banners/{banner_id}")
def delete_hero_banner(banner_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM hero_banners WHERE banner_id = ?", (banner_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Hero banner not found")
        conn.commit()
        return {"success": True, "deleted_id": banner_id}


# ==========================================
# BCS Tech Career Quiz Endpoints
# ==========================================

from quiz_data import get_public_questions, evaluate_quiz, ROLES_METADATA


def parse_client_info(request: Request) -> dict:
    # 1. Client IP
    cf_ip = request.headers.get("cf-connecting-ip")
    xf_ip = request.headers.get("x-forwarded-for")
    if cf_ip:
        client_ip = cf_ip.strip()
    elif xf_ip:
        client_ip = xf_ip.split(",")[0].strip()
    elif request.client and request.client.host:
        client_ip = request.client.host
    else:
        client_ip = "unknown"

    # 2. User-Agent
    user_agent = request.headers.get("user-agent", "")
    ua_lower = user_agent.lower()

    # 3. Device: Mobile, Tablet, Desktop
    if any(k in ua_lower for k in ["ipad", "tablet"]) or ("android" in ua_lower and "mobile" not in ua_lower):
        device = "Tablet"
    elif any(k in ua_lower for k in ["mobile", "iphone", "ipod", "android", "blackberry", "windows phone"]):
        device = "Mobile"
    else:
        device = "Desktop"

    # 4. OS: Windows, macOS, Linux, Android, iOS, or Other
    if "android" in ua_lower:
        os_name = "Android"
    elif any(k in ua_lower for k in ["iphone", "ipad", "ipod"]) or ("macintosh" in ua_lower and "mobile" in ua_lower):
        os_name = "iOS"
    elif "windows" in ua_lower:
        os_name = "Windows"
    elif any(k in ua_lower for k in ["macintosh", "mac os x", "macos"]):
        os_name = "macOS"
    elif "linux" in ua_lower:
        os_name = "Linux"
    else:
        os_name = "Other"

    # 5. Browser: Chrome, Safari, Firefox, Edge, Opera, or Other
    if "edg/" in ua_lower or "edge/" in ua_lower:
        browser = "Edge"
    elif "opr/" in ua_lower or "opera" in ua_lower:
        browser = "Opera"
    elif "firefox" in ua_lower or "fxios" in ua_lower:
        browser = "Firefox"
    elif "chrome" in ua_lower or "crios" in ua_lower:
        browser = "Chrome"
    elif "safari" in ua_lower:
        browser = "Safari"
    else:
        browser = "Other"

    return {
        "ip_address": client_ip,
        "user_agent": user_agent,
        "os": os_name,
        "browser": browser,
        "device": device,
    }


class QuizEvaluateRequest(BaseModel):
    answers: dict[str, Any]

@app.get("/quiz/questions")
def get_quiz_questions_endpoint():
    """Returns all 30 career quiz questions with options for client display"""
    return {"questions": get_public_questions()}

@app.get("/quiz/roles")
def get_quiz_roles_endpoint():
    """Returns all 20 tech roles with detailed descriptions and skills"""
    return {"roles": list(ROLES_METADATA.values())}

@app.post("/quiz/evaluate")
@limiter.limit("30/minute")
def evaluate_quiz_endpoint(req: QuizEvaluateRequest, request: Request):
    """Evaluates student quiz answers and returns ranked career matches"""
    try:
        result = evaluate_quiz(req.answers)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to evaluate quiz: {str(e)}")

    try:
        client_info = parse_client_info(request)
        top_roles = result.get("top_roles", [])
        top_career = top_roles[0].get("title") if top_roles else None
        top_career_th = top_roles[0].get("title_th") if top_roles else None
        top_matches_json = json.dumps(top_roles[:3], ensure_ascii=False)
        answers_json = json.dumps(req.answers, ensure_ascii=False)

        with get_db() as conn:
            conn.execute(
                """
                INSERT INTO quiz_logs 
                (ip_address, user_agent, os, browser, device, top_career, top_career_th, top_matches_json, answers_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    client_info["ip_address"],
                    client_info["user_agent"],
                    client_info["os"],
                    client_info["browser"],
                    client_info["device"],
                    top_career,
                    top_career_th,
                    top_matches_json,
                    answers_json,
                )
            )
            conn.commit()
    except Exception as log_err:
        logging.error(f"Error logging quiz evaluation: {log_err}", exc_info=True)

    return result


