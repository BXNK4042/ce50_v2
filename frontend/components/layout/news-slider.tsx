"use client";

import { useState, useEffect } from "react";

export interface NewsItem {
  id?: number;
  news_id?: number;
  title?: string;
  news_title?: string;
  category?: string;
  news_category?: string;
  body?: string;
  news_description?: string;
  link?: string;
  image?: string;
  news_image?: string;
  published_at?: string;
  created_at?: string;
}

interface NewsSliderProps {
  title?: string;
}

export default function NewsSlider({
  title = "ข่าวสารภายนอก",
}: NewsSliderProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${backendUrl}/news`);
        if (res.ok) {
          const data: NewsItem[] = await res.json();
          const filtered = (data ?? []).filter((item) => {
            const cat = (item.news_category || item.category || "").toLowerCase();
            return cat === "other" || cat === "ข่าวประชาสัมพันธ์" || cat === "ข่าวทั่วไป";
          });
          setNews(filtered.length > 0 ? filtered : data);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch slider news:", err);
      }
    };

    fetchNews();
  }, []);

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

  const maxIndex = news.length;

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

  // Auto scroll every 10 seconds
  useEffect(() => {
    if (maxIndex <= visibleCount) return;
    const timer = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex, visibleCount, isTransitioning, news]);

  const getTranslateX = () => {
    if (visibleCount === 1) {
      return `translateX(calc(-${currentIndex} * (100% + 20px)))`;
    }
    if (visibleCount === 2) {
      return `translateX(calc(-${currentIndex} * (50% + 10px)))`;
    }
    return `translateX(calc(-${currentIndex} * (25% + 5px)))`;
  };

  const duplicatedNews =
    maxIndex > visibleCount
      ? [...news, ...news.slice(0, visibleCount)]
      : news;

  const getImageUrl = (img?: string) => {
    if (!img) return "/ce_logo.webp";
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) {
      return img;
    }
    return `http://localhost:8000/uploads/news/${img}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr.replace(" ", "T"));
      if (isNaN(d.getTime())) return dateStr;

      const day = d.getDate();
      const monthTh = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ];
      return `${day} ${monthTh[d.getMonth()]} ${d.getFullYear() + 543}`;
    } catch {
      return dateStr;
    }
  };

  const getCategoryDetails = (cat?: string) => {
    const c = (cat || "").toLowerCase();
    if (c === "competition" || c === "งานแข่งขัน") {
      return {
        label: "การแข่งขัน",
        classes:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      };
    }
    if (c === "scholarship" || c === "ทุนการศึกษา") {
      return {
        label: "ทุนการศึกษา",
        classes:
          "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      };
    }
    return {
      label: "ข่าวทั่วไป",
      classes: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    };
  };

  if (news.length === 0) {
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-3 select-none">
          <span className="inline-block w-2 h-6 bg-blue-600 rounded-full shrink-0" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>
        <div className="w-full flex items-center justify-center bg-black/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-zinc-400">
          ยังไม่มีข่าวสารในขณะนี้
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Slider Header */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-6 bg-blue-600 rounded-full shrink-0" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* Navigation Buttons */}
        {maxIndex > visibleCount && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center p-2"
              style={{ width: "38px", height: "38px" }}
              aria-label="Previous slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                style={{ width: "18px", height: "18px" }}
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
              style={{ width: "38px", height: "38px" }}
              aria-label="Next slide"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                style={{ width: "18px", height: "18px" }}
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
      </div>

      {/* Cards Viewport */}
      <div className="w-full overflow-hidden py-2 relative">
        <div
          className={`flex gap-4 ${
            transitionEnabled
              ? "transition-transform duration-500 ease-in-out"
              : "transition-none"
          }`}
          style={{ transform: getTranslateX() }}
          onTransitionEnd={handleTransitionEnd}
        >
          {duplicatedNews.map((item, idx) => {
            const catDetails = getCategoryDetails(
              item.news_category || item.category,
            );
            const itemTitle = item.news_title || item.title || "";
            const itemBody = item.news_description || item.body || "";
            const itemImg = getImageUrl(item.news_image || item.image);
            const itemDate = item.created_at || item.published_at;

            return (
              <div
                key={idx}
                className="shrink-0 flex flex-col justify-end relative h-[320px] overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300 hover:shadow-xl hover:border-zinc-600 cursor-pointer select-none group"
                style={{
                  width:
                    visibleCount === 1
                      ? "100%"
                      : visibleCount === 2
                        ? "calc(50% - 8px)"
                        : "calc(25% - 12px)",
                }}
                onClick={() => {
                  if (item.link) window.open(item.link, "_blank");
                }}
              >
                {/* Background image */}
                <img
                  src={itemImg}
                  alt={itemTitle}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                {/* Info Container */}
                <div className="p-4 flex flex-col gap-2 z-20 text-left w-full">
                  <div className="flex items-center justify-between text-[10px] text-white/80">
                    <span
                      className={`px-2.5 py-0.5 font-semibold rounded-full uppercase tracking-wider ${catDetails.classes}`}
                    >
                      {catDetails.label}
                    </span>
                    <span>{formatDate(itemDate)}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-0">
                    {itemTitle}
                  </h4>

                  {itemBody && (
                    <p className="text-white/70 text-[11px] line-clamp-2 leading-relaxed mb-0">
                      {itemBody}
                    </p>
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
