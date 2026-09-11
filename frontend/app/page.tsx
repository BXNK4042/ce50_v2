"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Teachers } from "@/types/teacher";

export default function Home() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);

  useEffect(() => {
    async function getTeachers() {
      try {
        const response = await fetch("http://localhost:8000/teachers");
        setTeachers(await response.json());
      } catch (err) {
        console.error(err);
      }
    }
    getTeachers();
  }, []);

  const teacherChunks: Teachers[][] = [];
  for (let i = 0; i < teachers.length; i += 4) {
    teacherChunks.push(teachers.slice(i, i + 4));
  }

  return (
    <div>
      {/* 1st section: Hero video */}
      <div className="bg-black flex justify-center items-center">
        <Image
          src="/ce_logo.webp"
          alt="CE_LOGO"
          width={500}
          height={500}
          className="absolute z-1 transition-transform duration-300 ease-in-out hover:scale-110"
          draggable="false"
        />
        <video className="w-100 opacity-50 z-0" muted autoPlay loop>
          <source src="/ce_hero_footage_zoomed.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="template-container">
        {/* 2nd section: News (2nd section from news page) */}
        <div className="editors-news text-light my-5">
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
                <Image
                  src="/404.png"
                  className="img-fluid"
                  alt="ce50-news"
                  width={700}
                  height={700}
                />
              </div>
              <h1 className="font-weight-600 mt-3">
                Melania Trump speaks about courage at State Department
              </h1>
            </div>
            <div className="col-lg-6 mb-5 mb-sm-2">
              <div className="row">
                <div className="col-sm-6 mb-5 mb-sm-2">
                  <div className="position-relative image-hover">
                    <Image
                      src="/404.png"
                      className="img-fluid"
                      alt="ce50-news"
                      width={700}
                      height={700}
                    />
                    <span className="thumb-title">POLITICS</span>
                  </div>
                  <h5 className="font-weight-600 mt-3">
                    A look at California's eerie plane graveyards
                  </h5>
                </div>
                <div className="col-sm-6 mb-5 mb-sm-2">
                  <div className="position-relative image-hover">
                    <Image
                      src="/404.png"
                      className="img-fluid"
                      alt="ce50-news"
                      width={700}
                      height={700}
                    />
                    <span className="thumb-title">TRAVEL</span>
                  </div>
                  <h5 className="font-weight-600 mt-3">
                    The world's most beautiful racecourses
                  </h5>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-sm-6 mb-5 mb-sm-2">
                  <div className="position-relative image-hover">
                    <Image
                      src="/404.png"
                      className="img-fluid"
                      alt="ce50-news"
                      width={700}
                      height={700}
                    />
                    <span className="thumb-title">POLITICS</span>
                  </div>
                  <h5 className="font-weight-600 mt-3">
                    Japan cancels cherry blossom festivals over virus fears
                  </h5>
                </div>
                <div className="col-sm-6">
                  <div className="position-relative image-hover">
                    <Image
                      src="/404.png"
                      className="img-fluid"
                      alt="ce50-news"
                      width={700}
                      height={700}
                    />
                    <span className="thumb-title">TRAVEL</span>
                  </div>
                  <h5 className="font-weight-600 mt-3">
                    Classic cars reborn as electric vehicles
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3rd section: Teachers Card Carousel */}
        <div className="teachers-carousel my-5 text-light">
          <div className="row">
            <div className="col-lg-3">
              <div className="position-relative float-left">
                <div className="mt-5 mb-5">
                  <h1 className="text-primary">คณาจารย์</h1>
                  <div className="bg-blue-500 w-100 h-1"></div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="teacherCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {(teacherChunks.length > 0
                ? teacherChunks
                : [
                    [
                      {
                        teacher_id: 1,
                        teacher_firstname: "อาจารย์",
                        teacher_lastname: "",
                        teacher_image: "",
                        teacher_advise_year: "",
                        teacher_contact: "",
                        created_at: "",
                        teacher_name_en: "silar",
                      },
                    ],
                  ]
              ).map((chunk, idx) => (
                <div
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  key={idx}
                >
                  <div className="row row-cols-1 row-cols-md-4 g-4 px-4">
                    {chunk.map((teacher) => (
                      <div className="col" key={teacher.teacher_id}>
                        <div className="card text-bg-dark text-center h-100">
                          <Image
                            src={
                              teacher.teacher_name_en
                                ? `http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}_bg.webp`
                                : "/404.png"
                            }
                            alt={teacher.teacher_firstname}
                            width={500}
                            height={500}
                            className="card-img-top"
                          />
                          <div className="card-body">
                            <h5 className="card-title">
                              {teacher.teacher_firstname}{" "}
                              {teacher.teacher_lastname}
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#teacherCarousel"
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
              data-bs-target="#teacherCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
