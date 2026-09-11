import sqlite3
import os
import json
import urllib.request
from typing import Optional
from pydantic import BaseModel

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

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

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

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
def gnews():
  api_key = os.getenv("GNEWS_API_KEY", "")
  if api_key:
    try:
      url = f"https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=4&apikey={api_key}"
      req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
      with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode("utf-8"))
    except Exception:
      pass
  return {
    "articles": [
      {
        "title": "Refugees flood Turkey's border with Greece",
        "description": "Lorem Ipsum has been the industry's standard dummy text",
        "image": "/404.png",
        "url": "#"
      },
      {
        "title": "South Korea’s Moon Jae-in sworn in vowing address",
        "description": "Lorem Ipsum has been the industry's standard dummy text",
        "image": "/404.png",
        "url": "#"
      },
      {
        "title": "These puppies are training to assist in avalanche rescue",
        "description": "Lorem Ipsum has been the industry's standard dummy text",
        "image": "/404.png",
        "url": "#"
      },
      {
        "title": "'Love Is Blind' couple opens up about their first year",
        "description": "Lorem Ipsum has been the industry's standard dummy text",
        "image": "/404.png",
        "url": "#"
      }
    ]
  }

class NewsCreate(BaseModel):
  news_title: str
  news_description: Optional[str] = None
  news_category: str
  news_image: Optional[str] = None

class TeacherCreate(BaseModel):
  teacher_firstname: str
  teacher_lastname: str
  teacher_name_en: Optional[str] = None
  teacher_contact: str
  teacher_image: Optional[str] = None

class StudentCreate(BaseModel):
  student_firstname: str
  student_lastname: str
  student_lineage: str
  student_contact: str
  student_role: Optional[str] = None
  student_instagram: Optional[str] = None

@app.post("/news")
def create_news(item: NewsCreate):
  conn = sqlite3.connect("ce50.db")
  cur = conn.cursor()
  cur.execute(
    "INSERT INTO news_item (news_title, news_description, news_category, news_image) VALUES (?, ?, ?, ?)",
    (item.news_title, item.news_description, item.news_category, item.news_image),
  )
  conn.commit()
  return {"success": True, "id": cur.lastrowid}

@app.delete("/news/{news_id}")
def delete_news(news_id: int):
  conn = sqlite3.connect("ce50.db")
  conn.execute("DELETE FROM news_item WHERE news_id = ?", (news_id,))
  conn.commit()
  return {"success": True}

@app.post("/teachers")
def create_teacher(item: TeacherCreate):
  conn = sqlite3.connect("ce50.db")
  cur = conn.cursor()
  cur.execute(
    "INSERT INTO teachers (teacher_firstname, teacher_lastname, teacher_name_en, teacher_contact, teacher_image) VALUES (?, ?, ?, ?, ?)",
    (item.teacher_firstname, item.teacher_lastname, item.teacher_name_en, item.teacher_contact, item.teacher_image),
  )
  conn.commit()
  return {"success": True, "id": cur.lastrowid}

@app.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int):
  conn = sqlite3.connect("ce50.db")
  conn.execute("DELETE FROM teachers WHERE teacher_id = ?", (teacher_id,))
  conn.commit()
  return {"success": True}

@app.post("/students")
def create_student(item: StudentCreate):
  conn = sqlite3.connect("ce50.db")
  cur = conn.cursor()
  cur.execute(
    "INSERT INTO students (student_firstname, student_lastname, student_lineage, student_contact, student_role, student_instagram) VALUES (?, ?, ?, ?, ?, ?)",
    (item.student_firstname, item.student_lastname, item.student_lineage, item.student_contact, item.student_role, item.student_instagram),
  )
  conn.commit()
  return {"success": True, "id": cur.lastrowid}

@app.delete("/students/{student_id}")
def delete_student(student_id: int):
  conn = sqlite3.connect("ce50.db")
  conn.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
  conn.commit()
  return {"success": True}

