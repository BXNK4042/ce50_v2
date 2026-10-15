"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GNewsArticle } from "@/types/gnews";
import { Teachers } from "@/types/teacher";

export default function Home() {
  const [headlinesTech, setHeadlinesTech] = useState<GNewsArticle[]>([]);
  const [usTech, setUsTech] = useState<GNewsArticle[]>([]);
  const [thTech, setThTech] = useState<GNewsArticle[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingNews(true);
        const [headlinesRes, usRes, thRes, teachersRes] = await Promise.all([
          fetch("/api/gnews?category=technology&max=2"),
          fetch("/api/gnews?country=us&max=2"),
          fetch("/api/gnews?country=th&max=2"),
          fetch("/api/teachers"),
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
        if (teachersRes.ok) {
          setTeachers(await teachersRes.json());
        }
      } catch (err) {
        console.error("Failed to load home page data", err);
      } finally {
        setLoadingNews(false);
      }
    }

    loadData();
  }, []);

  const spotlight = headlinesTech[0];
  const internationalArticles = usTech.slice(0, 2);
  const thaiArticles = thTech.slice(0, 2);

  // Group teachers into slides of 4 cards each (matching /teachers page)
  const chunkSize = 4;
  const teacherSlides: Teachers[][] = [];
  for (let i = 0; i < teachers.length; i += chunkSize) {
    teacherSlides.push(teachers.slice(i, i + chunkSize));
  }

  return (
    <div>
      {/* Section 1: Hero Video */}
      <div className="bg-black flex justify-center items-center position-relative">
        <Image
          src="/ce_logo.webp"
          alt="CE_LOGO"
          width="500"
          height="500"
          className="absolute z-1 transition-transform duration-300 ease-in-out hover:scale-110 user-select-none"
          style={{ width: "min(50vw, 500px)", height: "auto" }}
          draggable="false"
        />
        <video className="w-100 opacity-50 z-0" muted autoPlay loop>
          <source src="/ce_hero_footage_zoomed.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="template-container">
        {/* Section 2: ข่าวสารล่าสุด (Latest News จากหน้า News) */}
        <div className="editors-news text-light my-5 py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
              {/*<h1 className="text-primary">ข่าวสารล่าสุด</h1>*/}
              <div className="bg-blue-500 w-24 h-1"></div>
            </div>
            <Link href="/news" className="btn btn-primary">
              ดูข่าวสารทั้งหมด &rarr;
            </Link>
          </div>

          {loadingNews ? (
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
                          style={{ height: "150px" }}
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
                          style={{ height: "150px" }}
                        ></span>
                        <span className="placeholder col-11 bg-secondary bg-opacity-50 mt-2 d-block py-1"></span>
                        <span className="placeholder col-8 bg-secondary bg-opacity-25 mt-1 d-block py-1"></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Left Column: หัวข้อข่าวเทคโนโลยี (Tech News Headlines) */}
              <div className="col-lg-6 mb-5">
                <div className="mb-4">
                  <h2 className="text-primary font-weight-bold">หัวข้อข่าวเทคโนโลยี</h2>
                  <div className="bg-blue-500 w-20 h-1"></div>
                </div>

                <a
                  href={spotlight?.url || "#"}
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
                        (e.currentTarget as HTMLImageElement).src = "/404.png";
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
                            href={art?.url || "#"}
                            target={art?.url ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-white text-decoration-none d-block"
                          >
                            <div className="position-relative image-hover overflow-hidden rounded-2">
                              <Image
                                src={art?.image || "/404.png"}
                                className="img-fluid w-100"
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                alt={art?.title || "International Tech News"}
                                width={700}
                                height={500}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/404.png";
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
                            href={art?.url || "#"}
                            target={art?.url ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-white text-decoration-none d-block"
                          >
                            <div className="position-relative image-hover overflow-hidden rounded-2">
                              <Image
                                src={art?.image || "/404.png"}
                                className="img-fluid w-100"
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                                alt={art?.title || "Thai Tech News"}
                                width={700}
                                height={500}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "/404.png";
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
          )}
        </div>

        {/* Section 3: คณาจารย์ (Teacher Card Carousel) */}
        <div className="teachers-section text-light my-5 py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
              <h1 className="text-primary">คณาจารย์</h1>
              <div className="bg-blue-500 w-24 h-1"></div>
            </div>
            <Link href="/teachers" className="btn btn-primary">
              ดูคณาจารย์ทั้งหมด &rarr;
            </Link>
          </div>

          {teacherSlides.length > 0 && (
            <div
              id="teachersCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {teacherSlides.map((slide, slideIdx) => (
                  <div
                    className={`carousel-item ${slideIdx === 0 ? "active" : ""}`}
                    key={slideIdx}
                  >
                    <div className="row row-cols-1 row-cols-md-4 g-4">
                      {slide.map((teacher) => (
                        <div className="col" key={teacher.teacher_id}>
                          <Link
                            href="/teachers"
                            className="text-decoration-none user-select-none"
                            draggable="false"
                          >
                            <div
                              className="card text-bg-dark justify-content-center align-items-center hover:opacity-75 duration-150 user-select-none"
                              draggable="false"
                            >
                              <Image
                                src={`/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
                                alt={teacher.teacher_firstname}
                                width={1000}
                                height={1000}
                                draggable="false"
                              />
                              <div className="card-body text-center">
                                <h5 className="card-title">
                                  {teacher.teacher_firstname}{" "}
                                  {teacher.teacher_lastname}
                                </h5>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {teacherSlides.length > 1 && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#teachersCarousel"
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
                    data-bs-target="#teachersCarousel"
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
        </div>
      </div>
    </div>
  );
}
