"use client";

import { useEffect, useState, useMemo } from "react";
import { ClassSchedules } from "@/types/class-schedule";

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassSchedules[]>([]);
  const [selectedGen, setSelectedGen] = useState<string>("CE04");
  const [selectedSemester, setSelectedSemester] = useState<number | "All">(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getClasses() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/class");
        if (!response.ok) throw new Error("Failed to fetch class schedules");
        setClasses(await response.json());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching classes");
      } finally {
        setLoading(false);
      }
    }

    getClasses();
  }, []);

  const availableGens = useMemo(() => {
    const gens = new Set<string>(["CE04", "CE03", "CE02", "CE01"]);
    classes.forEach((c) => {
      if (c.generation) gens.add(c.generation);
    });
    return ["All", ...Array.from(gens).sort().reverse()];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchGen =
        selectedGen === "All" || (c.generation || "CE04") === selectedGen;
      const matchSemester =
        selectedSemester === "All" || (c.semester ?? 1) === selectedSemester;
      return matchGen && matchSemester;
    });
  }, [classes, selectedGen, selectedSemester]);

  return (
    <div className="template-container">
      <div className="mt-5 mb-4">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ตารางเรียน</h1>
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
                พบ {filteredClasses.length} รายการ
              </span>
            </div>
          </div>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-5 my-5 text-secondary border border-secondary rounded bg-black">
              <i className="bi bi-calendar-x display-4 text-muted mb-3 d-block"></i>
              <h5>ไม่พบตารางเรียนสำหรับเงื่อนไขที่เลือก</h5>
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
                      <th className="py-3">ชื่อวิชา</th>
                      <th className="py-3">คำอธิบาย</th>
                      <th className="py-3 text-center">รหัสอาจารย์</th>
                      <th className="py-3 text-center">ห้อง</th>
                      <th className="py-3">วัน</th>
                      <th className="py-3">เวลาเรียน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((classSchedule) => (
                      <tr key={classSchedule.class_id}>
                        <td className="px-3 font-monospace text-muted">{classSchedule.class_id}</td>
                        <td className="text-center">
                          <span className="badge bg-primary text-white">
                            {classSchedule.generation || "CE04"}
                          </span>
                        </td>
                        <td className="text-center text-muted small">
                          เทอม {classSchedule.semester || 1}
                        </td>
                        <td className="fw-semibold text-dark">{classSchedule.class_name}</td>
                        <td className="text-muted small">{classSchedule.class_description}</td>
                        <td className="text-center font-monospace">{classSchedule.teacher_id}</td>
                        <td className="text-center">
                          <span className="badge bg-secondary text-white">
                            Room #{classSchedule.room_id}
                          </span>
                        </td>
                        <td className="text-capitalize text-dark fw-medium">{classSchedule.class_day}</td>
                        <td className="font-monospace text-dark small fw-semibold">
                          {classSchedule.class_start} - {classSchedule.class_end}
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
