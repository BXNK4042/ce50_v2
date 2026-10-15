"use client";

import { useEffect, useState, useMemo } from "react";
import { ExamSchedules } from "@/types/exam-schedule";
import { CalendarX } from "lucide-react";
import ScheduleFilter from "@/components/ScheduleFilter";

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
          <ScheduleFilter
            availableGens={availableGens}
            selectedGen={selectedGen}
            onSelectGen={setSelectedGen}
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
            totalItems={filteredExams.length}
            itemTypeLabel="ตารางสอบ"
          />

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
