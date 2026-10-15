"use client";

import { useEffect, useState, useMemo } from "react";
import { ClassSchedules } from "@/types/class-schedule";
import { CalendarX } from "lucide-react";
import ScheduleFilter from "@/components/ScheduleFilter";

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
          <ScheduleFilter
            availableGens={availableGens}
            selectedGen={selectedGen}
            onSelectGen={setSelectedGen}
            selectedSemester={selectedSemester}
            onSelectSemester={setSelectedSemester}
            totalItems={filteredClasses.length}
            itemTypeLabel="ตารางเรียน"
          />

          {filteredClasses.length === 0 ? (
            <div className="text-center py-5 my-5 text-secondary border border-secondary rounded bg-black">
              <CalendarX size={48} className="text-muted mb-3 d-block mx-auto" />
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
