"use client";

import { useEffect, useState, useMemo } from "react";
import { ExamSchedules } from "@/types/exam-schedule";

export default function ExamPage() {
  const [exams, setExams] = useState<ExamSchedules[]>([]);
  const [selectedGen, setSelectedGen] = useState<string>("CE04");
  const [selectedSemester, setSelectedSemester] = useState<number | "All">(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getExams() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/exam");
        if (!response.ok) throw new Error("Failed to fetch exam schedules");
        setExams(await response.json());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching exams");
      } finally {
        setLoading(false);
      }
    }

    getExams();
  }, []);

  const availableGens = useMemo(() => {
    const gens = new Set<string>(["CE04", "CE03", "CE02", "CE01"]);
    exams.forEach((e) => {
      if (e.generation) gens.add(e.generation);
    });
    return ["All", ...Array.from(gens).sort().reverse()];
  }, [exams]);

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchGen =
        selectedGen === "All" || (e.generation || "CE04") === selectedGen;
      const matchSemester =
        selectedSemester === "All" || (e.semester ?? 1) === selectedSemester;
      return matchGen && matchSemester;
    });
  }, [exams, selectedGen, selectedSemester]);

  return (
    <div className="template-container">
      <div className="mt-5 mb-4">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ตารางสอบ</h1>
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
        <>
          {/* Dual Filter: Generation + Semester Selector */}
          <div className="bg-dark p-3 rounded border border-secondary mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-bold text-uppercase">เลือกรุ่น:</span>
                <ul className="nav nav-pills gap-1">
                  {availableGens.map((gen) => (
                    <li className="nav-item" key={gen}>
                      <button
                        type="button"
                        className={`nav-link py-1 px-3 small ${
                          selectedGen === gen
                            ? "active bg-primary text-white"
                            : "text-light bg-black border border-secondary"
                        }`}
                        onClick={() => setSelectedGen(gen)}
                      >
                        {gen === "All" ? "ทุกรุ่น (All)" : `รุ่น ${gen}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-secondary small fw-bold text-uppercase">ภาคเรียน:</span>
                <ul className="nav nav-pills gap-1">
                  {[1, 2, "All"].map((sem) => (
                    <li className="nav-item" key={sem}>
                      <button
                        type="button"
                        className={`nav-link py-1 px-3 small ${
                          selectedSemester === sem
                            ? "active bg-primary text-white"
                            : "text-light bg-black border border-secondary"
                        }`}
                        onClick={() => setSelectedSemester(sem as number | "All")}
                      >
                        {sem === "All"
                          ? "ทุกเทอม"
                          : `เทอม ${sem}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center text-secondary small">
              <span>
                กำลังแสดง: <strong>{selectedGen === "All" ? "ทุกรุ่น" : selectedGen}</strong> |{" "}
                <strong>{selectedSemester === "All" ? "ทุกภาคการศึกษา" : `ภาคการศึกษาที่ ${selectedSemester}`}</strong>
              </span>
              <span>พบ {filteredExams.length} รายการ</span>
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="text-center py-5 my-5 text-secondary border border-secondary rounded bg-black">
              <i className="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
              <h5>ไม่พบตารางสอบสำหรับเงื่อนไขที่เลือก</h5>
              <p className="small mb-0">ลองเลือกเปลี่ยนรุ่นหรือภาคการศึกษาอื่น</p>
            </div>
          ) : (
            <div className="table-responsive mb-5">
              <table className="table table-dark table-striped table-hover align-middle border-secondary">
                <thead>
                  <tr className="table-primary text-dark">
                    <th>ID</th>
                    <th>รุ่น</th>
                    <th>เทอม</th>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>ประเภทสอบ</th>
                    <th>วันที่สอบ</th>
                    <th>เวลาสอบ</th>
                    <th>ห้องสอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((exam) => (
                    <tr key={exam.exam_id}>
                      <td>{exam.exam_id}</td>
                      <td>
                        <span className="badge bg-primary">
                          {exam.generation || "CE04"}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          เทอม {exam.semester || 1}
                        </span>
                      </td>
                      <td className="font-monospace text-warning small">{exam.exam_code}</td>
                      <td className="fw-semibold text-light">{exam.exam_name}</td>
                      <td>
                        <span
                          className={`badge ${
                            exam.exam_final ? "bg-danger" : "bg-info text-dark"
                          }`}
                        >
                          {exam.exam_final ? "Final" : "Midterm"}
                        </span>
                      </td>
                      <td>{exam.exam_date}</td>
                      <td className="font-monospace text-info small">
                        {exam.exam_start} - {exam.exam_end}
                      </td>
                      <td>
                        <span className="badge bg-dark border border-secondary">
                          {exam.exam_room}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
