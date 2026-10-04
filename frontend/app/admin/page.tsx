"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  UserCheck,
  Users,
  Newspaper,
  Laptop,
  Building,
  Briefcase,
  Calendar,
  FileText,
  DoorOpen,
  PlusCircle,
  Mail,
  CheckCircle,
} from "lucide-react";

interface AdminUser {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"teachers" | "students" | "news" | "projects" | "companies" | "internships" | "class" | "exam" | "rooms">("teachers");
  
  // Data states
  const [teachers, setTeachers] = useState<Record<string, any>[]>([]);
  const [students, setStudents] = useState<Record<string, any>[]>([]);
  const [news, setNews] = useState<Record<string, any>[]>([]);
  const [projects, setProjects] = useState<Record<string, any>[]>([]);
  const [companies, setCompanies] = useState<Record<string, any>[]>([]);
  const [internships, setInternships] = useState<Record<string, any>[]>([]);
  const [classSchedules, setClassSchedules] = useState<Record<string, any>[]>([]);
  const [examSchedules, setExamSchedules] = useState<Record<string, any>[]>([]);
  const [rooms, setRooms] = useState<Record<string, any>[]>([]);

  // Loading & Alert
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "danger"; text: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadingFile, setUploadingFile] = useState(false);

  // Check auth immediately
  useEffect(() => {
    const token = localStorage.getItem("ce50_admin_token");
    const userStr = localStorage.getItem("ce50_admin_user");
    if (!token || !userStr) {
      router.replace("/admin/login");
    } else {
      try {
        const user = JSON.parse(userStr);
        if (user && user.user_id) {
          setCurrentUser(user);
          setIsAuthorized(true);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const loadData = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    try {
      if (activeTab === "teachers") {
        const res = await fetch("/api/teachers");
        setTeachers(await res.json());
      } else if (activeTab === "students") {
        const res = await fetch("/api/students");
        setStudents(await res.json());
      } else if (activeTab === "news") {
        const res = await fetch("/api/news");
        setNews(await res.json());
      } else if (activeTab === "projects") {
        const res = await fetch("/api/projects");
        setProjects(await res.json());
      } else if (activeTab === "companies") {
        const res = await fetch("/api/companys");
        setCompanies(await res.json());
      } else if (activeTab === "internships") {
        const res = await fetch("/api/internship");
        setInternships(await res.json());
      } else if (activeTab === "class") {
        const res = await fetch("/api/class");
        setClassSchedules(await res.json());
      } else if (activeTab === "exam") {
        const res = await fetch("/api/exam");
        setExamSchedules(await res.json());
      } else if (activeTab === "rooms") {
        const res = await fetch("/api/rooms");
        setRooms(await res.json());
      }
    } catch {
      setStatusMsg({ type: "danger", text: "ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้" });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized, loadData]);

  const handleLogout = () => {
    localStorage.removeItem("ce50_admin_token");
    localStorage.removeItem("ce50_admin_user");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ce50_auth_change"));
    }
    router.replace("/admin/login");
  };

  // Open Form for Adding New Record
  const openAddModal = () => {
    setEditingId(null);
    setFormData({});
    setIsModalOpen(true);
  };

  // Open Form for Editing Existing Record
  const openEditModal = (item: Record<string, any>, idKey: string) => {
    setEditingId(item[idKey]);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleUnauthorized = useCallback(() => {
    alert("Session expired or unauthorized");
    localStorage.removeItem("ce50_admin_token");
    localStorage.removeItem("ce50_admin_user");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ce50_auth_change"));
    }
    router.replace("/admin/login");
  }, [router]);

  // Handle Image File Upload to /upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, module: string, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB per TC_TCH_004)
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ภาพต้องไม่เกิน 5MB (TC_TCH_004)");
      return;
    }

    const token = localStorage.getItem("ce50_admin_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setUploadingFile(true);
    const body = new FormData();
    body.append("file", file);
    body.append("module", module);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body,
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        alert(data.detail || "อัปโหลดรูปภาพไม่สำเร็จ");
      } else {
        setFormData((prev) => ({ ...prev, [targetField]: data.filename }));
        setStatusMsg({ type: "success", text: `อัปโหลดไฟล์รูปภาพ ${data.filename} สำเร็จแล้ว` });
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setUploadingFile(false);
    }
  };

  // Save form data (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("ce50_admin_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);

    let endpoint = "";
    if (activeTab === "teachers") endpoint = editingId ? `/teachers/${editingId}` : "/teachers";
    else if (activeTab === "students") endpoint = editingId ? `/students/${editingId}` : "/students";
    else if (activeTab === "news") endpoint = editingId ? `/news/${editingId}` : "/news";
    else if (activeTab === "projects") endpoint = editingId ? `/projects/${editingId}` : "/projects";
    else if (activeTab === "companies") endpoint = editingId ? `/companys/${editingId}` : "/companys";
    else if (activeTab === "internships") endpoint = editingId ? `/internship/${editingId}` : "/internship";
    else if (activeTab === "class") endpoint = editingId ? `/class/${editingId}` : "/class";
    else if (activeTab === "exam") endpoint = editingId ? `/exam/${editingId}` : "/exam";
    else if (activeTab === "rooms") endpoint = editingId ? `/rooms/${editingId}` : "/rooms";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.detail || "การบันทึกข้อมูลล้มเหลว");
      }

      setStatusMsg({ type: "success", text: `บันทึกข้อมูลเรียบร้อยแล้ว (อัปเดตลง Database)` });
      setIsModalOpen(false);
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatusMsg({ type: "danger", text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Record
  const handleDelete = async (id: number | string, entityName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ ${entityName} (ID: ${id}) ออกจากฐานข้อมูล?`)) {
      return;
    }

    const token = localStorage.getItem("ce50_admin_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    let endpoint = "";
    if (activeTab === "teachers") endpoint = `/teachers/${id}`;
    else if (activeTab === "students") endpoint = `/students/${id}`;
    else if (activeTab === "news") endpoint = `/news/${id}`;
    else if (activeTab === "projects") endpoint = `/projects/${id}`;
    else if (activeTab === "companies") endpoint = `/companys/${id}`;
    else if (activeTab === "internships") endpoint = `/internship/${id}`;
    else if (activeTab === "class") endpoint = `/class/${id}`;
    else if (activeTab === "exam") endpoint = `/exam/${id}`;
    else if (activeTab === "rooms") endpoint = `/rooms/${id}`;

    try {
      const res = await fetch(`/api${endpoint}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "ลบข้อมูลไม่สำเร็จ");
      }

      setStatusMsg({ type: "success", text: `ลบข้อมูล ID ${id} ออกจากฐานข้อมูลเรียบร้อยแล้ว` });
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatusMsg({ type: "danger", text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div
        className="template-container py-5 text-center text-white d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "75vh" }}
      >
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Checking authorization...</span>
        </div>
        <p className="text-secondary small">กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</p>
      </div>
    );
  }

  return (
    <div className="template-container py-4 text-white">
      {/* Top Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">CE50 Admin Management Portal</h2>
          <p className="text-secondary small mb-0">ระบบจัดการฐานข้อมูลหลังบ้าน (SQLite Backend CRUD Engine)</p>
        </div>
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          {currentUser && (
            <div className="text-end small">
              <span className="badge bg-primary text-uppercase me-2">{currentUser.user_role}</span>
              <span className="text-light fw-semibold">{currentUser.user_name}</span>
            </div>
          )}
          <Link href="/" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
            <ExternalLink size={14} /> หน้าเว็บหลัก
          </Link>
          <button onClick={handleLogout} className="btn btn-danger btn-sm d-flex align-items-center gap-1">
            <LogOut size={14} /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show py-2 small`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="p-2 rounded-3 bg-black border border-secondary border-opacity-25 d-flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className={`btn ${activeTab === "teachers" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("teachers")}
        >
          <UserCheck size={16} /> อาจารย์ (Teachers)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "students" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("students")}
        >
          <Users size={16} /> นักศึกษา (Students)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "news" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("news")}
        >
          <Newspaper size={16} /> ข่าวสาร (News)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "projects" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("projects")}
        >
          <Laptop size={16} /> โครงงาน (Projects)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "companies" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("companies")}
        >
          <Building size={16} /> บริษัท (Companies)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "internships" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("internships")}
        >
          <Briefcase size={16} /> ฝึกงาน (Internships)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "class" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("class")}
        >
          <Calendar size={16} /> ตารางเรียน (Class)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "exam" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("exam")}
        >
          <FileText size={16} /> ตารางสอบ (Exam)
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "rooms" ? "btn-primary" : "btn-dark"} d-inline-flex align-items-center gap-1`}
          onClick={() => setActiveTab("rooms")}
        >
          <DoorOpen size={16} /> ห้องปฏิบัติการ (Rooms)
        </button>
      </div>

      {/* Action Header for Selected Tab */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-capitalize">
          รายการตาราง {activeTab} ({
            activeTab === "teachers" ? teachers.length :
            activeTab === "students" ? students.length :
            activeTab === "news" ? news.length :
            activeTab === "projects" ? projects.length :
            activeTab === "companies" ? companies.length :
            activeTab === "internships" ? internships.length :
            activeTab === "class" ? classSchedules.length :
            activeTab === "exam" ? examSchedules.length : rooms.length
          } รายการ)
        </h4>
        <button className="btn btn-success d-flex align-items-center gap-1" onClick={openAddModal}>
          <PlusCircle size={16} /> เพิ่มข้อมูลใหม่ (Add New)
        </button>
      </div>

      {/* Main Data Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-secondary small">กำลังดึงข้อมูลจาก Database...</p>
        </div>
      ) : (
        <div className="card shadow-lg border-0 overflow-hidden rounded-3 mb-5">
          <div className="table-responsive">
          {activeTab === "teachers" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ชื่ออังกฤษ</th>
                  <th>อีเมล / ติดต่อ</th>
                  <th>รูปภาพ</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.teacher_id}>
                    <td>{t.teacher_id}</td>
                    <td className="fw-semibold">{t.teacher_firstname} {t.teacher_lastname}</td>
                    <td className="text-secondary">{t.teacher_name_en || "-"}</td>
                    <td>{t.teacher_contact}</td>
                    <td>
                      {t.teacher_image ? (
                        <span className="badge bg-secondary">{t.teacher_image}</span>
                      ) : "-"}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(t, "teacher_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(t.teacher_id, "อาจารย์")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "students" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th>รหัสนักศึกษา</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>สายรหัส</th>
                  <th>อีเมล (Email)</th>
                  <th>Instagram</th>
                  <th>รูปภาพ</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td className="fw-bold text-primary">{s.student_id}</td>
                    <td>{s.student_firstname} {s.student_lastname}</td>
                    <td><span className="badge bg-info text-dark">T{s.student_lineage}</span></td>
                    <td><Mail size={14} className="me-1 text-secondary" />{s.student_email || s.student_contact || "-"}</td>
                    <td>{s.student_instagram ? `@${s.student_instagram}` : "-"}</td>
                    <td>
                      {s.student_image ? (
                        <span className="badge bg-secondary text-truncate" style={{ maxWidth: "120px" }}>{s.student_image}</span>
                      ) : "-"}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(s, "student_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(s.student_id, "นักศึกษา")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "news" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>หัวข้อข่าว</th>
                  <th>หมวดหมู่</th>
                  <th>รายละเอียด</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.news_id}>
                    <td>{n.news_id}</td>
                    <td className="fw-semibold text-primary">{n.news_title}</td>
                    <td><span className="badge bg-secondary">{n.news_category}</span></td>
                    <td className="text-truncate" style={{ maxWidth: "300px" }}>{n.news_description}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(n, "news_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(n.news_id, "ข่าวสาร")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "projects" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>ชื่อโครงงาน</th>
                  <th>คำอธิบายโครงงาน</th>
                  <th>รูปภาพ</th>
                  <th>เล่ม PDF</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.project_id}>
                    <td>{p.project_id}</td>
                    <td className="fw-semibold text-primary">{p.project_name}</td>
                    <td className="text-truncate" style={{ maxWidth: "300px" }}>{p.project_description}</td>
                    <td>{p.project_image || "-"}</td>
                    <td>
                      {p.project_pdf ? (
                        <a
                          href={`/api/uploads/projects/${p.project_pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="badge bg-danger text-decoration-none"
                        >
                          <FileText size={12} className="me-1" />PDF
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(p, "project_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.project_id, "โครงงาน")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "companies" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>ชื่อบริษัท</th>
                  <th>โลโก้ / รูปภาพ</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.company_id}>
                    <td>{c.company_id}</td>
                    <td className="fw-semibold">{c.company_name}</td>
                    <td>{c.company_image || "-"}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(c, "company_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(c.company_id, "บริษัท")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "internships" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>ตำแหน่งฝึกงาน</th>
                  <th>รหัสนักศึกษา</th>
                  <th>รหัสบริษัท</th>
                  <th>รายละเอียด</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((i) => (
                  <tr key={i.internship_id}>
                    <td>{i.internship_id}</td>
                    <td className="fw-semibold text-primary">{i.internship_title}</td>
                    <td>{i.student_id}</td>
                    <td>Company #{i.company_id}</td>
                    <td className="text-truncate" style={{ maxWidth: "300px" }}>{i.internship_description}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(i, "internship_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(i.internship_id, "ฝึกงาน")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "class" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>รุ่น</th>
                  <th>เทอม</th>
                  <th>ชื่อวิชา</th>
                  <th>วัน</th>
                  <th>เวลา</th>
                  <th>ห้องเรียน</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {classSchedules.map((cs) => (
                  <tr key={cs.class_id}>
                    <td>{cs.class_id}</td>
                    <td><span className="badge bg-primary">{cs.generation || "CE04"}</span></td>
                    <td><span className="badge bg-secondary">เทอม {cs.semester || 1}</span></td>
                    <td className="fw-semibold">{cs.class_name}</td>
                    <td><span className="badge bg-secondary text-uppercase">{cs.class_day}</span></td>
                    <td>{cs.class_start} - {cs.class_end}</td>
                    <td>Room #{cs.room_id}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(cs, "class_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(cs.class_id, "ตารางเรียน")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "exam" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>รุ่น</th>
                  <th>เทอม</th>
                  <th>รหัสวิชา</th>
                  <th>ชื่อวิชา</th>
                  <th>ประเภท</th>
                  <th>วันที่สอบ</th>
                  <th>เวลา</th>
                  <th>ห้องสอบ</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {examSchedules.map((es) => (
                  <tr key={es.exam_id}>
                    <td>{es.exam_id}</td>
                    <td><span className="badge bg-primary">{es.generation || "CE04"}</span></td>
                    <td><span className="badge bg-secondary">เทอม {es.semester || 1}</span></td>
                    <td className="fw-bold">{es.exam_code}</td>
                    <td>{es.exam_name}</td>
                    <td>
                      <span className={`badge ${es.exam_final === 1 ? "bg-danger" : "bg-warning text-dark"}`}>
                        {es.exam_final === 1 ? "FINAL" : "MIDTERM"}
                      </span>
                    </td>
                    <td>{es.exam_date}</td>
                    <td>{es.exam_start} - {es.exam_end}</td>
                    <td>{es.exam_room}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(es, "exam_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(es.exam_id, "ตารางสอบ")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "rooms" && (
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light border-bottom">
                <tr>
                  <th style={{ width: "60px" }}>ID</th>
                  <th>ชื่อห้อง</th>
                  <th>คำอธิบายห้อง</th>
                  <th>รูปภาพ</th>
                  <th style={{ width: "160px" }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.room_id}>
                    <td>{r.room_id}</td>
                    <td className="fw-bold text-primary">{r.room_name}</td>
                    <td>{r.room_description}</td>
                    <td>{r.room_image || "-"}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-warning" onClick={() => openEditModal(r, "room_id")}>
                          แก้ไข
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(r.room_id, "ห้องปฏิบัติการ")}>
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      )}

      {/* Modal Dialog Form for Add & Edit (Style 1 Clean Light) */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-white text-dark border-0 rounded-4 shadow-2xl overflow-hidden">
              <div className="modal-header border-bottom px-4 py-3 bg-light bg-opacity-50">
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    {editingId ? `แก้ไขข้อมูล (${activeTab}) ID: ${editingId}` : `เพิ่มข้อมูลใหม่ (${activeTab})`}
                  </h5>
                  <small className="text-secondary">กรอกรายละเอียดข้อมูลในตาราง {activeTab}</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body p-4">
                  {activeTab === "teachers" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">ชื่อจริง (ไทย)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.teacher_firstname || ""}
                          onChange={(e) => setFormData({ ...formData, teacher_firstname: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">นามสกุล (ไทย)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.teacher_lastname || ""}
                          onChange={(e) => setFormData({ ...formData, teacher_lastname: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">ชื่อภาษาอังกฤษ</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.teacher_name_en || ""}
                          onChange={(e) => setFormData({ ...formData, teacher_name_en: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">อีเมล / ช่องทางติดต่อ</label>
                        <input
                          type="email"
                          className="form-control py-2"
                          value={formData.teacher_contact || ""}
                          onChange={(e) => setFormData({ ...formData, teacher_contact: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small">อัปโหลดรูปภาพอาจารย์</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "teachers", "teacher_image")}
                        />
                        {uploadingFile && <span className="small text-warning">กำลังอัปโหลดรูปภาพ...</span>}
                        {formData.teacher_image && <span className="small text-success d-block mt-1">ไฟล์ปัจจุบัน: {formData.teacher_image}</span>}
                      </div>
                    </div>
                  )}

                  {activeTab === "students" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">รหัสนักศึกษา (Student ID)</label>
                        <input
                          type="number"
                          className="form-control py-2"
                          value={formData.student_id || ""}
                          onChange={(e) => setFormData({ ...formData, student_id: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">สายรหัส (เช่น 006, 800)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.student_lineage || ""}
                          onChange={(e) => setFormData({ ...formData, student_lineage: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">ชื่อจริง</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.student_firstname || ""}
                          onChange={(e) => setFormData({ ...formData, student_firstname: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">นามสกุล</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.student_lastname || ""}
                          onChange={(e) => setFormData({ ...formData, student_lastname: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small text-info fw-bold">อีเมลนักศึกษา (Email)</label>
                        <input
                          type="email"
                          className="form-control py-2"
                          placeholder="เช่น 67200412@kmitl.ac.th"
                          value={formData.student_email || formData.student_contact || ""}
                          onChange={(e) => setFormData({ ...formData, student_email: e.target.value, student_contact: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Instagram (ไม่ต้องใส่ @)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.student_instagram || ""}
                          onChange={(e) => setFormData({ ...formData, student_instagram: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small">อัปโหลดรูปภาพนักศึกษา (Student Image)</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "students", "student_image")}
                        />
                        {uploadingFile && <span className="small text-warning">กำลังอัปโหลดรูปภาพ...</span>}
                        {formData.student_image && (
                          <span className="small text-success d-block mt-1">ไฟล์ปัจจุบัน: {formData.student_image}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "news" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small">หัวข้อข่าว</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.news_title || ""}
                          onChange={(e) => setFormData({ ...formData, news_title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">หมวดหมู่ข่าว</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.news_category || ""}
                          onChange={(e) => setFormData({ ...formData, news_category: e.target.value })}
                          placeholder="เช่น กิจกรรม, งานแข่งขัน, สัมมนา"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">อัปโหลดรูปภาพข่าว</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "news", "news_image")}
                        />
                        {formData.news_image && <span className="small text-success d-block mt-1">ไฟล์: {formData.news_image}</span>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small">เนื้อหาข่าว / คำอธิบาย</label>
                        <textarea
                          rows={4}
                          className="form-control py-2"
                          value={formData.news_description || ""}
                          onChange={(e) => setFormData({ ...formData, news_description: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {activeTab === "projects" && (
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small">ชื่อโครงงาน (Project Name)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.project_name || ""}
                          onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">รหัสนักศึกษาเจ้าของโปรเจกต์</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder="เช่น 67200099"
                          value={formData.student_id || ""}
                          onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">อัปโหลดรูปภาพโปรเจกต์</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "projects", "project_image")}
                        />
                        {formData.project_image && <span className="small text-success d-block mt-1">ไฟล์: {formData.project_image}</span>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small">คำอธิบายโครงงาน</label>
                        <textarea
                          rows={3}
                          className="form-control py-2"
                          value={formData.project_description || ""}
                          onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                          required
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label className="form-label small">อัปโหลดไฟล์เล่มโครงงาน (PDF Document)</label>
                        <input
                          type="file"
                          accept=".pdf"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "projects", "project_pdf")}
                        />
                        {uploadingFile && <span className="small text-warning">กำลังอัปโหลดเอกสาร PDF...</span>}
                        {formData.project_pdf && (
                          <span className="small text-danger d-block mt-1">
                            <FileText size={14} className="me-1" />ไฟล์ PDF ปัจจุบัน: {formData.project_pdf}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "companies" && (
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small">ชื่อบริษัท</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.company_name || ""}
                          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">อัปโหลดโลโก้บริษัท</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "companys", "company_image")}
                        />
                        {formData.company_image && <span className="small text-success d-block mt-1">ไฟล์: {formData.company_image}</span>}
                      </div>
                    </div>
                  )}

                  {activeTab === "internships" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">ตำแหน่งฝึกงาน</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.internship_title || ""}
                          onChange={(e) => setFormData({ ...formData, internship_title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">รหัสนักศึกษา</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.student_id || ""}
                          onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">รหัสบริษัท (Company ID)</label>
                        <input
                          type="number"
                          className="form-control py-2"
                          value={formData.company_id || ""}
                          onChange={(e) => setFormData({ ...formData, company_id: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small">รายละเอียดประสบการณ์ฝึกงาน</label>
                        <textarea
                          rows={3}
                          className="form-control py-2"
                          value={formData.internship_description || ""}
                          onChange={(e) => setFormData({ ...formData, internship_description: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {activeTab === "class" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">ชื่อวิชา</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.class_name || ""}
                          onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">รุ่น (Generation)</label>
                        <select
                          className="form-select py-2"
                          value={formData.generation || "CE04"}
                          onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                          required
                        >
                          <option value="CE04">CE04</option>
                          <option value="CE03">CE03</option>
                          <option value="CE02">CE02</option>
                          <option value="CE01">CE01</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">ภาคเรียน (Semester)</label>
                        <select
                          className="form-select py-2"
                          value={formData.semester || 1}
                          onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                          required
                        >
                          <option value={1}>เทอม 1</option>
                          <option value={2}>เทอม 2</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">รหัสอาจารย์ (Teacher ID)</label>
                        <input
                          type="number"
                          className="form-control py-2"
                          value={formData.teacher_id || ""}
                          onChange={(e) => setFormData({ ...formData, teacher_id: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">รหัสห้อง (Room ID)</label>
                        <input
                          type="number"
                          className="form-control py-2"
                          value={formData.room_id || ""}
                          onChange={(e) => setFormData({ ...formData, room_id: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">วัน</label>
                        <select
                          className="form-select py-2"
                          value={formData.class_day || "monday"}
                          onChange={(e) => setFormData({ ...formData, class_day: e.target.value })}
                          required
                        >
                          <option value="monday">Monday (จันทร์)</option>
                          <option value="tuesday">Tuesday (อังคาร)</option>
                          <option value="wednesday">Wednesday (พุธ)</option>
                          <option value="thursday">Thursday (พฤหัสบดี)</option>
                          <option value="friday">Friday (ศุกร์)</option>
                          <option value="saturday">Saturday (เสาร์)</option>
                          <option value="sunday">Sunday (อาทิตย์)</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">เวลาเริ่ม (เช่น 10:00)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.class_start || ""}
                          onChange={(e) => setFormData({ ...formData, class_start: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">เวลาสิ้นสุด (เช่น 12:00)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.class_end || ""}
                          onChange={(e) => setFormData({ ...formData, class_end: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "exam" && (
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label small">รหัสวิชา</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.exam_code || ""}
                          onChange={(e) => setFormData({ ...formData, exam_code: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label small">ชื่อวิชา</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.exam_name || ""}
                          onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small">รุ่น</label>
                        <select
                          className="form-select py-2"
                          value={formData.generation || "CE04"}
                          onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
                          required
                        >
                          <option value="CE04">CE04</option>
                          <option value="CE03">CE03</option>
                          <option value="CE02">CE02</option>
                          <option value="CE01">CE01</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label className="form-label small">เทอม</label>
                        <select
                          className="form-select py-2"
                          value={formData.semester || 1}
                          onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                          required
                        >
                          <option value={1}>เทอม 1</option>
                          <option value={2}>เทอม 2</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">ประเภทการสอบ</label>
                        <select
                          className="form-select py-2"
                          value={formData.exam_final ?? 0}
                          onChange={(e) => setFormData({ ...formData, exam_final: Number(e.target.value) })}
                          required
                        >
                          <option value={0}>กลางภาค (MIDTERM)</option>
                          <option value={1}>ปลายภาค (FINAL)</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">วันที่สอบ (YYYY-MM-DD)</label>
                        <input
                          type="date"
                          className="form-control py-2"
                          value={formData.exam_date || ""}
                          onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">เวลาเริ่ม (เช่น 13:30)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.exam_start || ""}
                          onChange={(e) => setFormData({ ...formData, exam_start: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label small">เวลาสิ้นสุด (เช่น 16:30)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.exam_end || ""}
                          onChange={(e) => setFormData({ ...formData, exam_end: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">ห้องสอบ (เช่น E113)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.exam_room || ""}
                          onChange={(e) => setFormData({ ...formData, exam_room: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "rooms" && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small">ชื่อห้อง (เช่น E107)</label>
                        <input
                          type="text"
                          className="form-control py-2"
                          value={formData.room_name || ""}
                          onChange={(e) => setFormData({ ...formData, room_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">อัปโหลดรูปภาพห้อง</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          className="form-control py-2"
                          onChange={(e) => handleFileUpload(e, "rooms", "room_image")}
                        />
                        {formData.room_image && <span className="small text-success d-block mt-1">ไฟล์: {formData.room_image}</span>}
                      </div>
                      <div className="col-12">
                        <label className="form-label small">คำอธิบายห้องปฏิบัติการ / อุปกรณ์</label>
                        <textarea
                          rows={3}
                          className="form-control py-2"
                          value={formData.room_description || ""}
                          onChange={(e) => setFormData({ ...formData, room_description: e.target.value })}
                          required
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-top px-4 py-3 bg-light bg-opacity-50 d-flex justify-content-between">
                  <button type="button" className="btn btn-light border px-4" onClick={() => setIsModalOpen(false)}>
                    ยกเลิก (Cancel)
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold d-flex align-items-center gap-2" disabled={loading}>
                    <CheckCircle size={16} /> บันทึกข้อมูล (Save)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
