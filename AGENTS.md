# CE50 Project Agent Guidelines (AGENTS.md)

This document contains operational rules, technical architecture, and design conventions for AI agents working on the CE50 codebase.

---

## 1. Tech Stack Overview

- **Frontend**: Next.js 16 (Turbopack, App Router, React 19), TypeScript
- **Styling**: Bootstrap 5.3 (`bootstrap/dist/css/bootstrap.min.css`), Tailwind CSS v4 (`@import "tailwindcss/utilities";` only — never full preflight to avoid breaking Bootstrap)
- **Icons**: `lucide-react` ONLY (do NOT import or install `bootstrap-icons`)
- **Backend**: Python 3.12+ / 3.13, FastAPI, Uvicorn, SQLite3, `httpx`, `python-multipart`, `python-dotenv`
- **Reverse Proxy / Public Tunnel**: ngrok or Cloudflare Tunnel pointing to frontend on port 3000

---

## 2. API & Network Conventions

1. **Relative API Endpoints Only**:
   - NEVER hardcode `http://localhost:8000` or `http://127.0.0.1:8000` in frontend components.
   - All browser requests must call `/api/...` (e.g. `/api/teachers`, `/api/students`, `/api/news`, `/api/class`, `/api/exam`).
   - Next.js `rewrites()` in `frontend/next.config.ts` proxies `/api/:path*` and `/uploads/:path*` to the backend (`process.env.API_URL`).
   - This ensures the app works seamlessly over tunnels (ngrok/Cloudflare), mobile, and production domains.

2. **Default Ports**:
   - Frontend runs on port `3000`.
   - Backend runs on port `8001` (configured via `API_URL=http://127.0.0.1:8001` to avoid conflicting with other services on port 8000).

---

## 3. UI & Design Standards (Strictly No "AI Slop")

1. **No Over-Engineering**:
   - Do NOT add unsolicited badges, yellow pill wrappers, gear icons, shield icons, or gradient borders.
   - When Bootstrap is requested, use standard Bootstrap 5 components:
     - Primary button: `btn btn-primary`
     - Unfocused/neutral button: `btn btn-dark`
     - Secondary button: `btn btn-secondary`
     - Plain text navbar links: `nav-link text-light`
2. **Table Design**:
   - Use **Style 1: Clean Light Surface (High Contrast)**:
     - Container: `card shadow-lg border-0 overflow-hidden rounded-3 mb-5`
     - Table: `table table-hover table-striped mb-0 align-middle`
     - Header: `<thead className="table-light border-bottom">`
     - Dark, readable text for content; simple badges for IDs/generations.
3. **Filter Navigation Bars**:
   - Use clean card containers matching the table style (`card shadow-sm border-0 rounded-3 mb-4 bg-white text-dark p-3` or `bg-black border border-secondary border-opacity-25`).
   - Use `btn-group` with `btn-primary` (active) and `btn-outline-secondary` / `btn-dark` (inactive).
4. **Icons**:
   - Use `lucide-react` vector components (e.g., `<CalendarX size={48} />`, `<FileText size={18} />`, `<ExternalLink size={14} />`).
   - Do not use `bi bi-*` classes or `bootstrap-icons`.

---

## 4. Asset Caching & Image Handling

1. **Preventing Mixed-Content Blocking**:
   - Do NOT use `unoptimized` on external images in `<Image>` tags.
   - Allow Next.js Image Server to proxy external HTTP news images server-side over HTTPS.
   - Always include fallback handling: `onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/404.png"; }}`.
2. **Skeleton Loading**:
   - Do NOT flash `/404.png` while data is loading.
   - Use Bootstrap 5 skeleton placeholders (`placeholder-glow`, `placeholder`) to preserve card dimensions during fetches.
3. **Cache-Control Headers**:
   - Uploaded media (`/uploads/...`) must return `Cache-Control: public, max-age=86400, stale-while-revalidate=604800` from both FastAPI and `next.config.ts` to prevent browser re-fetch flicker on refresh.
4. **Aspect Ratios**:
   - Always include `img { max-width: 100%; height: auto; }` in `globals.css` so Next.js images do not distort vertically.
   - Set `draggable="false"` and `user-select-none` on cards and image links to prevent ghost image dragging.

---

## 5. Data & Privacy Conventions

1. **Auto-Derived Student Generation**:
   - Derive student generation from ID prefix using `getStudentGeneration(id)` in `frontend/utils/generation.ts`:
     - Prefix `67...` -> `CE04`
     - Prefix `66...` -> `CE03`
     - Prefix `65...` -> `CE02`
     - Prefix `64...` -> `CE01`
   - Image resolution rule:
     - Custom upload: `student.student_image`
     - Default folder: `/uploads/students/ce_XX/{student_id}.png`
2. **Privacy on Public Endpoints**:
   - `GET /students` MUST NOT expose `student_contact` (phone) or `student_instagram` publicly.
   - Only return `student_id`, `student_firstname`, `student_lastname`, `student_image`, `student_role`, `student_lineage`, `created_at`.
   - Admin routes (`POST /auth/login`, `/admin`) handle full records with authentication.
3. **Database Integrity**:
   - Always enforce foreign keys: `PRAGMA foreign_keys = ON;`.
   - Wrap sqlite connections in Python context managers (`with get_db() as conn:`) so connections and locks are properly released.

---

## 6. React Hydration Guidelines

- Browser password extensions (LastPass, 1Password, Bitwarden) inject elements into `<input>` and `<form>` during initial load, breaking SSR hydration.
- To prevent hydration errors, defer rendering user inputs until component mount:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  ...
  {mounted ? <input ... /> : <div style={{ minHeight: "38px" }} />}
  ```
- Use `suppressHydrationWarning` on `<html>` and `<body>` tags.

---

## 7. Development & Run Commands

```bash
# Backend Setup & Run (Port 8001)
cd backend
../.venv/bin/python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001

# Frontend Setup & Run (Port 3000)
cd frontend
npm run dev -- -H 127.0.0.1 -p 3000

# Docker Deployment
docker compose up -d --build
```
