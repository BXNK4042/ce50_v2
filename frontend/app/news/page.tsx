"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news-item";
import Image from "next/image";
import TechNewsSection from "@/components/TechNewsSection";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          setNews(await response.json());
        }
      } catch (err) {
        console.error("Failed to load department news", err);
      }
    }

    getNews();
  }, []);

  return (
    <div className="template-container">
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ข่าวสาร</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>

      {news.length > 0 && (
        <div id="carouselExample" className="carousel slide mb-5">
          <div className="carousel-inner">
            {news.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={item.news_id}
              >
                <Image
                  src={
                    item.news_image
                      ? `/uploads/news/${item.news_image}`
                      : "/404.png"
                  }
                  alt={item.news_title}
                  width={2000}
                  height={2000}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.endsWith("/404.png")) {
                      target.src = "/404.png";
                    }
                  }}
                />
                <div className="carousel-caption d-none d-md-block text-black bg-white opacity-80">
                  <h3>{item.news_title}</h3>
                  <p>{item.news_description}</p>
                </div>
              </div>
            ))}
          </div>
          {news.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Main News Section */}
      <div className="main-news-section text-light mb-5">
        <TechNewsSection />
      </div>
    </div>
  );
}
