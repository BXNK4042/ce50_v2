"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GNewsArticle } from "@/types/gnews";
import { safeExternalUrl } from "@/utils/security";

export default function TechNewsSection() {
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

  if (loadingGNews) {
    return (
      <div className="row placeholder-glow">
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
    <div className="row">
      {/* Left Column: หัวข้อข่าวเทคโนโลยี (Tech News Headlines) */}
      <div className="col-lg-6 mb-5">
        <div className="mb-4">
          <h2 className="text-primary font-weight-bold">หัวข้อข่าวเทคโนโลยี</h2>
          <div className="bg-blue-500 w-20 h-1"></div>
        </div>

        <a
          href={safeExternalUrl(spotlight?.url)}
          target={spotlight?.url ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-white text-decoration-none d-block group"
        >
          <div className="position-relative image-hover overflow-hidden rounded-2">
            <Image
              src={spotlight?.image || "/404.png"}
              className="img-fluid w-100"
              style={{ width: "100%", height: "400px", objectFit: "cover" }}
              alt={spotlight?.title || "Tech News Headlines"}
              width={1200}
              height={800}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith("/404.png")) {
                  target.src = "/404.png";
                }
              }}
            />
          </div>
          <h3 className="font-weight-600 mt-3 text-white lh-base">
            {spotlight?.title || "หัวข้อข่าวเทคโนโลยี"}
          </h3>
          {spotlight?.description && (
            <p className="fs-15 text-secondary mt-2 line-clamp-3">
              {spotlight.description}
            </p>
          )}
        </a>
      </div>

      {/* Right Column: ข่าวเทคโนโลยีต่างประเทศ (Top) & ข่าวเทคโนโลยีไทย (Bottom) */}
      <div className="col-lg-6 mb-5">
        {/* ข่าวเทคโนโลยีต่างประเทศ (International Tech News) */}
        <div className="mb-4">
          <div className="mb-4">
            <h2 className="text-primary font-weight-bold">ข่าวเทคโนโลยีต่างประเทศ</h2>
            <div className="bg-blue-500 w-20 h-1"></div>
          </div>

          <div className="row">
            {[0, 1].map((idx) => {
              const art = internationalArticles[idx];
              return (
                <div className="col-6 mb-3" key={idx}>
                  <a
                    href={safeExternalUrl(art?.url)}
                    target={art?.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-white text-decoration-none d-block"
                  >
                    <div className="position-relative image-hover overflow-hidden rounded-2">
                      <Image
                        src={art?.image || "/404.png"}
                        className="img-fluid w-100"
                        style={{ width: "100%", height: "220px", objectFit: "cover" }}
                        alt={art?.title || "International Tech News"}
                        width={700}
                        height={500}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.endsWith("/404.png")) {
                            target.src = "/404.png";
                          }
                        }}
                      />
                    </div>
                    <h6 className="font-weight-600 mt-2 text-white lh-base">
                      {art?.title || (idx === 0 ? "ข่าวเทคโนโลยีต่างประเทศ 1" : "ข่าวเทคโนโลยีต่างประเทศ 2")}
                    </h6>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* ข่าวเทคโนโลยีไทย (Thai Tech News) */}
        <div className="mt-4">
          <div className="mb-4">
            <h2 className="text-primary font-weight-bold">ข่าวเทคโนโลยีไทย</h2>
            <div className="bg-blue-500 w-20 h-1"></div>
          </div>

          <div className="row">
            {[0, 1].map((idx) => {
              const art = thaiArticles[idx];
              return (
                <div className="col-6 mb-3" key={idx}>
                  <a
                    href={safeExternalUrl(art?.url)}
                    target={art?.url ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-white text-decoration-none d-block"
                  >
                    <div className="position-relative image-hover overflow-hidden rounded-2">
                      <Image
                        src={art?.image || "/404.png"}
                        className="img-fluid w-100"
                        style={{ width: "100%", height: "220px", objectFit: "cover" }}
                        alt={art?.title || "Thai Tech News"}
                        width={700}
                        height={500}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.endsWith("/404.png")) {
                            target.src = "/404.png";
                          }
                        }}
                      />
                    </div>
                    <h6 className="font-weight-600 mt-2 text-white lh-base">
                      {art?.title || (idx === 0 ? "ข่าวเทคโนโลยีไทย 1" : "ข่าวเทคโนโลยีไทย 2")}
                    </h6>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
