"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [tab, setTab] = useState<"news" | "teachers" | "students">("news");

  // Data states
  const [newsList, setNewsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);

  // News form state
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDesc, setNewsDesc] = useState("");
  const [newsCat, setNewsCat] = useState("Technology");
  const [newsImg, setNewsImg] = useState("");

  // Teacher form state
  const [tFirst, setTFirst] = useState("");
  const [tLast, setTLast] = useState("");
  const [tEn, setTEn] = useState("");
  const [tContact, setTContact] = useState("");
  const [tImg, setTImg] = useState("");

  // Student form state
  const [sFirst, setSFirst] = useState("");
  const [sLast, setSLast] = useState("");
  const [sLineage, setSLineage] = useState("");
  const [sContact, setSContact] = useState("");
  const [sRole, setSRole] = useState("");
  const [sIg, setSIg] = useState("");

  const refreshNews = async () => {
    const res = await fetch("http://localhost:8000/news");
    setNewsList(await res.json());
  };

  const refreshTeachers = async () => {
    const res = await fetch("http://localhost:8000/teachers");
    setTeachersList(await res.json());
  };

  const refreshStudents = async () => {
    const res = await fetch("http://localhost:8000/students");
    setStudentsList(await res.json());
  };

  useEffect(() => {
    refreshNews();
    refreshTeachers();
    refreshStudents();
  }, []);

  // News Actions
  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        news_title: newsTitle,
        news_description: newsDesc,
        news_category: newsCat,
        news_image: newsImg || null,
      }),
    });
    setNewsTitle("");
    setNewsDesc("");
    setNewsImg("");
    refreshNews();
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Delete this news?")) return;
    await fetch(`http://localhost:8000/news/${id}`, { method: "DELETE" });
    refreshNews();
  };

  // Teachers Actions
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacher_firstname: tFirst,
        teacher_lastname: tLast,
        teacher_name_en: tEn || null,
        teacher_contact: tContact,
        teacher_image: tImg || null,
      }),
    });
    setTFirst("");
    setTLast("");
    setTEn("");
    setTContact("");
    setTImg("");
    refreshTeachers();
  };

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm("Delete this teacher?")) return;
    await fetch(`http://localhost:8000/teachers/${id}`, { method: "DELETE" });
    refreshTeachers();
  };

  // Students Actions
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_firstname: sFirst,
        student_lastname: sLast,
        student_lineage: sLineage,
        student_contact: sContact,
        student_role: sRole || null,
        student_instagram: sIg || null,
      }),
    });
    setSFirst("");
    setSLast("");
    setSLineage("");
    setSContact("");
    setSRole("");
    setSIg("");
    refreshStudents();
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await fetch(`http://localhost:8000/students/${id}`, { method: "DELETE" });
    refreshStudents();
  };

  return (
    <div className="container py-4 text-light">
      <h1 className="mb-4 text-primary">Admin CRUD</h1>

      <div className="btn-group mb-4">
        <button
          className={`btn ${tab === "news" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("news")}
        >
          News
        </button>
        <button
          className={`btn ${tab === "teachers" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={`btn ${tab === "students" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setTab("students")}
        >
          Students
        </button>
      </div>

      {tab === "news" && (
        <div>
          <h3>Manage News</h3>
          <form onSubmit={handleAddNews} className="card p-3 bg-dark mb-4">
            <h5>Add News</h5>
            <div className="mb-2">
              <input
                className="form-control"
                placeholder="Title"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Description"
                value={newsDesc}
                onChange={(e) => setNewsDesc(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                className="form-control"
                placeholder="Category"
                value={newsCat}
                onChange={(e) => setNewsCat(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <input
                className="form-control"
                placeholder="Image filename"
                value={newsImg}
                onChange={(e) => setNewsImg(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Add News
            </button>
          </form>

          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((item) => (
                <tr key={item.news_id}>
                  <td>{item.news_id}</td>
                  <td>{item.news_title}</td>
                  <td>{item.news_category}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteNews(item.news_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "teachers" && (
        <div>
          <h3>Manage Teachers</h3>
          <form onSubmit={handleAddTeacher} className="card p-3 bg-dark mb-4">
            <h5>Add Teacher</h5>
            <div className="row g-2 mb-2">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="First Name"
                  value={tFirst}
                  onChange={(e) => setTFirst(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  value={tLast}
                  onChange={(e) => setTLast(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="English Name (e.g. silar)"
                  value={tEn}
                  onChange={(e) => setTEn(e.target.value)}
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Contact"
                  value={tContact}
                  onChange={(e) => setTContact(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Add Teacher
            </button>
          </form>

          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachersList.map((t) => (
                <tr key={t.teacher_id}>
                  <td>{t.teacher_id}</td>
                  <td>
                    {t.teacher_firstname} {t.teacher_lastname}
                  </td>
                  <td>{t.teacher_contact}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTeacher(t.teacher_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "students" && (
        <div>
          <h3>Manage Students</h3>
          <form onSubmit={handleAddStudent} className="card p-3 bg-dark mb-4">
            <h5>Add Student</h5>
            <div className="row g-2 mb-2">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="First Name"
                  value={sFirst}
                  onChange={(e) => setSFirst(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Last Name"
                  value={sLast}
                  onChange={(e) => setSLast(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row g-2 mb-2">
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Lineage"
                  value={sLineage}
                  onChange={(e) => setSLineage(e.target.value)}
                  required
                />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  placeholder="Contact"
                  value={sContact}
                  onChange={(e) => setSContact(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">
              Add Student
            </button>
          </form>

          <table className="table table-dark table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Lineage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((s) => (
                <tr key={s.student_id}>
                  <td>{s.student_id}</td>
                  <td>
                    {s.student_firstname} {s.student_lastname}
                  </td>
                  <td>{s.student_lineage}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteStudent(s.student_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
