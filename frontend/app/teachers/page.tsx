"use client";

import { useEffect, useState } from "react";
import TeachersGrid from "@/components/teachers/teachers-grid";
import { Teacher } from "@/lib/types";

const defaultAdviseYears: Record<string, string[]> = {
  athasart: ["1"],
  rattikorn: ["2"],
  pisakorn: ["3"],
  silar: ["4"],
  sakawkarn: ["1", "2"],
  jaturong: [],
};

const defaultPhotos: Record<string, string> = {
  athasart: "/image/professors/athasart.webp",
  rattikorn: "/image/professors/rattikorn.webp",
  pisakorn: "/image/professors/pisakorn.webp",
  silar: "/image/professors/silar.webp",
  sakawkarn: "/image/professors/sakawkarn.webp",
  jaturong: "/image/professors/jaturong.webp",
};

const defaultTeachers: Teacher[] = [
  {
    id: 1,
    name_th: "อาจารย์อรรถศาสตร์ นาคเทวัญ",
    name_en: "Athasart Narkthewan",
    photo: "/image/professors/athasart.webp",
    advise_years: ["1"],
    contact: "athasart.na@kmitl.ac.th",
  },
  {
    id: 2,
    name_th: "ดร.รัตติกร สมบัติแก้ว",
    name_en: "Rattikorn Sombutkaew",
    photo: "/image/professors/rattikorn.webp",
    advise_years: ["2"],
    contact: "rattikorn.so@kmitl.ac.th",
  },
  {
    id: 3,
    name_th: "อาจารย์นภัสรพี สิทธิวัจน์",
    name_en: "Pisakorn Sittiwatjana",
    photo: "/image/professors/pisakorn.webp",
    advise_years: ["3"],
    contact: "pisakorn.si@kmitl.ac.th",
  },
  {
    id: 4,
    name_th: "ว่าที่ร้อยตรี ศิลา ศิริมาสกุล",
    name_en: "Silar Sirimasakul",
    photo: "/image/professors/silar.webp",
    advise_years: ["4"],
    contact: "silar.si@kmitl.ac.th",
  },
  {
    id: 5,
    name_th: "อาจารย์สกาวกาญจน์ ปิยะวิทย์วนิช",
    name_en: "Sakawkarn Piyawitwanich",
    photo: "/image/professors/sakawkarn.webp",
    advise_years: ["1", "2"],
    contact: "sakawkarn.pi@kmitl.ac.th",
  },
  {
    id: 6,
    name_th: "นายจตุรงค์ เกตุนิมิต",
    name_en: "Jaturong Katenimit",
    photo: "/image/professors/jaturong.webp",
    advise_years: [],
    contact: "jaturong.k@ce.ac.th",
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);

  useEffect(() => {
    async function getTeachers() {
      try {
        const response = await fetch("http://localhost:8000/teachers");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: Teacher[] = data.map((t: any) => {
              const key = (t.teacher_name_en || "").toLowerCase();
              let adviseYears: string[] = defaultAdviseYears[key] || [];
              if (t.teacher_advise_year) {
                if (Array.isArray(t.teacher_advise_year)) {
                  adviseYears = t.teacher_advise_year;
                } else if (typeof t.teacher_advise_year === "string") {
                  try {
                    const parsed = JSON.parse(t.teacher_advise_year);
                    if (Array.isArray(parsed)) adviseYears = parsed;
                    else adviseYears = [t.teacher_advise_year];
                  } catch {
                    adviseYears = [t.teacher_advise_year];
                  }
                }
              }
              return {
                id: t.teacher_id,
                name_th: `${t.teacher_firstname} ${t.teacher_lastname}`.trim(),
                name_en: t.teacher_name_en || "",
                photo: t.teacher_image || defaultPhotos[key] || `/image/professors/${key}.webp`,
                advise_years: adviseYears,
                contact: t.teacher_contact || "",
              };
            });
            setTeachers(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    }

    getTeachers();
  }, []);

  return (
    <section className="w-full px-12 md:px-16 py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-0">
          วิศวกรรมคอมพิวเตอร์
          <br />
          <span className="text-[#4483cc]">
            <span className="relative inline-block">
              คณา
              <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-[#4483cc] rounded-full" />
            </span>
            จารย์
          </span>
        </h1>
      </div>

      {teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-black/50 border border-zinc-800 rounded-xl p-8 text-center mt-4">
          <p className="text-zinc-400 font-medium">
            ไม่พบข้อมูลคณาจารย์
          </p>
        </div>
      ) : (
        <TeachersGrid teachers={teachers} lang="th" />
      )}
    </section>
  );
}
