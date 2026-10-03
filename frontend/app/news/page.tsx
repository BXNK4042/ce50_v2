"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news-item";
import { GNewsArticle } from "@/types/gnews";
import Image from "next/image";

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [thaiTechArticles, setThaiTechArticles] = useState<GNewsArticle[]>([]);
  const [worldTechArticles, setWorldTechArticles] = useState<GNewsArticle[]>([]);
  const [stockTechArticles, setStockTechArticles] = useState<GNewsArticle[]>([]);
  const [isLoadingTech, setIsLoadingTech] = useState<boolean>(true);

  // Fetch departmental news from local database
  useEffect(() => {
    async function getNews() {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        }
      } catch (error) {
        console.error("Failed to fetch department news:", error);
      }
    }

    getNews();
  }, []);

  // Fetch Thai Tech news (2), World Tech news (7), and Tech Stock news (4) with 50-min auto-polling
  useEffect(() => {
    async function getTechNews() {
      try {
        const [thaiRes, worldRes, stockRes] = await Promise.all([
          fetch("/api/gnews?country=th&max=2"),
          fetch("/api/gnews?max=7"),
          fetch("/api/gnews?q=tech%20stocks&max=4"),
        ]);

        if (thaiRes.ok) {
          const thaiData = await thaiRes.json();
          if (thaiData && Array.isArray(thaiData.articles)) {
            setThaiTechArticles(thaiData.articles);
          }
        }

        if (worldRes.ok) {
          const worldData = await worldRes.json();
          if (worldData && Array.isArray(worldData.articles)) {
            setWorldTechArticles(worldData.articles);
          }
        }

        if (stockRes.ok) {
          const stockData = await stockRes.json();
          if (stockData && Array.isArray(stockData.articles)) {
            setStockTechArticles(stockData.articles);
          }
        }
      } catch (error) {
        console.error("Failed to fetch GNews tech articles:", error);
      } finally {
        setIsLoadingTech(false);
      }
    }

    getTechNews();

    // Auto-poll every 50 minutes (3,000,000 ms) to conserve daily API quota
    const interval = setInterval(getTechNews, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const FALLBACK_TECH_IMAGE =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60";

  // Helper for article image fallback
  const getArticleImage = (image?: string) => {
    if (image && (image.startsWith("http://") || image.startsWith("https://"))) {
      return image;
    }
    return FALLBACK_TECH_IMAGE;
  };

  // Section 2 layout: 1 large left, 2 top-right (world), 2 bottom-right (thai)
  const featuredArticle =
    worldTechArticles.length > 0 ? worldTechArticles[0] : null;
  const topRightArticles = worldTechArticles.slice(1, 3);
  const bottomRightThaiArticles = thaiTechArticles.slice(0, 2);

  // Section 3 layout: 4 world news articles in a 4-column row
  const worldNewsSectionArticles = worldTechArticles.slice(3, 7);

  return (
    <div className="template-container">
      {/* Page Header */}
      <div className="mt-5 mb-4">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ข่าวสารและบทความเทคโนโลยี</h1>
        <div className="bg-blue-500 w-24 h-1 mt-2"></div>
      </div>

      {/* Section 1: Department News Carousel */}
      {news.length > 0 ? (
        <div
          id="carouselExample"
          className="carousel slide shadow-lg rounded overflow-hidden"
        >
          <div className="carousel-inner">
            {news.map((item, index) => (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={item.news_id}
              >
                <div
                  className="position-relative w-100"
                  style={{ height: "460px" }}
                >
                  <Image
                    src={`/uploads/news/${item.news_image}`}
                    alt={item.news_title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_TECH_IMAGE;
                    }}
                  />
                </div>
                <div className="carousel-caption d-none d-md-block text-black bg-white bg-opacity-90 rounded p-3 mb-4 mx-auto max-w-2xl shadow">
                  <span className="badge bg-primary mb-2">
                    {item.news_category}
                  </span>
                  <h3 className="fw-bold">{item.news_title}</h3>
                  <p className="mb-0 text-muted">{item.news_description}</p>
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
      ) : null}

      {/* Section 2: ข่าวสารล่าสุด */}
      <div className="editors-news text-light mt-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="text-primary fw-bold mb-1">
                  ข่าวสารล่าสุด (Latest Tech News)
                </h2>
                <div className="bg-blue-500 w-24 h-1"></div>
              </div>
              <span className="text-secondary small">
                อัปเดตอัตโนมัติทุก 50 นาที (Auto-polling)
              </span>
            </div>
          </div>
        </div>

        {isLoadingTech ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">กำลังโหลดข่าวสาร...</span>
            </div>
            <p className="text-muted mt-2">
              กำลังดึงข้อมูลข่าวสารเทคโนโลยีล่าสุด...
            </p>
          </div>
        ) : (
          <div className="row">
            {/* Left Column: 1 Large Featured Article */}
            {featuredArticle && (
              <div className="col-lg-6 mb-4">
                <div className="card bg-dark text-white h-100 border-secondary overflow-hidden shadow-sm">
                  <div
                    className="position-relative w-100"
                    style={{ height: "340px" }}
                  >
                    <Image
                      src={getArticleImage(featuredArticle.image)}
                      className="card-img-top object-cover"
                      alt={featuredArticle.title}
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          FALLBACK_TECH_IMAGE;
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between p-4">
                    <div>
                      <div className="d-flex justify-content-between text-muted small mb-2">
                        <span className="badge bg-secondary">
                          {featuredArticle.source?.name || "Global Tech"}
                        </span>
                        <span>
                          {new Date(
                            featuredArticle.publishedAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="card-title fw-bold text-light">
                        <a
                          href={featuredArticle.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-decoration-none hover:text-primary transition"
                        >
                          {featuredArticle.title}
                        </a>
                      </h4>
                      <p className="card-text text-secondary mt-2 line-clamp-3">
                        {featuredArticle.description}
                      </p>
                    </div>
                    <div className="mt-4">
                      <a
                        href={featuredArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        อ่านข่าวฉบับเต็ม{" "}
                        <i className="bi bi-box-arrow-up-right ms-1"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: 4 Articles (2 Top Global, 2 Bottom Thai) */}
            <div className="col-lg-6">
              <div className="row g-3">
                {/* 2 Top Right Articles (Global Tech) */}
                {topRightArticles.map((article, idx) => (
                  <div className="col-sm-6 mb-3" key={`world-${idx}`}>
                    <div className="card bg-dark text-white h-100 border-secondary overflow-hidden shadow-sm">
                      <div
                        className="position-relative w-100"
                        style={{ height: "155px" }}
                      >
                        <Image
                          src={getArticleImage(article.image)}
                          className="card-img-top object-cover"
                          alt={article.title}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              FALLBACK_TECH_IMAGE;
                          }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                          <span className="badge bg-secondary mb-1 small">
                            {article.source?.name || "Tech"}
                          </span>
                          <h6 className="card-title fw-bold line-clamp-2 mt-1">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-decoration-none hover:text-primary"
                            >
                              {article.title}
                            </a>
                          </h6>
                        </div>
                        <div className="mt-2 text-end">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary small text-decoration-none"
                          >
                            อ่านต่อ &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 2 Bottom Right Articles (Thai Tech News) */}
                {bottomRightThaiArticles.map((article, idx) => (
                  <div className="col-sm-6 mb-3" key={`thai-${idx}`}>
                    <div className="card bg-dark text-white h-100 border-primary border-opacity-50 overflow-hidden shadow-sm">
                      <div
                        className="position-relative w-100"
                        style={{ height: "155px" }}
                      >
                        <Image
                          src={getArticleImage(article.image)}
                          className="card-img-top object-cover"
                          alt={article.title}
                          fill
                          unoptimized
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              FALLBACK_TECH_IMAGE;
                          }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between p-3">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="badge bg-primary small">
                              ข่าวไทย
                            </span>
                            <span
                              className="text-muted small text-truncate"
                              style={{ maxWidth: "90px" }}
                            >
                              {article.source?.name || "Thai Tech"}
                            </span>
                          </div>
                          <h6 className="card-title fw-bold line-clamp-2 mt-1">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-decoration-none hover:text-primary"
                            >
                              {article.title}
                            </a>
                          </h6>
                        </div>
                        <div className="mt-2 text-end">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary small text-decoration-none"
                          >
                            อ่านต่อ &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: ข่าวสารต่างประเทศและนวัตกรรม (4 World Tech Articles) */}
      <div className="world-news text-light mt-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="text-primary fw-bold mb-1">
                  ข่าวสารไอทีและนวัตกรรมระดับโลก (Global Tech)
                </h2>
                <div className="bg-blue-500 w-24 h-1"></div>
              </div>
              <span className="text-secondary small">
                แหล่งข้อมูล: GNews International Feeds
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {worldNewsSectionArticles.map((article, idx) => (
            <div className="col-lg-3 col-sm-6 mb-4" key={idx}>
              <div className="card bg-dark text-white h-100 border-secondary overflow-hidden shadow-sm">
                <div
                  className="position-relative w-100"
                  style={{ height: "180px" }}
                >
                  <Image
                    src={getArticleImage(article.image)}
                    className="card-img-top object-cover"
                    alt={article.title}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_TECH_IMAGE;
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between p-3">
                  <div>
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span
                        className="small text-truncate"
                        style={{ maxWidth: "120px" }}
                      >
                        {article.source?.name || "Global"}
                      </span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h6 className="card-title fw-bold line-clamp-2 mt-1">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-decoration-none hover:text-primary"
                      >
                        {article.title}
                      </a>
                    </h6>
                    <p className="card-text text-secondary small line-clamp-2 mt-1">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm w-100"
                    >
                      เปิดอ่านข่าว
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: ตลาดหุ้นและเศรษฐกิจเทคโนโลยี (4 Tech Stock Articles) */}
      <div className="stock-news text-light mt-5 mb-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="text-primary fw-bold mb-1">
                  ตลาดหุ้นและเศรษฐกิจเทคโนโลยี (Tech Stocks & Market Insights)
                </h2>
                <div className="bg-blue-500 w-24 h-1"></div>
              </div>
              <span className="badge bg-success px-3 py-2 small">
                Nasdaq & Tech Market Feeds
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {stockTechArticles.map((article, idx) => (
            <div className="col-lg-3 col-sm-6 mb-4" key={idx}>
              <div className="card bg-dark text-white h-100 border-success border-opacity-50 overflow-hidden shadow-sm">
                <div
                  className="position-relative w-100"
                  style={{ height: "180px" }}
                >
                  <Image
                    src={getArticleImage(article.image)}
                    className="card-img-top object-cover"
                    alt={article.title}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_TECH_IMAGE;
                    }}
                  />
                </div>
                <div className="card-body d-flex flex-column justify-content-between p-3">
                  <div>
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span className="badge bg-success small">
                        {article.source?.name || "Market"}
                      </span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h6 className="card-title fw-bold line-clamp-2 mt-1">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-decoration-none hover:text-primary"
                      >
                        {article.title}
                      </a>
                    </h6>
                    <p className="card-text text-secondary small line-clamp-2 mt-1">
                      {article.description}
                    </p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm w-100"
                    >
                      อ่านข่าวหุ้นเทค
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
