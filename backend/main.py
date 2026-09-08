import sqlite3

from fastapi import FastAPI
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
