"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Teachers } from "@/types/teacher";

interface PeopleSliderProps {
  title?: string;
  teachers?: Teachers[];
}

export default function PeopleSlider({
  title = "บุคลากร",
  teachers: initialTeachers,
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
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Header: Title + Controls + Links */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <span className="inline-block w-1.5 h-7 bg-blue-600 dark:bg-sky-500 rounded-full shrink-0" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-0">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {maxIndex > visibleCount && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: "36px", height: "36px" }}
                aria-label="Previous faculty"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: "36px", height: "36px" }}
                aria-label="Next faculty"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          )}

          <Link
            href="/teachers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors text-decoration-none"
          >
            ดูอาจารย์ทั้งหมด <span>→</span>
          </Link>
        </div>
      </div>

      {/* Cards Viewport */}
      <div
        className="w-full overflow-hidden py-2 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex gap-6 ${
            transitionEnabled
              ? "transition-transform duration-500 ease-in-out"
              : "transition-none"
          }`}
          style={{ transform: getTranslateX() }}
          onTransitionEnd={handleTransitionEnd}
        >
          {duplicatedTeachers.map((teacher, idx) => {
            const photoUrl = `http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}_bg.webp`;
            const fullName = `${teacher.teacher_firstname} ${teacher.teacher_lastname}`;

            return (
              <div
                key={idx}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 h-[400px] md:h-[420px] bg-gradient-to-b from-[#1a2d48] to-[#0d1624] border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-zinc-600 cursor-pointer select-none flex flex-col justify-end relative group"
              >
                {/* Full Background Portrait Image */}
                <img
                  src={photoUrl}
                  alt={fullName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />

                {/* Dark Gradient Overlay at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                {/* Profile Info - Floated at the bottom */}
                <div className="p-5 md:p-6 flex flex-col gap-2 z-20 text-left w-full">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-0">
                    {fullName}
                  </h3>

                  {teacher.teacher_contact && (
                    <div className="text-xs text-white/80 mt-1 border-t border-white/10 pt-2.5 flex items-center justify-between">
                      <span className="truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {teacher.teacher_contact}
                      </span>
                      <span className="text-sky-400 group-hover:translate-x-1 transition-transform font-bold">
                        →
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
