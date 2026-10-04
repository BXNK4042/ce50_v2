"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, AlertTriangle, User, KeyRound, LogIn, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }

      // Save token and user details to localStorage
      localStorage.setItem("ce50_admin_token", data.token);
      localStorage.setItem("ce50_admin_user", JSON.stringify(data.user));

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="card bg-dark text-white border-secondary shadow-lg p-4" style={{ maxWidth: "440px", width: "100%" }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-25 text-primary mb-3">
              <ShieldCheck size={40} />
            </div>
            <h3 className="card-title fw-bold">CE50 Admin Portal</h3>
            <p className="text-secondary small mb-0">เข้าสู่ระบบสำหรับอาจารย์และผู้ดูแลระบบ</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small d-flex align-items-center" role="alert">
              <AlertTriangle size={18} className="me-2 flex-shrink-0" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small text-secondary">ชื่อผู้ใช้ (Username)</label>
              <div className="input-group">
                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-white">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="เช่น adminFah"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small text-secondary">รหัสผ่าน (Password)</label>
              <div className="input-group">
                <span className="input-group-text bg-secondary bg-opacity-25 border-secondary text-white">
                  <KeyRound size={16} />
                </span>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="รหัสผ่านเข้าสู่ระบบ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold mb-3 d-flex justify-content-center align-items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  กำลังตรวจสอบ...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  เข้าสู่ระบบ (Sign In)
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-top border-secondary border-opacity-50">
            <Link href="/" className="text-secondary text-decoration-none small hover:text-white d-inline-flex align-items-center gap-1">
              <ArrowLeft size={16} /> กลับสู่หน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
