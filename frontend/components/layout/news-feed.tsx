"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

interface NewsFeedProps {
  archiveTitle?: string;
  excludeArchive?: boolean;
  onlyArchive?: boolean;
}

export default function NewsFeed({
  archiveTitle = "คลังข่าวสารย้อนหลัง",
  excludeArchive,
  onlyArchive,
}: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${backendUrl}/news`);
        if (res.ok) {
          const data: NewsItem[] = await res.json();
          // Filter to internal CE news (competition or scholarship or specific categories)
          const filtered = (data ?? []).filter((item) => {
            const cat = (item.news_category || item.category || "").toLowerCase();
            return (
              cat === "scholarship" ||
              cat === "competition" ||
              cat === "ทุนการศึกษา" ||
              cat === "งานแข่งขัน"
            );
          });
          setNews(filtered.length > 0 ? filtered : data);
          return;
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
  }, []);

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
          "bg-emerald-950 text-emerald-300 border border-emerald-800",
      };
    }
    if (c === "scholarship" || c === "ทุนการศึกษา") {
      return {
        label: "ทุนการศึกษา",
        classes:
          "bg-purple-950 text-purple-300 border border-purple-800",
      };
    }
    return {
      label: "ข่าวประชาสัมพันธ์",
      classes:
        "bg-blue-950 text-sky-300 border border-blue-800",
    };
  };

  const getSmallCategoryDetails = (cat?: string) => {
    const c = (cat || "").toLowerCase();
    if (c === "competition" || c === "งานแข่งขัน") {
      return {
        label: "การแข่งขัน",
        classes:
          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md",
      };
    }
    if (c === "scholarship" || c === "ทุนการศึกษา") {
      return {
        label: "ทุนการศึกษา",
        classes:
          "bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md",
      };
    }
    return {
      label: "ข่าวประชาสัมพันธ์",
      classes:
        "bg-sky-500/20 text-sky-300 border border-sky-500/30 backdrop-blur-md",
    };
  };

  if (news.length === 0) {
    if (onlyArchive) return null;
    return (
      <div className="w-full flex items-center justify-center bg-black/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-zinc-400">
        ยังไม่มีข่าวสารในขณะนี้
      </div>
    );
  }

  // Section 3: Only Archive
  if (onlyArchive) {
    const archiveItems = news.slice(5);
    if (archiveItems.length === 0) return null;
    return (
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-3 select-none">
          <span className="inline-block w-2 h-6 bg-blue-600 rounded-full shrink-0" />
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {archiveTitle}
          </h3>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
          {archiveItems.map((item, idx) => {
            const cat = getSmallCategoryDetails(
              item.news_category || item.category,
            );
            const title = item.news_title || item.title || "";
            const body = item.news_description || item.body || "";
            const img = getImageUrl(item.news_image || item.image);
            const date = item.created_at || item.published_at;

            return (
              <div className="col" key={item.news_id || item.id || idx}>
                <div
                  className="relative w-full h-[240px] overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 hover:shadow-lg hover:shadow-black/60 hover:border-zinc-600 cursor-pointer select-none group flex flex-col justify-end"
                  onClick={() => {
                    if (item.link) window.open(item.link, "_blank");
                  }}
                >
                  <img
                    src={img}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                  <div className="p-3.5 flex flex-col gap-2 z-20 text-left w-full">
                    <div className="flex items-center justify-between text-[10px] text-white/80">
                      <span
                        className={`px-2 py-0.5 font-semibold rounded-full uppercase tracking-wider ${cat.classes}`}
                      >
                        {cat.label}
                      </span>
                      <span>{formatDate(date)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-2">
                      {title}
                    </h4>
                    {body && (
                      <p className="text-white/70 text-[10px] line-clamp-2 leading-relaxed mb-0">
                        {body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Section 1: Featured Left + 2x2 Grid Right
  const featuredNews = news[0];
  const smallNewsItems = news.slice(1, 5);
  const featuredCat = getCategoryDetails(
    featuredNews.news_category || featuredNews.category,
  );
  const featuredTitle = featuredNews.news_title || featuredNews.title || "";
  const featuredBody = featuredNews.news_description || featuredNews.body || "";
  const featuredImg = getImageUrl(featuredNews.news_image || featuredNews.image);
  const featuredDate = featuredNews.created_at || featuredNews.published_at;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="row g-4 items-stretch">
        {/* 1. Left Column: Featured News (Large) */}
        <div className={smallNewsItems.length > 0 ? "col-12 col-lg-7" : "col-12 col-lg-8"}>
          <div className="card text-bg-dark h-100 border border-zinc-800 rounded-2xl overflow-hidden p-4 d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${featuredCat.classes}`}
              >
                {featuredCat.label}
              </span>
              <span className="text-xs text-zinc-400">
                {formatDate(featuredDate)}
              </span>
            </div>

            {featuredNews.link ? (
              <a
                href={featuredNews.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none group"
              >
                <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight group-hover:text-sky-300 transition-colors">
                  {featuredTitle}
                </h3>
              </a>
            ) : (
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-0">
                {featuredTitle}
              </h3>
            )}

            <div className="w-full aspect-[16/9] overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 relative group my-2">
              <img
                src={featuredImg}
                alt={featuredTitle}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300" />
            </div>

            {featuredBody && (
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-0">
                {featuredBody}
              </p>
            )}

            {featuredNews.link && (
              <div className="mt-auto pt-2">
                <a
                  href={featuredNews.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 text-decoration-none transition-colors"
                >
                  อ่านเพิ่มเติม <span>→</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 2. Right Column: 2x2 Grid of Small News Items */}
        {smallNewsItems.length > 0 && (
          <div className="col-12 col-lg-5">
            <div className="row row-cols-1 row-cols-sm-2 g-3 h-100">
              {smallNewsItems.map((item, idx) => {
                const cat = getSmallCategoryDetails(
                  item.news_category || item.category,
                );
                const title = item.news_title || item.title || "";
                const body = item.news_description || item.body || "";
                const img = getImageUrl(item.news_image || item.image);
                const date = item.created_at || item.published_at;

                return (
                  <div className="col" key={item.news_id || item.id || idx}>
                    <div
                      className="relative w-full h-[280px] overflow-hidden rounded-2xl border border-zinc-800 transition-all duration-300 hover:shadow-xl hover:border-zinc-600 cursor-pointer select-none group flex flex-col justify-end"
                      onClick={() => {
                        if (item.link) window.open(item.link, "_blank");
                      }}
                    >
                      <img
                        src={img}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                      <div className="p-3.5 flex flex-col gap-1.5 z-20 text-left w-full">
                        <div className="flex items-center justify-between text-[10px] text-white/80">
                          <span
                            className={`px-2 py-0.5 font-semibold rounded-full uppercase tracking-wider ${cat.classes}`}
                          >
                            {cat.label}
                          </span>
                          <span>{formatDate(date)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-0">
                          {title}
                        </h4>
                        {body && (
                          <p className="text-white/70 text-[10px] line-clamp-2 leading-relaxed mb-0">
                            {body}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Row: Archive (if not excluded) */}
      {!excludeArchive && news.length > 5 && (
        <div className="w-full flex flex-col gap-6 mt-8 pt-8 border-t border-zinc-800">
          <div className="flex items-center gap-3 select-none">
            <span className="inline-block w-2 h-6 bg-blue-600 rounded-full shrink-0" />
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {archiveTitle}
            </h3>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
            {news.slice(5).map((item, idx) => {
              const cat = getSmallCategoryDetails(
                item.news_category || item.category,
              );
              const title = item.news_title || item.title || "";
              const body = item.news_description || item.body || "";
              const img = getImageUrl(item.news_image || item.image);
              const date = item.created_at || item.published_at;

              return (
                <div className="col" key={item.news_id || item.id || idx}>
                  <div
                    className="relative w-full h-[220px] overflow-hidden rounded-xl border border-zinc-800 transition-all duration-300 hover:shadow-lg hover:border-zinc-600 cursor-pointer select-none group flex flex-col justify-end"
                    onClick={() => {
                      if (item.link) window.open(item.link, "_blank");
                    }}
                  >
                    <img
                      src={img}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
                    <div className="p-3 flex flex-col gap-1.5 z-20 text-left w-full">
                      <div className="flex items-center justify-between text-[10px] text-white/80">
                        <span
                          className={`px-2 py-0.5 font-semibold rounded-full uppercase tracking-wider ${cat.classes}`}
                        >
                          {cat.label}
                        </span>
                        <span>{formatDate(date)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-0">
                        {title}
                      </h4>
                      {body && (
                        <p className="text-white/70 text-[10px] line-clamp-2 leading-relaxed mb-0">
                          {body}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
