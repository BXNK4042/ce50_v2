import hashlib
import os
import sqlite3
from webbrowser import get

import httpx
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()
client = httpx.Client()
api_key = os.getenv("GNEWS_API_KEY")

origins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

class LoginRequest(BaseModel):
  username: str
  password: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
  try:
    parts = hashed_password.split('$')
    if len(parts) != 4 or parts[0] != 'pbkdf2_sha256':
      return False
    rounds = int(parts[1])
    salt = bytes.fromhex(parts[2])
    original_hash = bytes.fromhex(parts[3])
    new_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, rounds)
    return new_hash == original_hash
  except Exception:
    return False

@app.post("/admin/login")
@app.post("/auth/login")
def login(payload: LoginRequest):
  conn = sqlite3.connect("ce50.db")
  conn.row_factory = sqlite3.Row
  cursor = conn.cursor()
  cursor.execute(
    "SELECT user_id, user_name, password_hash, user_email, user_role FROM users WHERE user_name = ? OR user_email = ?",
    (payload.username, payload.username)
  )
  user = cursor.fetchone()
  conn.close()

  if not user or not verify_password(payload.password, user["password_hash"]):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect username or password"
    )

  return {
    "access_token": f"token_{user['user_name']}",
    "token_type": "bearer",
    "username": user["user_name"],
    "email": user["user_email"],
    "role": user["user_role"]
  }

@app.get("/", response_class=HTMLResponse)
def home():
  return "<h1>CE50<h1>"

@app.get("/projects")
def projects():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM projects").fetchall()
  return [dict(row) for row in rows]

@app.get ("/news")
def news():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM news_item").fetchall()
  return [dict(row) for row in rows]

@app.get("/students")
def students():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM students").fetchall()
  return [dict(row) for row in rows]

@app.get("/teachers")
def teachers():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM teachers").fetchall()
  return [dict(row) for row in rows]

@app.get("/rooms")
def rooms():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM rooms").fetchall()
  return [dict(row) for row in rows]

@app.get("/internship")
def internships():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM internships").fetchall()
  return [dict(row) for row in rows]

@app.get("/companys")
def companys():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute(
    "SELECT rowid AS company_id, company_name, company_image FROM companys"
  ).fetchall()
  return [dict(row) for row in rows]

@app.get("/exam")
def exam_schedule():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM exam_schedules").fetchall()
  return [dict(row) for row in rows]

@app.get("/class")
def class_schedule():
  cursor = sqlite3.connect("ce50.db").cursor()
  cursor.row_factory = sqlite3.Row
  rows = cursor.execute("SELECT * FROM class_schedules").fetchall()
  return [dict(row) for row in rows]

@app.get("/gnews")
def gnews_tech():
  res = httpx.get(
      "http://gnews.io/api/v4/search",
      params={"q": "cpypto", "lang": "en", "apikey": {api_key}}
  )
  return res.json()
