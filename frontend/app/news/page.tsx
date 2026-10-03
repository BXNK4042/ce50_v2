"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news-item";
import { GNewsArticle } from "@/types/gnews";
import Image from "next/image";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [latestTech, setLatestTech] = useState<GNewsArticle[]>([]);
  const [worldTech, setWorldTech] = useState<GNewsArticle[]>([]);

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

    async function getGNews() {
      try {
        const [latestRes, worldRes] = await Promise.all([
          fetch("/api/gnews?country=th&max=5"),
          fetch("/api/gnews?country=us&max=4"),
        ]);
        if (latestRes.ok) {
          const data = await latestRes.json();
          if (Array.isArray(data.articles)) setLatestTech(data.articles);
        }
        if (worldRes.ok) {
          const data = await worldRes.json();
          if (Array.isArray(data.articles)) setWorldTech(data.articles);
        }
      } catch (err) {
        console.error("Failed to load external news", err);
      }
    }

    getNews();
    getGNews();
  }, []);

  const featured = latestTech[0];
  const sideArticles = latestTech.slice(1, 5);

  return (
    <div className="template-container">
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ข่าวสาร</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>

      {news.length > 0 && (
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {news.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={item.news_id}
              >
                <Image
                  src={`/uploads/news/${item.news_image}`}
                  alt={item.news_title}
                  width={2000}
                  height={2000}
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

      {/* ข่าวสารล่าสุด: Template 1 ใหญ่ซ้าย + 4 เล็กขวา */}
      <div className="editors-news text-light">
        <div className="row">
          <div className="col-lg-3">
            <div className="position-relative float-left">
              <div className="mt-5 mb-5">
                <h1 className="text-primary">ข่าวสารล่าสุด</h1>
                <div className="bg-blue-500 w-100 h-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 mb-5 mb-sm-2">
            <div className="position-relative image-hover">
              <a
                href={featured?.url || "#"}
                target={featured?.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                <Image
                  src={featured?.image || "/404.png"}
                  className="img-fluid w-100"
                  style={{ width: "100%", height: "440px", objectFit: "cover" }}
                  alt={featured?.title || "ce50-news"}
                  width={1200}
                  height={800}
                  unoptimized
                />
                <h1 className="font-weight-600 mt-3">
                  {featured?.title ||
                    "Melania Trump speaks about courage at State Department"}
                </h1>
                {featured?.description && (
                  <p className="fs-15 font-weight-normal text-secondary mt-2">
                    {featured.description}
                  </p>
                )}
              </a>
            </div>
          </div>
          <div className="col-lg-6 mb-5 mb-sm-2">
            <div className="row">
              {[0, 1].map((idx) => {
                const art = sideArticles[idx];
                return (
                  <div className="col-sm-6 mb-5 mb-sm-2" key={idx}>
                    <div className="position-relative image-hover">
                      <a
                        href={art?.url || "#"}
                        target={art?.url ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-white text-decoration-none"
                      >
                        <Image
                          src={art?.image || "/404.png"}
                          className="img-fluid w-100"
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          alt={art?.title || "ce50-news"}
                          width={700}
                          height={500}
                          unoptimized
                        />
                        <h5 className="font-weight-600 mt-3">
                          {art?.title ||
                            (idx === 0
                              ? "A look at California's eerie plane graveyards"
                              : "The world's most beautiful racecourses")}
                        </h5>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="row mt-3">
              {[2, 3].map((idx) => {
                const art = sideArticles[idx];
                return (
                  <div
                    className={
                      idx === 2 ? "col-sm-6 mb-5 mb-sm-2" : "col-sm-6"
                    }
                    key={idx}
                  >
                    <div className="position-relative image-hover">
                      <a
                        href={art?.url || "#"}
                        target={art?.url ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-white text-decoration-none"
                      >
                        <Image
                          src={art?.image || "/404.png"}
                          className="img-fluid w-100"
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          alt={art?.title || "ce50-news"}
                          width={700}
                          height={500}
                          unoptimized
                        />
                        <h5 className="font-weight-600 mt-3">
                          {art?.title ||
                            (idx === 2
                              ? "Japan cancels cherry blossom festivals over virus fears"
                              : "Classic cars reborn as electric vehicles")}
                        </h5>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ข่าวสารต่างประเทศ: Template 4 คอลัมน์ด้านล่าง */}
      <div className="world-news text-light">
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex position-relative float-left">
              <div className="mt-5 mb-5">
                <h1 className="text-primary">ข่าวสารต่างประเทศ</h1>
                <div className="bg-blue-500 w-100 h-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {[0, 1, 2, 3].map((idx) => {
            const art = worldTech[idx];
            const defaultTitles = [
              "Refugees flood Turkey's border with Greece",
              "South Korea’s Moon Jae-in sworn in vowing address",
              "These puppies are training to assist in avalanche rescue",
              "'Love Is Blind' couple opens up about their first year",
            ];
            return (
              <div
                className="col-lg-3 col-sm-6 grid-margin mb-5 mb-sm-2"
                key={idx}
              >
                <div className="position-relative image-hover">
                  <a
                    href={art?.url || "#"}
                    target={art?.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-white text-decoration-none"
                  >
                    <Image
                      src={art?.image || "/404.png"}
                      className="img-fluid w-100"
                      style={{ width: "100%", height: "240px", objectFit: "cover" }}
                      alt={art?.title || "ce50-news"}
                      width={700}
                      height={500}
                      unoptimized
                    />
                    <h5 className="font-weight-bold mt-3">
                      {art?.title || defaultTitles[idx]}
                    </h5>
                    <p className="fs-15 font-weight-normal text-secondary">
                      {art?.description ||
                        "Lorem Ipsum has been the industry's standard dummy text"}
                    </p>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
