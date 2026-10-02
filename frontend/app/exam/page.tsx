"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ExamSchedules } from "@/types/exam-schedule";

interface GroupedExam {
  code: string;
  name: string;
  midterm?: {
    date: string;
    start: string;
    end: string;
    room: string;
    rawDateTime: Date;
  };
  final?: {
    date: string;
    start: string;
    end: string;
    room: string;
    rawDateTime: Date;
  };
}

const MONTH_NAMES_TH = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

function formatThaiDate(dateStr: string): string {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  if (!d || !m || !y) return dateStr;
  const day = parseInt(d, 10);
  const month = MONTH_NAMES_TH[parseInt(m, 10) - 1] || m;
  const yearTh = parseInt(y, 10) + 543;
  return `${day} ${month} ${yearTh}`;
}

export default function ExamPage() {
  const [exams, setExams] = useState<ExamSchedules[]>([]);
  const [currentTerm, setCurrentTerm] = useState<"all" | "midterm" | "finals">("all");
  const [countdownText, setCountdownText] = useState<string>("");

  useEffect(() => {
    async function getExams() {
      try {
        const response = await fetch("http://localhost:8000/exam");
        if (response.ok) {
          const data: ExamSchedules[] = await response.json();
          setExams(data);
        }
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    }

    getExams();
  }, []);

  // Group raw exam rows by subject code
  const groupedExams = useMemo(() => {
    const map = new Map<string, GroupedExam>();

    for (const item of exams) {
      if (!map.has(item.exam_code)) {
        // Clean name by stripping (MIDTERM) or (FINAL)
        const cleanName = item.exam_name
          .replace(/\s*\(MIDTERM\)/i, "")
          .replace(/\s*\(FINAL\)/i, "")
          .trim();

        map.set(item.exam_code, {
          code: item.exam_code,
          name: cleanName || item.exam_name,
        });
      }

      const entry = map.get(item.exam_code)!;
      const [h, min] = (item.exam_start || "00:00").split(":");
      const [y, m, d] = (item.exam_date || "2026-01-01").split("-");
      const dt = new Date(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
        parseInt(h || "0", 10),
        parseInt(min || "0", 10)
      );

      const slot = {
        date: item.exam_date,
        start: item.exam_start,
        end: item.exam_end,
        room: item.exam_room,
        rawDateTime: dt,
      };

      if (item.exam_final === 1) {
        entry.final = slot;
      } else {
        entry.midterm = slot;
      }
    }

    return Array.from(map.values());
  }, [exams]);

  // Live countdown timer to the closest upcoming exam
  useEffect(() => {
    if (exams.length === 0) return;

    const updateCountdown = () => {
      const now = new Date();
      const allSlots = exams
        .map((item) => {
          const [h, min] = (item.exam_start || "00:00").split(":");
          const [y, m, d] = (item.exam_date || "2026-01-01").split("-");
          const dt = new Date(
            parseInt(y, 10),
            parseInt(m, 10) - 1,
            parseInt(d, 10),
            parseInt(h || "0", 10),
            parseInt(min || "0", 10)
          );
          return { ...item, dateTime: dt };
        })
        .filter((item) => item.dateTime.getTime() > now.getTime())
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

      if (allSlots.length === 0) {
        setCountdownText("สิ้นสุดการสอบทั้งหมดแล้ว");
        return;
      }

      const nextExam = allSlots[0];
      const diff = nextExam.dateTime.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const examTypeLabel = nextExam.exam_final ? "Final" : "Midterm";
      setCountdownText(
        `สอบถัดไป (${examTypeLabel}): ${nextExam.exam_code} อีก ${days} วัน ${hours} ชม. ${minutes} น. ${seconds} วิ`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [exams]);

  // Filtered list based on segmented switcher
  const filteredExams = useMemo(() => {
    if (currentTerm === "midterm") {
      return groupedExams.filter((e) => e.midterm);
    }
    if (currentTerm === "finals") {
      return groupedExams.filter((e) => e.final);
    }
    return groupedExams;
  }, [groupedExams, currentTerm]);

  const activeIndex = currentTerm === "finals" ? 2 : currentTerm === "midterm" ? 1 : 0;

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
              className="relative px-4 py-3 text-sm font-semibold transition-all border rounded-lg overflow-hidden bg-sky-950/20 text-sky-400 border-sky-900/50 shadow-sm"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
              <span className="pl-1.5">การสอบที่จะถึงนี้</span>
            </Link>
            <Link
              href="/class"
              className="relative px-4 py-3 text-sm font-semibold transition-all border rounded-lg overflow-hidden bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200"
            >
              ตารางเรียนรายสัปดาห์
            </Link>
          </div>
        </div>

        {/* Pulsing Vertical Line */}
        <div className="hidden md:block w-px bg-sky-500/70 animate-pulse self-stretch my-2 shrink-0" />

        {/* Right Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>ตารางสอบ</span>
            </h2>

            <div className="flex items-center gap-3 self-start md:self-auto">
              {countdownText && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-950/40 border border-sky-800/50 text-sky-300 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>{countdownText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Segmented Control Switcher */}
          <div className="relative flex items-center rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900 p-1 w-full sm:w-[380px] h-11 mt-6">
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(33.3333%-3px)] bg-zinc-800 rounded-md shadow-sm transition-transform duration-300 ease-out border border-zinc-700/50"
              style={{
                transform: `translateX(${activeIndex * 100}%) translateX(${activeIndex * 1}px)`,
              }}
            />

            <button
              type="button"
              onClick={() => setCurrentTerm("all")}
              className={`relative z-10 flex-1 text-center text-xs md:text-sm font-semibold py-2 transition-colors duration-300 cursor-pointer ${
                activeIndex === 0 ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              ทุกเทอม
            </button>
            <button
              type="button"
              onClick={() => setCurrentTerm("midterm")}
              className={`relative z-10 flex-1 text-center text-xs md:text-sm font-semibold py-2 transition-colors duration-300 cursor-pointer ${
                activeIndex === 1 ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              กลางภาค
            </button>
            <button
              type="button"
              onClick={() => setCurrentTerm("finals")}
              className={`relative z-10 flex-1 text-center text-xs md:text-sm font-semibold py-2 transition-colors duration-300 cursor-pointer ${
                activeIndex === 2 ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              ปลายภาค
            </button>
          </div>

          {/* Exams Table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-sky-950/30 border-b border-sky-900/30">
                  <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-sky-400 w-2/5">
                    SUBJECT
                  </th>
                  {(currentTerm === "all" || currentTerm === "midterm") && (
                    <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-sky-400">
                      MIDTERM
                    </th>
                  )}
                  {(currentTerm === "all" || currentTerm === "finals") && (
                    <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-sky-400">
                      FINALS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredExams.map((exam) => (
                  <tr
                    key={exam.code}
                    className="hover:bg-zinc-900/40 transition-colors"
                  >
                    {/* Subject info */}
                    <td className="py-4 px-5 text-sm align-top">
                      <div className="font-mono font-bold text-white text-base">
                        {exam.code}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                        {exam.name}
                      </div>
                    </td>

                    {/* Midterm info */}
                    {(currentTerm === "all" || currentTerm === "midterm") && (
                      <td className="py-4 px-5 text-sm align-top">
                        {exam.midterm ? (
                          <div className="space-y-1">
                            <div className="text-white font-semibold flex items-center gap-1.5">
                              <i className="bi bi-calendar-event text-sky-400 text-xs" />
                              <span>{formatThaiDate(exam.midterm.date)}</span>
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-2">
                              <span>
                                <i className="bi bi-clock me-1 text-zinc-500" />
                                {exam.midterm.start} - {exam.midterm.end} น.
                              </span>
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                                {exam.midterm.room}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-600 font-medium">-</span>
                        )}
                      </td>
                    )}

                    {/* Final info */}
                    {(currentTerm === "all" || currentTerm === "finals") && (
                      <td className="py-4 px-5 text-sm align-top">
                        {exam.final ? (
                          <div className="space-y-1">
                            <div className="text-white font-semibold flex items-center gap-1.5">
                              <i className="bi bi-calendar-event text-sky-400 text-xs" />
                              <span>{formatThaiDate(exam.final.date)}</span>
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-2">
                              <span>
                                <i className="bi bi-clock me-1 text-zinc-500" />
                                {exam.final.start} - {exam.final.end} น.
                              </span>
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                                {exam.final.room}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-zinc-600 font-medium">-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
