"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, Minimize2, Scale, Maximize2 } from "lucide-react";
import { Teachers } from "@/types/teacher";
import TechNewsSection, { TechNewsSpacing } from "@/components/TechNewsSection";

type SpacingStyle = "compact" | "balanced" | "spacious";

interface SpacingConfig {
  id: SpacingStyle;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  sectionMargin: string;
  sectionStyle?: React.CSSProperties;
  headerMargin: string;
  carouselGutter: string;
  cardBodyClass: string;
  switcherMargin: string;
}

const SPACING_CONFIGS: Record<SpacingStyle, SpacingConfig> = {
  compact: {
    id: "compact",
    name: "Style 1: Compact",
    subtitle: "Tight margins, dense flow",
    badge: "Dense Flow",
    description: "Tight vertical margins, reduced gutters, and compact spacing for high information density",
    sectionMargin: "my-2 py-2",
    headerMargin: "mb-2",
    carouselGutter: "row-cols-1 row-cols-md-4 g-2 g-md-3",
    cardBodyClass: "card-body text-center p-2",
    switcherMargin: "mb-3",
  },
  balanced: {
    id: "balanced",
    name: "Style 2: Balanced",
    subtitle: "Standard modern web margins",
    badge: "Modern Standard",
    description: "Standard modern web spacing with balanced component separation and familiar rhythm",
    sectionMargin: "my-5 py-4",
    headerMargin: "mb-4",
    carouselGutter: "row-cols-1 row-cols-md-4 g-4",
    cardBodyClass: "card-body text-center",
    switcherMargin: "mb-4",
  },
  spacious: {
    id: "spacious",
    name: "Style 3: Spacious",
    subtitle: "Generous editorial breathing room",
    badge: "Editorial Breathing Room",
    description: "Generous editorial spacing, relaxed section margins, and expansive breathing room",
    sectionMargin: "py-5",
    sectionStyle: {
      marginTop: "4.5rem",
      marginBottom: "4.5rem",
      paddingTop: "2.5rem",
      paddingBottom: "2.5rem",
    },
    headerMargin: "mb-5",
    carouselGutter: "row-cols-1 row-cols-md-4 g-4 g-lg-5",
    cardBodyClass: "card-body text-center p-4",
    switcherMargin: "mb-5",
  },
};

export default function Home() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [spacingStyle, setSpacingStyle] = useState<SpacingStyle>("balanced");

  const currentSpacing = SPACING_CONFIGS[spacingStyle];

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
        {/* Interactive Spacing Switcher Bar */}
        <div
          className={`card bg-black border border-secondary border-opacity-25 rounded-3 p-3 shadow-sm ${currentSpacing.switcherMargin}`}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <SlidersHorizontal size={20} className="text-primary flex-shrink-0" />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold text-white">Spacing Style:</span>
                  <span className="text-info fw-medium">{currentSpacing.name}</span>
                  <span className="badge bg-secondary bg-opacity-50 text-light fw-normal">
                    {currentSpacing.badge}
                  </span>
                </div>
                <small className="text-secondary d-none d-sm-inline">
                  {currentSpacing.subtitle} &mdash; {currentSpacing.description}
                </small>
              </div>
            </div>

            <div
              className="btn-group"
              role="group"
              aria-label="Vertical spacing switcher"
            >
              <button
                type="button"
                className={`btn btn-sm ${
                  spacingStyle === "compact"
                    ? "btn-primary"
                    : "btn-dark border-secondary border-opacity-25"
                }`}
                onClick={() => setSpacingStyle("compact")}
              >
                <span className="d-inline-flex align-items-center gap-1">
                  <Minimize2 size={14} />
                  <span>Style 1: Compact</span>
                </span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  spacingStyle === "balanced"
                    ? "btn-primary"
                    : "btn-dark border-secondary border-opacity-25"
                }`}
                onClick={() => setSpacingStyle("balanced")}
              >
                <span className="d-inline-flex align-items-center gap-1">
                  <Scale size={14} />
                  <span>Style 2: Balanced</span>
                </span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  spacingStyle === "spacious"
                    ? "btn-primary"
                    : "btn-dark border-secondary border-opacity-25"
                }`}
                onClick={() => setSpacingStyle("spacious")}
              >
                <span className="d-inline-flex align-items-center gap-1">
                  <Maximize2 size={14} />
                  <span>Style 3: Spacious</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: ข่าวสารล่าสุด (Latest News จากหน้า News) */}
        <div
          className={`editors-news text-light ${currentSpacing.sectionMargin}`}
          style={currentSpacing.sectionStyle}
        >
          <div
            className={`d-flex justify-content-between align-items-center ${currentSpacing.headerMargin}`}
          >
            <div>
              <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
              {/*<h1 className="text-primary">ข่าวสารล่าสุด</h1>*/}
              <div className="bg-blue-500 w-24 h-1"></div>
            </div>
            <Link href="/news" className="btn btn-primary">
              ดูข่าวสารทั้งหมด &rarr;
            </Link>
          </div>

          <TechNewsSection spacing={spacingStyle as TechNewsSpacing} />
        </div>

        {/* Section 3: คณาจารย์ (Teacher Card Carousel) */}
        <div
          className={`teachers-section text-light ${currentSpacing.sectionMargin}`}
          style={currentSpacing.sectionStyle}
        >
          <div
            className={`d-flex justify-content-between align-items-center ${currentSpacing.headerMargin}`}
          >
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
                    <div className={`row ${currentSpacing.carouselGutter}`}>
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
                              <div className={currentSpacing.cardBodyClass}>
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
