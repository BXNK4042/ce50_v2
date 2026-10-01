"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Teachers } from "@/types/teacher";

interface PeopleSliderProps {
  lang?: string;
  title?: string;
  teachers?: Teachers[];
  cohorts?: string[];
}

export default function PeopleSlider({
  lang = "th",
  title = "บุคลากร",
  teachers: initialTeachers,
  cohorts = [],
}: PeopleSliderProps) {
  const [teachers, setTeachers] = useState<Teachers[]>(initialTeachers ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialTeachers && initialTeachers.length > 0) return;
    async function fetchTeachers() {
      try {
        const res = await fetch("http://localhost:8000/teachers");
        if (res.ok) {
          const data = await res.json();
          setTeachers(data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch teachers for PeopleSlider:", err);
      }
    }
    fetchTeachers();
  }, [initialTeachers]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = teachers.length;

  const handleNext = () => {
    if (isTransitioning || maxIndex <= visibleCount) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning || maxIndex <= visibleCount) return;
    setIsTransitioning(true);
    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(maxIndex);
      setTimeout(() => {
        setTransitionEnabled(true);
        setCurrentIndex(maxIndex - 1);
      }, 30);
    } else {
      setTransitionEnabled(true);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex >= maxIndex) {
      setTransitionEnabled(false);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (maxIndex <= visibleCount || isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, visibleCount, isTransitioning, isPaused, maxIndex]);

  const getTranslateX = () => {
    if (visibleCount === 1) {
      return `translateX(calc(-${currentIndex} * (100% + 24px)))`;
    }
    if (visibleCount === 2) {
      return `translateX(calc(-${currentIndex} * (50% + 12px)))`;
    }
    return `translateX(calc(-${currentIndex} * (25% + 6px)))`;
  };

  const duplicatedTeachers =
    maxIndex > visibleCount
      ? [...teachers, ...teachers.slice(0, visibleCount)]
      : teachers;

  if (teachers.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6 min-h-0">
        <div className="flex items-center justify-between select-none">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
        </div>
        <div className="flex items-center justify-center bg-black/30 border border-dashed border-zinc-800 rounded-xl p-12 text-zinc-400">
          {lang === "th" ? "ไม่พบข้อมูลคณาจารย์" : "No faculty records found."}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 min-h-0 select-none">
      {/* Slider Header: Title + Navigation buttons */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-0">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {/* Arrow Navigation Controls */}
          {maxIndex > visibleCount && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 border border-white/20 hover:border-sky-400 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 border border-white/20 hover:border-sky-400 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards Viewport Wrapper */}
      <div
        className="w-full overflow-hidden py-2 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 ${
            transitionEnabled ? "transition-transform duration-500 ease-in-out" : "transition-none"
          }`}
          style={{ transform: getTranslateX() }}
          onTransitionEnd={handleTransitionEnd}
        >
          {duplicatedTeachers.map((teacher, idx) => {
            const photoUrl =
              (teacher as any).photo ||
              (teacher.teacher_name_en
                ? `/image/professors/${teacher.teacher_name_en.toLowerCase()}.webp`
                : teacher.teacher_image || null);
            const fullName = `${teacher.teacher_firstname} ${teacher.teacher_lastname}`;
            const contact = teacher.teacher_contact || (teacher as any).teacher_email || "";

            return (
              <Link
                key={idx}
                href="/teachers"
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 h-[420px] bg-gradient-to-b from-[#a7c7f2] to-[#2b5c9e] dark:from-[#ff7b30] dark:to-[#9c3100] border border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/40 cursor-pointer select-none flex flex-col justify-end relative group text-decoration-none"
              >
                {/* Full Background Portrait Image */}
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                  />
                )}
                {/* Premium Dark Gradient Overlay at the bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10" />

                {/* Profile Info - Floated at the bottom-left */}
                <div className="p-4 md:p-5 flex flex-col gap-2.5 z-20 text-left w-full">
                  <h3
                    className="font-bold text-white group-hover:text-sky-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)] mb-0 truncate"
                    style={{
                      fontSize: "clamp(0.875rem, 1.1vw, 1.05rem)",
                      lineHeight: "1.35",
                    }}
                  >
                    {fullName}
                  </h3>
                  {contact && (
                    <div className="text-xs text-white/70 mt-0.5 border-t border-white/10 pt-2.5 flex items-center justify-between gap-2 min-w-0">
                      <span className="truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-[11px] md:text-xs">
                        {contact}
                      </span>
                      <span className="w-7 h-7 rounded-full bg-white/15 group-hover:bg-sky-500 border border-white/20 group-hover:border-sky-400 flex items-center justify-center text-white transition-all duration-300 shadow-xs shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
