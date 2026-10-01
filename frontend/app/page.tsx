"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/types/news-item";
import PeopleSlider from "@/components/layout/people-slider";

const getCategoryDetails = (cat?: string) => {
  const c = (cat || "").toLowerCase();
  if (c === "competition" || c === "งานแข่งขัน" || c === "การแข่งขัน") {
    return {
      label: "การแข่งขัน",
      badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    };
  }
  if (c === "scholarship" || c === "ทุนการศึกษา") {
    return {
      label: "ทุนการศึกษา",
      badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    };
  }
  return {
    label: "ข่าวประชาสัมพันธ์",
    badge: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  };
};

const getImageUrl = (img?: string) => {
  if (!img) return "/ce_logo.webp";
  if (
    img.startsWith("http://") ||
    img.startsWith("https://") ||
    img.startsWith("/")
  ) {
    return img;
  }
  return `http://localhost:8000/uploads/news/${img}`;
};

function formatDate(raw?: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw.replace(" ", "T"));
    if (isNaN(d.getTime())) return raw;
    const months = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  } catch {
    return raw;
  }
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch("http://localhost:8000/news");
        if (response.ok) {
          const data = await response.json();
          setNews(data ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch home news:", err);
      }
    }

    getNews();
  }, []);

  // จำกัดบล็อกข่าวไม่เกิน 5 ข่าว
  const displayNews = news.slice(0, 5);
  const maxIndex = displayNews.length;

  const handleNext = () => {
    if (isTransitioning || maxIndex <= 1) return;
    setIsTransitioning(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioning || maxIndex <= 1) return;
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

  // เลื่อนอัตโนมัติจากขวาไปซ้ายเรื่อยๆ ทุก 4 วินาที (หยุดเมื่อนำเมาส์ไปชี้)
  useEffect(() => {
    if (maxIndex <= 1 || isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning, isPaused, maxIndex]);

  // ซ้ำชุดข่าวเพื่อให้เลื่อนวนลูปได้อย่างต่อเนื่อง
  const duplicatedNews =
    maxIndex > 1 ? [...displayNews, ...displayNews] : displayNews;

  const getTranslateX = () => {
    return `translateX(calc(-${currentIndex} * (min(85vw, 500px) + 24px)))`;
  };

  return (
    <div className="w-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-60px)] overflow-hidden bg-black select-none">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="pointer-events-none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.5,
            zIndex: 0,
          }}
          muted
          autoPlay
          loop
          playsInline
        >
          <source src="/ce_hero_footage_zoomed.mp4" type="video/mp4" />
        </video>

        {/* Relative container for the logo and overlay text */}
        <div
          className="relative z-10 flex items-center justify-center transition-transform duration-300 hover:scale-105 group"
          style={{ width: "min(450px, 85vw)", height: "min(450px, 85vw)" }}
        >
          <Image
            src="/ce_logo.webp"
            alt="CE Logo"
            width={450}
            height={450}
            className="w-full h-full object-contain"
            priority
            draggable={false}
          />
          {/* Overlaid Title */}
          <h1
            className="absolute inset-0 flex items-center justify-center text-white whitespace-nowrap pointer-events-none"
            style={{
              fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)",
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "-0.025em",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
              margin: 0,
              padding: 0,
              lineHeight: 1,
            }}
          >
            WE ARE CE
          </h1>
        </div>
      </section>

      {/* News Section (ขนาดการ์ดกว้าง 500px สวยงาม พร้อมระบบเลื่อนอัตโนมัติขวาไปซ้ายเรื่อยๆ) */}
      <section className="relative w-full bg-[#0a192f] py-10 px-6 sm:px-10 md:px-16 flex flex-col gap-8 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 select-none">
            <span className="inline-block w-1.5 h-7 bg-blue-600 dark:bg-sky-500 rounded-full shrink-0" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-0">
              ข่าวสาร
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {maxIndex > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 border border-white/20 hover:border-sky-400 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
                  aria-label="Previous slide"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
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
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 border border-white/20 hover:border-sky-400 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm cursor-pointer"
                  aria-label="Next slide"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
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
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors text-decoration-none"
            >
              ดูข่าวสารทั้งหมด <span>→</span>
            </Link>
          </div>
        </div>

        {/* News Slider / Cards Container */}
        {displayNews.length === 0 ? (
          <div className="flex items-center justify-center bg-black/30 border border-dashed border-zinc-800 rounded-2xl p-12 text-zinc-400">
            ยังไม่มีข่าวสารในขณะนี้
          </div>
        ) : (
          <div
            className="w-full overflow-hidden py-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-6 ${
                transitionEnabled
                  ? "transition-transform duration-700 ease-in-out"
                  : "transition-none"
              }`}
              style={{ transform: getTranslateX() }}
              onTransitionEnd={handleTransitionEnd}
            >
              {duplicatedNews.map((item, idx) => {
                const catDetails = getCategoryDetails(item.news_category);
                const title = item.news_title || "";
                const body = item.news_description || "";
                const img = getImageUrl(item.news_image);
                const date = item.created_at;

                return (
                  <Link
                    key={idx}
                    href="/news"
                    className="shrink-0 bg-black/70 backdrop-blur-md border border-zinc-800 p-5 md:p-6 rounded-2xl shadow-xl shadow-black/50 hover:shadow-2xl hover:border-zinc-500 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between items-start text-left gap-4 cursor-pointer select-none group text-decoration-none"
                    style={{
                      width: "min(85vw, 500px)",
                      minHeight: "410px",
                    }}
                  >
                    <div className="w-full flex flex-col gap-3.5">
                      <div className="w-full flex items-center justify-between">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${catDetails.badge}`}
                        >
                          {catDetails.label}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {formatDate(date)}
                        </span>
                      </div>

                      {item.news_image && (
                        <div className="w-full h-[220px] overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800/80 relative">
                          <img
                            src={img}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-0">
                        {title}
                      </h3>

                      {body && (
                        <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed mb-0">
                          {body}
                        </p>
                      )}
                    </div>

                    <div className="w-full flex items-center justify-between text-xs text-zinc-400 mt-2 border-t border-zinc-800/80 pt-3">
                      <span>อ่านรายละเอียด</span>
                      <span className="text-sky-400 group-hover:translate-x-1 transition-transform font-semibold">
                        อ่านต่อ →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Section 3: People Section (สไตล์ ce50) */}
      <section className="relative w-full bg-black px-6 sm:px-10 md:px-16 py-12 md:py-16 flex flex-col gap-6 border-t border-zinc-800/80">
        <PeopleSlider title="บุคลากร" />
      </section>
    </div>
  );
}
