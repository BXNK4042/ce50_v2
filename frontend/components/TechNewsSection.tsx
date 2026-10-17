"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Globe, ExternalLink } from "lucide-react";
import { GNewsArticle } from "@/types/gnews";
import { safeExternalUrl } from "@/utils/security";

interface TechNewsSectionProps {
  className?: string;
}

export default function TechNewsSection({ className = "" }: TechNewsSectionProps) {
  const [headlinesTech, setHeadlinesTech] = useState<GNewsArticle[]>([]);
  const [usTech, setUsTech] = useState<GNewsArticle[]>([]);
  const [thTech, setThTech] = useState<GNewsArticle[]>([]);
  const [loadingGNews, setLoadingGNews] = useState(true);

  useEffect(() => {
    async function getGNews() {
      try {
        setLoadingGNews(true);
        const [headlinesRes, usRes, thRes] = await Promise.all([
          fetch("/api/gnews?category=technology&max=2"),
          fetch("/api/gnews?country=us&max=2"),
          fetch("/api/gnews?country=th&max=2"),
        ]);
        if (headlinesRes.ok) {
          const data = await headlinesRes.json();
          if (Array.isArray(data.articles)) setHeadlinesTech(data.articles);
        }
        if (usRes.ok) {
          const data = await usRes.json();
          if (Array.isArray(data.articles)) setUsTech(data.articles);
        }
        if (thRes.ok) {
          const data = await thRes.json();
          if (Array.isArray(data.articles)) setThTech(data.articles);
        }
      } catch (err) {
        console.error("Failed to load external news", err);
      } finally {
        setLoadingGNews(false);
      }
    }

    getGNews();
  }, []);

  const spotlight = headlinesTech[0];
  const internationalArticles = usTech.slice(0, 2);
  const thaiArticles = thTech.slice(0, 2);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.src.endsWith("/404.png")) {
      target.src = "/404.png";
    }
  };

  if (loadingGNews) {
    return (
      <div className={`row placeholder-glow my-5 py-3 ${className}`.trim()}>
        {/* Left Column Skeleton */}
        <div className="col-lg-6 mb-5">
          <div className="mb-4">
            <span className="placeholder col-6 bg-primary d-block py-2 mb-2"></span>
            <div className="bg-blue-500 w-20 h-1"></div>
          </div>
          <span
            className="placeholder col-12 bg-secondary bg-opacity-25 d-block rounded-2"
            style={{ height: "400px" }}
          ></span>
          <span className="placeholder col-9 bg-secondary bg-opacity-50 mt-3 d-block py-2"></span>
          <span className="placeholder col-12 bg-secondary bg-opacity-25 mt-2 d-block py-1"></span>
          <span className="placeholder col-10 bg-secondary bg-opacity-25 mt-1 d-block py-1"></span>
        </div>

        {/* Right Column Skeleton */}
        <div className="col-lg-6 mb-5">
          {/* International Skeleton */}
          <div className="mb-4">
            <div className="mb-3">
              <span className="placeholder col-4 bg-primary d-block py-2 mb-2"></span>
              <div className="bg-blue-500 w-20 h-1"></div>
            </div>
            <div className="row">
              {[0, 1].map((idx) => (
                <div className="col-6" key={idx}>
                  <span
                    className="placeholder col-12 bg-secondary bg-opacity-25 d-block rounded-2"
                    style={{ height: "220px" }}
                  ></span>
                  <span className="placeholder col-11 bg-secondary bg-opacity-50 mt-2 d-block py-1"></span>
                  <span className="placeholder col-8 bg-secondary bg-opacity-25 mt-1 d-block py-1"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Thai Skeleton */}
          <div className="mt-4">
            <div className="mb-3">
              <span className="placeholder col-3 bg-primary d-block py-2 mb-2"></span>
              <div className="bg-blue-500 w-20 h-1"></div>
            </div>
            <div className="row">
              {[0, 1].map((idx) => (
                <div className="col-6" key={idx}>
                  <span
                    className="placeholder col-12 bg-secondary bg-opacity-25 d-block rounded-2"
                    style={{ height: "220px" }}
                  ></span>
                  <span className="placeholder col-11 bg-secondary bg-opacity-50 mt-2 d-block py-1"></span>
                  <span className="placeholder col-8 bg-secondary bg-opacity-25 mt-1 d-block py-1"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-5 my-5 py-3 ${className}`.trim()}>
      {/* Full-width Featured Spotlight Hero Card */}
      {spotlight && (
        <div className="card shadow-lg border-0 overflow-hidden rounded-3 mb-5 bg-dark text-white position-relative">
          <div className="position-relative w-100" style={{ height: "460px" }}>
            <Image
              src={spotlight.image || "/404.png"}
              alt={spotlight.title || "Featured Tech Spotlight"}
              fill
              sizes="100vw"
              className="object-cover"
              onError={handleImageError}
              priority
            />
            {/* Gradient Overlay */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10,15,30,0.6) 40%, rgba(5,10,20,0.95) 100%)",
              }}
            />
            {/* Content Overlay */}
            <div className="position-absolute bottom-0 start-0 p-4 p-md-5 w-100 z-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-primary text-white text-uppercase px-3 py-2 fw-semibold">
                  Featured Spotlight
                </span>
                {spotlight.source?.name && (
                  <span className="badge bg-secondary bg-opacity-75 text-white">
                    {spotlight.source.name}
                  </span>
                )}
                {spotlight.publishedAt && (
                  <span className="text-secondary small d-inline-flex align-items-center gap-1 ms-1">
                    <Calendar size={13} />
                    {formatTimestamp(spotlight.publishedAt)}
                  </span>
                )}
              </div>
              <h1 className="h2 fw-bold text-white mb-3 text-break">
                <a
                  href={safeExternalUrl(spotlight.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none hover:text-primary transition"
                >
                  {spotlight.title}
                </a>
              </h1>
              {spotlight.description && (
                <p className="text-light text-opacity-75 fs-6 line-clamp-2 max-w-3xl mb-3">
                  {spotlight.description}
                </p>
              )}
              <a
                href={safeExternalUrl(spotlight.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
              >
                <span>อ่านรายละเอียด</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid for International and Thai Tech News */}
      <div className="row g-4">
        {/* International Grid */}
        <div className="col-lg-6">
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Globe size={20} className="text-primary" />
              <h3 className="h4 text-primary font-weight-bold mb-0">ข่าวเทคโนโลยีต่างประเทศ</h3>
            </div>
            <div className="bg-blue-500 w-20 h-1"></div>
          </div>
          <div className="row g-3">
            {internationalArticles.map((art, idx) => (
              <div className="col-12 col-md-6" key={idx}>
                <div className="card h-100 shadow-sm border border-secondary border-opacity-25 bg-dark text-white rounded-3 overflow-hidden d-flex flex-column">
                  <div className="position-relative w-100" style={{ height: "180px" }}>
                    <Image
                      src={art?.image || "/404.png"}
                      alt={art?.title || "International News"}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                        <span className="badge bg-secondary bg-opacity-50 text-white small">
                          {art?.source?.name || "Global"}
                        </span>
                        {art?.publishedAt && (
                          <span className="text-secondary small">
                            {formatTimestamp(art.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h6 className="fw-semibold text-white lh-base line-clamp-2 mb-2">
                        {art?.title || `ข่าวเทคโนโลยีต่างประเทศ ${idx + 1}`}
                      </h6>
                      {art?.description && (
                        <p className="text-secondary small line-clamp-2 mb-0">
                          {art.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 text-end">
                      <a
                        href={safeExternalUrl(art?.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                      >
                        <span>อ่านข่าว</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thai Tech News Grid */}
        <div className="col-lg-6">
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Globe size={20} className="text-primary" />
              <h3 className="h4 text-primary font-weight-bold mb-0">ข่าวเทคโนโลยีไทย</h3>
            </div>
            <div className="bg-blue-500 w-20 h-1"></div>
          </div>
          <div className="row g-3">
            {thaiArticles.map((art, idx) => (
              <div className="col-12 col-md-6" key={idx}>
                <div className="card h-100 shadow-sm border border-secondary border-opacity-25 bg-dark text-white rounded-3 overflow-hidden d-flex flex-column">
                  <div className="position-relative w-100" style={{ height: "180px" }}>
                    <Image
                      src={art?.image || "/404.png"}
                      alt={art?.title || "Thai News"}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                        <span className="badge bg-secondary bg-opacity-50 text-white small">
                          {art?.source?.name || "Thailand"}
                        </span>
                        {art?.publishedAt && (
                          <span className="text-secondary small">
                            {formatTimestamp(art.publishedAt)}
                          </span>
                        )}
                      </div>
                      <h6 className="fw-semibold text-white lh-base line-clamp-2 mb-2">
                        {art?.title || `ข่าวเทคโนโลยีไทย ${idx + 1}`}
                      </h6>
                      {art?.description && (
                        <p className="text-secondary small line-clamp-2 mb-0">
                          {art.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-2 border-top border-secondary border-opacity-25 text-end">
                      <a
                        href={safeExternalUrl(art?.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                      >
                        <span>อ่านข่าว</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
