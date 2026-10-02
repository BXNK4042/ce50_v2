"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ClassSchedules } from "@/types/class-schedule";

const CLASS_TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const CLASS_DAYS = [
  { key: "monday", label: "MONDAY", th: "วันจันทร์" },
  { key: "tuesday", label: "TUESDAY", th: "วันอังคาร" },
  { key: "wednesday", label: "WEDNESDAY", th: "วันพุธ" },
  { key: "thursday", label: "THURSDAY", th: "วันพฤหัสบดี" },
  { key: "friday", label: "FRIDAY", th: "วันศุกร์" },
  { key: "saturday", label: "SATURDAY", th: "วันเสาร์" },
] as const;

// Default fallbacks in case API fails
const DEFAULT_TEACHERS: Record<number, string> = {
  1: "อาจารย์อรรถศาสตร์ นาคเทวัญ",
  2: "ดร.รัตติกร สมบัติแก้ว",
  3: "อาจารย์นภัสรพี สิทธิวัจน์",
  4: "ว่าที่ร้อยตรี ศิลา ศิริมาสกุล",
  5: "อาจารย์สกาวกาญจน์ ปิยะวิทย์วนิช",
  6: "นายจตุรงค์ เกตุนิมิต",
};

const DEFAULT_ROOMS: Record<number, string> = {
  1: "E111",
  2: "E112",
  3: "E113",
  4: "E107",
  5: "B218",
  6: "B217",
};

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassSchedules[]>([]);
  const [teachersMap, setTeachersMap] = useState<Record<number, string>>(DEFAULT_TEACHERS);
  const [roomsMap, setRoomsMap] = useState<Record<number, string>>(DEFAULT_ROOMS);
  const [selectedClass, setSelectedClass] = useState<ClassSchedules | null>(null);

  useEffect(() => {
    // Fetch classes, teachers, rooms concurrently
    Promise.all([
      fetch("http://localhost:8000/class").then((r) => (r.ok ? r.json() : [])),
      fetch("http://localhost:8000/teachers").then((r) => (r.ok ? r.json() : [])),
      fetch("http://localhost:8000/rooms").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([classData, teacherData, roomData]) => {
        if (Array.isArray(classData)) setClasses(classData);

        if (Array.isArray(teacherData) && teacherData.length > 0) {
          const tMap: Record<number, string> = {};
          teacherData.forEach((t: any) => {
            tMap[t.teacher_id] = `${t.teacher_firstname} ${t.teacher_lastname}`;
          });
          setTeachersMap(tMap);
        }

        if (Array.isArray(roomData) && roomData.length > 0) {
          const rMap: Record<number, string> = {};
          roomData.forEach((r: any) => {
            rMap[r.room_id] = r.room_name;
          });
          setRoomsMap(rMap);
        }
      })
      .catch((err) => {
        console.error("Failed to load schedule data:", err);
      });
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedClass(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Pre-calculate 2D grid matrix and row spans for contiguous timeslots
  const { grid, spans } = useMemo(() => {
    // Build hourly map per day
    // e.g. "monday" -> hour "10" -> ClassSchedules
    const hourMap: Record<string, Record<number, ClassSchedules>> = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
    };

    for (const c of classes) {
      const day = c.class_day.toLowerCase();
      if (!hourMap[day]) continue;
      const startH = parseInt(c.class_start.split(":")[0], 10);
      const endH = parseInt(c.class_end.split(":")[0], 10);

      for (let h = startH; h < endH; h++) {
        hourMap[day][h] = c;
      }
    }

    // Grid rows per CLASS_TIME_SLOTS
    const gridRows = CLASS_TIME_SLOTS.map((time) => {
      const slotHour = parseInt(time.split(":")[0], 10);
      return {
        time,
        slotHour,
        monday: hourMap.monday[slotHour] || null,
        tuesday: hourMap.tuesday[slotHour] || null,
        wednesday: hourMap.wednesday[slotHour] || null,
        thursday: hourMap.thursday[slotHour] || null,
        friday: hourMap.friday[slotHour] || null,
        saturday: hourMap.saturday[slotHour] || null,
      };
    });

    // Compute spans
    const spanMatrix = gridRows.map(() =>
      CLASS_DAYS.reduce((acc, d) => {
        acc[d.key] = { rowSpan: 1, shouldRender: true };
        return acc;
      }, {} as Record<string, { rowSpan: number; shouldRender: boolean }>)
    );

    CLASS_DAYS.forEach((d) => {
      for (let r = 0; r < gridRows.length; r++) {
        if (gridRows[r].time === "12:00 - 13:00") {
          spanMatrix[r][d.key].shouldRender = false;
          continue;
        }
        if (!spanMatrix[r][d.key].shouldRender) {
          continue;
        }

        const currentClass = gridRows[r][d.key as keyof typeof gridRows[number]] as ClassSchedules | null;
        if (currentClass) {
          let nextR = r + 1;
          while (nextR < gridRows.length) {
            if (gridRows[nextR].time === "12:00 - 13:00") break;
            const nextClass = gridRows[nextR][d.key as keyof typeof gridRows[number]] as ClassSchedules | null;
            if (nextClass && nextClass.class_id === currentClass.class_id) {
              spanMatrix[r][d.key].rowSpan += 1;
              spanMatrix[nextR][d.key].shouldRender = false;
              nextR++;
            } else {
              break;
            }
          }
          r = nextR - 1;
        }
      }
    });

    return { grid: gridRows, spans: spanMatrix };
  }, [classes]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12 min-h-[calc(100vh-16rem)] flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Sidebar */}
        <div className="flex flex-col w-full md:w-56 shrink-0">
          <h1 className="text-2xl font-bold text-white">นักศึกษาชั้นปีที่ 3</h1>
          <p className="mt-1 text-zinc-400 text-sm">ปี 3</p>
          <p className="mt-1 text-amber-400 font-bold text-xs tracking-wider">
            COMPUTER ENGINEER
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/exam"
              className="relative px-4 py-3 text-sm font-semibold transition-all border rounded-lg overflow-hidden bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200"
            >
              การสอบที่จะถึงนี้
            </Link>
            <Link
              href="/class"
              className="relative px-4 py-3 text-sm font-semibold transition-all border rounded-lg overflow-hidden bg-sky-950/20 text-sky-400 border-sky-900/50 shadow-sm"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
              <span className="pl-1.5">ตารางเรียนรายสัปดาห์</span>
            </Link>
          </div>
        </div>

        {/* Pulsing Vertical Line */}
        <div className="hidden md:block w-px bg-sky-500/70 animate-pulse self-stretch my-2 shrink-0" />

        {/* Right Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 text-white leading-none">
              <svg
                className="w-8 h-8 text-sky-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>ตารางเรียน</span>
            </h2>

            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-sky-400 self-start md:self-auto">
              ภาคเรียนที่ 1 / 2569
            </span>
          </div>

          {/* Weekly Timetable Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[860px] border border-zinc-800">
              <thead>
                <tr className="bg-sky-950/30 border-b border-sky-900/40 text-center">
                  <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-sky-400 border border-zinc-800 w-[120px]">
                    TIME
                  </th>
                  {CLASS_DAYS.map((d) => (
                    <th
                      key={d.key}
                      className="py-3.5 px-3 text-xs font-bold uppercase tracking-wider text-sky-400 border border-zinc-800 min-w-[130px]"
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, index) => (
                  <tr
                    key={row.time}
                    className="border-b border-zinc-850 hover:bg-zinc-900/20 transition-colors"
                  >
                    {/* Time Column */}
                    <td className="py-3 px-3 text-xs font-bold font-mono text-zinc-300 whitespace-nowrap text-center bg-zinc-950/80 border border-zinc-800">
                      {row.time}
                    </td>

                    {/* Lunch Break 12:00 - 13:00 */}
                    {row.time === "12:00 - 13:00" ? (
                      <td
                        colSpan={6}
                        className="py-3.5 px-4 text-center text-xs font-semibold text-zinc-500 uppercase tracking-widest bg-zinc-900/40 border border-zinc-800 user-select-none"
                      >
                        <i className="bi bi-cup-hot me-2 text-zinc-400" />
                        พักกลางวัน (LUNCH BREAK)
                      </td>
                    ) : (
                      CLASS_DAYS.map((d) => {
                        const spanInfo = spans[index][d.key];
                        if (!spanInfo.shouldRender) return null;

                        const item = row[d.key as keyof typeof row] as ClassSchedules | null;

                        if (!item) {
                          return (
                            <td
                              key={d.key}
                              rowSpan={spanInfo.rowSpan}
                              className="py-3 px-2 text-sm text-center text-zinc-700 border border-zinc-850/60"
                            >
                              -
                            </td>
                          );
                        }

                        const teacherName = teachersMap[item.teacher_id] || "อาจารย์ผู้สอน";
                        const roomName = roomsMap[item.room_id] || `ห้อง ${item.room_id}`;
                        const isLab = item.class_name.includes("ปฏิบัติ");

                        return (
                          <td
                            key={d.key}
                            rowSpan={spanInfo.rowSpan}
                            onClick={() => setSelectedClass(item)}
                            className={`py-3 px-3.5 text-left border border-sky-900/40 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] hover:z-20 relative select-none ${
                              isLab
                                ? "bg-sky-950/40 hover:bg-sky-900/50 text-sky-200 border-l-4 border-l-sky-500"
                                : "bg-blue-950/30 hover:bg-blue-900/40 text-blue-200 border-l-4 border-l-blue-500"
                            }`}
                          >
                            <div className="font-bold text-white text-xs leading-snug line-clamp-2">
                              {item.class_name}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                              {item.class_description}
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-white/10 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-black/60 text-sky-300 font-mono font-semibold border border-white/10">
                                {roomName}
                              </span>
                              <span className="text-zinc-400 truncate max-w-[100px]">
                                {teacherName.replace("อาจารย์", "อ.").replace("ว่าที่ร้อยตรี ", "วร.ตร. ")}
                              </span>
                            </div>
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Class Detail Modal Popup */}
      {selectedClass && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          <div
            onClick={() => setSelectedClass(null)}
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          />

          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800 relative bg-gradient-to-br from-blue-950/40 to-zinc-950">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-zinc-300 hover:text-white flex items-center justify-center border border-white/10 cursor-pointer"
              >
                <i className="bi bi-x-lg text-xs" />
              </button>

              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {selectedClass.class_name.includes("ปฏิบัติ") ? "วิชาปฏิบัติการ (LAB)" : "วิชาบรรยาย (LECTURE)"}
              </span>
              <h3 className="text-xl font-extrabold text-white mt-3 leading-snug">
                {selectedClass.class_name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {selectedClass.class_description}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3.5">
              {/* Day & Time */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-sky-400 flex items-center justify-center text-sm">
                    <i className="bi bi-clock-fill" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">วันและเวลาเรียน</span>
                    <span className="text-sm font-bold text-white">
                      {CLASS_DAYS.find((d) => d.key === selectedClass.class_day.toLowerCase())?.th || selectedClass.class_day}{" "}
                      {selectedClass.class_start} - {selectedClass.class_end} น.
                    </span>
                  </div>
                </div>
              </div>

              {/* Room */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm">
                    <i className="bi bi-geo-alt-fill" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">ห้องเรียน</span>
                    <span className="text-sm font-bold text-white">
                      {roomsMap[selectedClass.room_id] || `ห้อง ${selectedClass.room_id}`}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700/50">
                  Room ID: {selectedClass.room_id}
                </span>
              </div>

              {/* Teacher */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm">
                    <i className="bi bi-person-badge-fill" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block">อาจารย์ผู้สอน</span>
                    <span className="text-sm font-bold text-white">
                      {teachersMap[selectedClass.teacher_id] || `อาจารย์ ID: ${selectedClass.teacher_id}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-colors border border-zinc-800 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
