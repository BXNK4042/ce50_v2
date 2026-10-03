import os
import sqlite3
from pathlib import Path
from typing import Any, List, Optional

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "ce50.db"
UPLOADS_DIR = BASE_DIR / "uploads"

app = FastAPI()
api_key = os.getenv("GNEWS_API_KEY")

origins = [
  "http://localhost:3000",
  "http://localhost:8000"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


def fetch_all(query: str, params: tuple = ()) -> List[dict[str, Any]]:
  with sqlite3.connect(DB_PATH) as conn:
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    rows = cursor.execute(query, params).fetchall()
    return [dict(row) for row in rows]


@app.get("/", response_class=HTMLResponse)
def home():
  return "<h1>CE50</h1>"


@app.get("/projects")
def projects():
  return fetch_all("SELECT * FROM projects")


@app.get("/news")
def news():
  return fetch_all("SELECT * FROM news_item")


@app.get("/students")
def students():
  # Privacy: exclude student_contact and student_instagram from public endpoint
  return fetch_all(
    "SELECT student_id, student_firstname, student_lastname, student_image, student_role, student_lineage, created_at FROM students"
  )


@app.get("/teachers")
def teachers():
  return fetch_all("SELECT * FROM teachers")


@app.get("/rooms")
def rooms():
  return fetch_all("SELECT * FROM rooms")


@app.get("/internship")
def internships():
  return fetch_all("SELECT * FROM internships")


@app.get("/companys")
def companys():
  return fetch_all(
    "SELECT company_id, company_name, company_image FROM companys"
  )


@app.get("/exam")
def exam_schedule():
  return fetch_all("SELECT * FROM exam_schedules")


@app.get("/class")
def class_schedule():
  return fetch_all("SELECT * FROM class_schedules")


@app.get("/gnews")
def gnews_tech():
  if not api_key:
    return {"articles": []}
  try:
    with httpx.Client(timeout=10.0) as client:
      res = client.get(
        "https://gnews.io/api/v4/search",
        params={"q": "ai", "lang": "en", "apikey": api_key},
      )
      return res.json()
  except Exception as e:
    raise HTTPException(status_code=502, detail=f"GNews upstream error: {str(e)}")
