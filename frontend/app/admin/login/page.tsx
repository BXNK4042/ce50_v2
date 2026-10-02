"use client";

import { useState } from "react";
import Image from "next/image";
import ce_logo from "@/public/ce_logo.webp";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const performLogin = async (u: string, p: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });

      if (res.ok) {
        const data = await res.json();
        setLoggedInUser(data);
        setShowSuccess(true);
        try {
          localStorage.setItem("admin_token", data.access_token);
          localStorage.setItem("admin_user", JSON.stringify(data));
          document.cookie = `admin_token=${data.access_token}; path=/; max-age=86400`;
        } catch (_) {}

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.detail || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }
    performLogin(username, password);
  };

  const handleQuickSignIn = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    performLogin(u, p);
  };

  return (
    <main className="w-full min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-black text-white select-none">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fadeIn">
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-semibold px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <i className="bi bi-check-circle-fill text-emerald-400 fs-5" />
            <div>
              <p className="mb-0 text-sm font-bold">เข้าสู่ระบบสำเร็จ!</p>
              <p className="mb-0 text-xs text-emerald-400/80">
                ยินดีต้อนรับ {loggedInUser?.username} ({loggedInUser?.role})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Card Wrapper */}
      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg mb-1">
            <Image
              src={ce_logo}
              alt="CE Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-white uppercase drop-shadow-md">
            ADMIN LOGIN
          </h1>
          <p className="text-xs text-zinc-400 font-medium">
            ระบบจัดการสารสนเทศและเนื้อหาสำหรับผู้ดูแลระบบ
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          {/* Quick Sign-In (Dev Mode) */}
          <div className="flex flex-col gap-2.5 p-3.5 bg-zinc-900/60 border border-dashed border-zinc-800 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-amber-400">⚡</span> ทดสอบเข้าสู่ระบบด่วน
              </span>
              <span className="text-[10px] text-zinc-500 font-mono bg-zinc-800/80 px-2 py-0.5 rounded">Dev Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickSignIn("superadmin", "super1234")}
                className="px-2 py-2 text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all text-center rounded-lg cursor-pointer disabled:opacity-50"
              >
                Super Admin
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickSignIn("admin_y1", "admin1234")}
                className="px-2 py-2 text-xs font-semibold bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all text-center rounded-lg cursor-pointer disabled:opacity-50"
              >
                Admin (Y1)
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickSignIn("writer_y1", "writer1234")}
                className="px-2 py-2 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all text-center rounded-lg cursor-pointer disabled:opacity-50"
              >
                Writer (Y1)
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill text-red-400 text-sm" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                ชื่อผู้ใช้หรืออีเมล (Username / Email)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                  <i className="bi bi-person-fill" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin หรือ admin@ce.ac.th"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                  <i className="bi bi-lock-fill" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full pl-10 pr-11 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} text-sm`} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right text-base" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-zinc-600">
          🔒 เฉพาะผู้ดูแลระบบและบุคลากรที่ได้รับอนุญาตเท่านั้น
        </p>
      </div>
    </main>
  );
}
