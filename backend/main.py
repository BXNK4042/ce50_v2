import sqlite3
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "ce50.db"

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

app.mount("/uploads", StaticFiles(directory=BASE_DIR / "uploads"), name="uploads")


def fetch_all(query):
  with sqlite3.connect(DB_PATH) as connection:
    connection.row_factory = sqlite3.Row
    return [dict(row) for row in connection.execute(query)]

@app.get("/", response_class=HTMLResponse)
def home():
  return "<h1>CE50<h1>"

@app.get("/projects")
def projects():
  return fetch_all("SELECT * FROM projects")

@app.get ("/news")
def news():
  return fetch_all("SELECT * FROM news_item")

@app.get("/students")
def students():
  return fetch_all("SELECT student_id, student_firstname, student_lastname, student_image, student_role, student_lineage, created_at FROM students")

@app.get("/teachers")
def teachers():
  return fetch_all("SELECT * FROM teachers")

@app.get("/rooms")
def rooms():
  return fetch_all("SELECT * FROM rooms")

@app.get("/internship")
def internships():
  return fetch_all("SELECT * FROM internships")

@app.get("/exam")
def exam_schedule():
  return fetch_all("SELECT * FROM exam_schedules")

@app.get("/class")
def class_schedule():
  return fetch_all("SELECT * FROM class_schedules")
