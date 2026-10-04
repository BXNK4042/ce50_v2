"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GNewsArticle } from "@/types/gnews";
import { Teachers } from "@/types/teacher";

export default function Home() {
  const [latestTech, setLatestTech] = useState<GNewsArticle[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingNews(true);
        const [newsRes, teachersRes] = await Promise.all([
          fetch("/api/gnews?country=th&max=5"),
          fetch("/api/teachers"),
        ]);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (Array.isArray(newsData.articles)) setLatestTech(newsData.articles);
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

  const featured = latestTech[0];
  const sideArticles = latestTech.slice(1, 5);

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
          className="absolute z-1 transition-transform duration-300 ease-in-out hover:scale-110"
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
              <h1 className="text-primary">ข่าวสารล่าสุด</h1>
              <div className="bg-blue-500 w-24 h-1"></div>
            </div>
            <Link href="/news" className="btn btn-primary">
              ดูข่าวสารทั้งหมด &rarr;
            </Link>
          </div>

          {loadingNews ? (
            <div className="row placeholder-glow">
              {/* Skeleton รูปใหญ่ซ้าย */}
              <div className="col-lg-6 mb-5 mb-sm-2">
                <span
                  className="placeholder col-12 bg-secondary bg-opacity-25 rounded d-block"
                  style={{ height: "440px" }}
                ></span>
                <span className="placeholder col-8 bg-secondary bg-opacity-50 mt-3 d-block py-2"></span>
                <span className="placeholder col-12 bg-secondary bg-opacity-25 mt-2 d-block py-1"></span>
              </div>

              {/* Skeleton 4 รูปย่อยขวา */}
              <div className="col-lg-6 mb-5 mb-sm-2">
                <div className="row">
                  {[0, 1].map((idx) => (
                    <div className="col-sm-6 mb-5 mb-sm-2" key={idx}>
                      <span
                        className="placeholder col-12 bg-secondary bg-opacity-25 rounded d-block"
                        style={{ height: "200px" }}
                      ></span>
                      <span className="placeholder col-10 bg-secondary bg-opacity-50 mt-2 d-block py-1"></span>
                    </div>
                  ))}
                </div>
                <div className="row mt-3">
                  {[2, 3].map((idx) => (
                    <div
                      className={
                        idx === 2 ? "col-sm-6 mb-5 mb-sm-2" : "col-sm-6"
                      }
                      key={idx}
                    >
                      <span
                        className="placeholder col-12 bg-secondary bg-opacity-25 rounded d-block"
                        style={{ height: "200px" }}
                      ></span>
                      <span className="placeholder col-10 bg-secondary bg-opacity-50 mt-2 d-block py-1"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* รูปใหญ่ฝั่งซ้าย */}
              <div className="col-lg-6 mb-5 mb-sm-2">
                <a
                  href={featured?.url || "#"}
                  target={featured?.url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-white text-decoration-none d-block"
                >
                  <div className="position-relative image-hover">
                    <Image
                      src={featured?.image || "/404.png"}
                      className="img-fluid w-100"
                      style={{
                        width: "100%",
                        height: "440px",
                        objectFit: "cover",
                      }}
                      alt={featured?.title || "ce50-news"}
                      width={1200}
                      height={800}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/404.png";
                      }}
                    />
                  </div>
                  <h1 className="font-weight-600 mt-3">
                    {featured?.title || "ข่าวเทคโนโลยีล่าสุด"}
                  </h1>
                  {featured?.description && (
                    <p className="fs-15 font-weight-normal text-secondary mt-2">
                      {featured.description}
                    </p>
                  )}
                </a>
              </div>

              {/* 4 รูปย่อยฝั่งขวา */}
              <div className="col-lg-6 mb-5 mb-sm-2">
                <div className="row">
                  {[0, 1].map((idx) => {
                    const art = sideArticles[idx];
                    return (
                      <div className="col-sm-6 mb-5 mb-sm-2" key={idx}>
                        <a
                          href={art?.url || "#"}
                          target={art?.url ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-white text-decoration-none d-block"
                        >
                          <div className="position-relative image-hover">
                            <Image
                              src={art?.image || "/404.png"}
                              className="img-fluid w-100"
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                              }}
                              alt={art?.title || "ce50-news"}
                              width={700}
                              height={500}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "/404.png";
                              }}
                            />
                          </div>
                          <h5 className="font-weight-600 mt-3">
                            {art?.title || "หัวข้อข่าวเทคโนโลยี"}
                          </h5>
                        </a>
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
                        <a
                          href={art?.url || "#"}
                          target={art?.url ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-white text-decoration-none d-block"
                        >
                          <div className="position-relative image-hover">
                            <Image
                              src={art?.image || "/404.png"}
                              className="img-fluid w-100"
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                              }}
                              alt={art?.title || "ce50-news"}
                              width={700}
                              height={500}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  "/404.png";
                              }}
                            />
                          </div>
                          <h5 className="font-weight-600 mt-3">
                            {art?.title || "หัวข้อข่าวเทคโนโลยี"}
                          </h5>
                        </a>
                      </div>
                    );
                  })}
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
