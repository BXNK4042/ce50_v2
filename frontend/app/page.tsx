"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Teachers } from "@/types/teacher";
import TechNewsSection from "@/components/TechNewsSection";

export default function Home() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const teachersRes = await fetch("/api/teachers");
        if (teachersRes.ok) {
          setTeachers(await teachersRes.json());
        }
      } catch (err) {
        console.error("Failed to load home page data", err);
      }
    }

    loadData();
  }, []);

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

          <TechNewsSection spacing="balanced" />
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
