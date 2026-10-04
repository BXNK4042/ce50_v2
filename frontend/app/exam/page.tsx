"use client";

import { useEffect, useState, useMemo } from "react";
import { ExamSchedules } from "@/types/exam-schedule";
import { CalendarX } from "lucide-react";

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
          {/* Dual Filter: Generation + Semester Selector (Matching Style 1 Clean Light) */}
          <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white text-dark p-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="text-secondary small fw-bold text-uppercase me-1">เลือกรุ่น:</span>
                <div className="btn-group btn-group-sm" role="group">
                  {availableGens.map((gen) => (
                    <button
                      key={gen}
                      type="button"
                      className={`btn ${
                        selectedGen === gen
                          ? "btn-primary text-white fw-semibold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setSelectedGen(gen)}
                    >
                      {gen === "All" ? "ทุกรุ่น (All)" : `รุ่น ${gen}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="text-secondary small fw-bold text-uppercase me-1">ภาคเรียน:</span>
                <div className="btn-group btn-group-sm" role="group">
                  {[1, 2, "All"].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      className={`btn ${
                        selectedSemester === sem
                          ? "btn-primary text-white fw-semibold"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => setSelectedSemester(sem as number | "All")}
                    >
                      {sem === "All" ? "ทุกเทอม" : `เทอม ${sem}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center text-muted small pt-2">
              <span>
                กำลังแสดง: <strong className="text-dark">{selectedGen === "All" ? "ทุกรุ่น" : selectedGen}</strong> |{" "}
                <strong className="text-dark">
                  {selectedSemester === "All"
                    ? "ทุกภาคการศึกษา"
                    : `ภาคการศึกษาที่ ${selectedSemester}`}
                </strong>
              </span>
              <span className="badge bg-light text-dark border">
                พบ {filteredExams.length} รายการ
              </span>
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="text-center py-5 my-5 text-secondary border border-secondary rounded bg-black">
              <CalendarX size={48} className="text-muted mb-3 d-block mx-auto" />
              <h5>ไม่พบตารางสอบสำหรับเงื่อนไขที่เลือก</h5>
              <p className="small mb-0">ลองเลือกเปลี่ยนรุ่นหรือภาคการศึกษาอื่น</p>
            </div>
          ) : (
            <div className="card shadow-lg border-0 overflow-hidden rounded-3 mb-5">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 align-middle">
                  <thead className="table-light border-bottom">
                    <tr>
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 text-center">รุ่น</th>
                      <th className="py-3 text-center">เทอม</th>
                      <th className="py-3">รหัสวิชา</th>
                      <th className="py-3">ชื่อวิชา</th>
                      <th className="py-3 text-center">ประเภทสอบ</th>
                      <th className="py-3">วันที่สอบ</th>
                      <th className="py-3">เวลาสอบ</th>
                      <th className="py-3 text-center">ห้องสอบ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExams.map((exam) => (
                      <tr key={exam.exam_id}>
                        <td className="px-3 font-monospace text-muted">{exam.exam_id}</td>
                        <td className="text-center">
                          <span className="badge bg-primary text-white">
                            {exam.generation || "CE04"}
                          </span>
                        </td>
                        <td className="text-center text-muted small">
                          เทอม {exam.semester || 1}
                        </td>
                        <td className="font-monospace text-dark fw-bold">{exam.exam_code}</td>
                        <td className="fw-semibold text-dark">{exam.exam_name}</td>
                        <td className="text-center">
                          <span
                            className={`badge ${
                              exam.exam_final ? "bg-danger text-white" : "bg-warning text-dark"
                            }`}
                          >
                            {exam.exam_final ? "FINAL" : "MIDTERM"}
                          </span>
                        </td>
                        <td className="text-muted small">{exam.exam_date}</td>
                        <td className="font-monospace text-dark small fw-semibold">
                          {exam.exam_start} - {exam.exam_end}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary text-white">
                            {exam.exam_room}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
