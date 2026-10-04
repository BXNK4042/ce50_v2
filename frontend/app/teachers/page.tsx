"use client";

import { useEffect, useState } from "react";
import { Teachers } from "@/types/teacher";
import Image from "next/image";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eggCount, setEggCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);

  const handleEggClick = () => {
    const next = eggCount + 1;
    if (next >= 5) {
      setShowEgg(true);
      setEggCount(0);
    } else {
      setEggCount(next);
    }
  };

  useEffect(() => {
    async function getTeachers() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/teachers");
        if (!response.ok) throw new Error("Failed to fetch teachers");
        setTeachers(await response.json());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching teachers");
      } finally {
        setLoading(false);
      }
    }

    getTeachers();
  }, []);

  return (
    <div className="template-container">
      <div className="mt-5 mb-5 cursor-pointer user-select-none" onClick={handleEggClick}>
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary d-flex align-items-center gap-2">
          คณาจารย์ {eggCount > 0 && <span className="badge bg-secondary fs-6 opacity-50">🥚 {eggCount}/5</span>}
        </h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {teachers.map((teacher) => (
            <div className="col" key={teacher.teacher_id}>
              <div
                className="card text-bg-dark justify-content-center align-items-center hover:opacity-75 duration-150 user-select-none"
                draggable="false"
              >
                <Image
                  src={`/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
                  alt={teacher.teacher_firstname}
                  width={1000}
                  height={1000}
                  draggable="false"
                />
                <div className="card-body text-center">
                  <h5 className="card-title">
                    {teacher.teacher_firstname} {teacher.teacher_lastname}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEgg && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-warning shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-warning d-flex align-items-center gap-2">
                  <span>🥚</span> CE50 Easter Egg Unlocked!
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEgg(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="display-1 mb-3">🎓✨</div>
                <h4 className="text-light fw-bold mb-2">ยินดีด้วย! คุณค้นพบห้องพักอาจารย์ลับ</h4>
                <p className="text-secondary small mb-4">
                  บัฟพิเศษสำหรับนักศึกษา CE50 ที่คลิกครบ 5 ครั้ง:
                </p>
                <div className="d-flex flex-column gap-2 text-start bg-black p-3 rounded border border-secondary mb-3">
                  <div className="text-success small">⚡ +100 Infinite Compiler Debugging Luck</div>
                  <div className="text-info small">☕ +200 Resistance to Sleep Deprivation</div>
                  <div className="text-warning small">🔥 +999 Project Submission Deadline Protection</div>
                </div>
                <p className="text-muted small mb-0 font-monospace">
                  "Talk is cheap. Show me the code." — Linus Torvalds
                </p>
              </div>
              <div className="modal-footer border-secondary justify-content-center">
                <button
                  type="button"
                  className="btn btn-warning px-4 fw-bold"
                  onClick={() => setShowEgg(false)}
                >
                  รับบัฟแล้วไปปั่นโปรเจกต์ต่อ! 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
