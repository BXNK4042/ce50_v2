"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Award, Briefcase, GraduationCap, RotateCcw, Printer } from "lucide-react";

export default function TestQuizShowcasePage() {
  const [selectedStyle, setSelectedStyle] = useState<"style1" | "style2" | "style3">("style1");
  const [viewMode, setViewMode] = useState<"question" | "result">("question");
  const [selectedOption, setSelectedOption] = useState<number>(1);

  const sampleQuestion = {
    id: 14,
    total: 30,
    section: "Technical Competency",
    section_th: "ความถนัดเชิงเทคนิคและการพัฒนาระบบ",
    question: "เมื่อคุณต้องออกแบบระบบที่มีผู้ใช้งานพร้อมกันจำนวนมาก คุณให้ความสำคัญกับสิ่งใดมากที่สุด?",
    options: [
      { id: 0, label: "A", text: "สถาปัตยกรรม High Availability และการรองรับ Horizontal Scaling" },
      { id: 1, label: "B", text: "ความปลอดภัยของข้อมูล (Security, Data Encryption และ Zero Trust)" },
      { id: 2, label: "C", text: "ประสิทธิภาพของอัลกอริทึม การแคช (Caching) และลด Latency ใน Database" },
      { id: 3, label: "D", text: "ความง่ายในการใช้งาน (UI/UX) และความเสถียรของฝั่ง Client-side" },
    ],
  };

  const sampleResult = {
    topRole: {
      title: "Backend & Distributed Systems Engineer",
      title_th: "วิศวกรพัฒนาระบบแบ็กเอนด์และสถาปัตยกรรมแบบกระจาย",
      match: 94,
      score: 142,
      maxScore: 150,
      summary: "คุณมีความโดดเด่นด้านการออกแบบระบบเบื้องหลัง (Core Architecture), การจัดการฐานข้อมูลขนาดใหญ่ และระบบเครือข่ายที่มีความน่าเชื่อถือสูง",
      skills: ["Distributed Systems", "Database Optimization", "API Design", "Cloud Infrastructure", "System Security"],
      courses: ["Database Systems", "Operating Systems", "Computer Architecture", "Computer Networks"],
      career: "Junior Backend Developer -> Senior Systems Architect -> Chief Technology Officer (CTO)",
    },
    secondRole: {
      title: "Cybersecurity & Network Engineer",
      title_th: "วิศวกรความมั่นคงปลอดภัยไซเบอร์และเครือข่าย",
      match: 86,
    },
    thirdRole: {
      title: "Cloud & DevOps Infrastructure Engineer",
      title_th: "วิศวกรคลาวด์และการส่งมอบระบบอัตโนมัติ",
      match: 81,
    },
  };

  return (
    <div className="template-container py-5 text-white">
      {/* Top Header & Switcher */}
      <div className="mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">เปรียบเทียบสไตล์หน้าแบบประเมิน (Quiz Styles Showcase)</h1>
        <div className="bg-blue-500 w-24 h-1 mt-2 mb-4"></div>
        <p className="text-secondary lead">
          ลองเลือกสไตล์และสลับดูทั้ง <strong>หน้าตอบคำถาม (Question View)</strong> และ <strong>หน้าสรุปผล (Result View)</strong>
        </p>

        {/* Style & View Controls */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-dark p-3 rounded-3 border border-secondary border-opacity-50 mt-4">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <span className="text-secondary small fw-bold text-uppercase me-1">เลือกสไตล์:</span>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${selectedStyle === "style1" ? "btn-primary fw-bold" : "btn-outline-secondary text-white"}`}
                onClick={() => setSelectedStyle("style1")}
              >
                Style 1: Clean Light Surface (เข้าชุดกับตารางและ Modal)
              </button>
              <button
                type="button"
                className={`btn ${selectedStyle === "style2" ? "btn-primary fw-bold" : "btn-outline-secondary text-white"}`}
                onClick={() => setSelectedStyle("style2")}
              >
                Style 2: Minimalist Tech Dark (เรียบหรู คมชัด)
              </button>
              <button
                type="button"
                className={`btn ${selectedStyle === "style3" ? "btn-primary fw-bold" : "btn-outline-secondary text-white"}`}
                onClick={() => setSelectedStyle("style3")}
              >
                Style 3: Interactive Card Deck (Typeform/Duolingo Focus)
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small fw-bold text-uppercase me-1">มุมมอง:</span>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className={`btn ${viewMode === "question" ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-white"}`}
                onClick={() => setViewMode("question")}
              >
                หน้าตอบคำถาม
              </button>
              <button
                type="button"
                className={`btn ${viewMode === "result" ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-white"}`}
                onClick={() => setViewMode("result")}
              >
                หน้าสรุปผลลัพธ์
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STYLE 1: Clean Light Surface (Matches Table Style 1 & Modal Style 1)
         ========================================================================= */}
      {selectedStyle === "style1" && (
        <div>
          {viewMode === "question" ? (
            <div className="card bg-white text-dark border-0 rounded-4 shadow-2xl overflow-hidden p-4 p-md-5 mx-auto" style={{ maxWidth: "860px" }}>
              {/* Question Progress Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-primary text-white px-3 py-2 fs-6 fw-semibold">
                  {sampleQuestion.section}
                </span>
                <span className="text-muted fw-semibold">
                  ข้อ {sampleQuestion.id} / {sampleQuestion.total}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="progress mb-4" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${(sampleQuestion.id / sampleQuestion.total) * 100}%` }}
                ></div>
              </div>

              {/* Question Text */}
              <h3 className="fw-bold text-dark mb-4 lh-base">
                {sampleQuestion.question}
              </h3>

              {/* Options List */}
              <div className="d-flex flex-column gap-3 mb-5">
                {sampleQuestion.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-3 p-md-4 rounded-3 border d-flex align-items-center justify-content-between transition-all ${
                        isSelected
                          ? "border-primary bg-primary bg-opacity-10 text-primary shadow-sm"
                          : "border-light-subtle bg-light hover:bg-white text-dark"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`badge rounded-circle d-flex align-items-center justify-content-center ${
                            isSelected ? "bg-primary text-white" : "bg-white text-secondary border"
                          }`}
                          style={{ width: "32px", height: "32px" }}
                        >
                          {opt.label}
                        </span>
                        <span className={`fw-medium fs-6 ${isSelected ? "text-primary fw-bold" : "text-dark"}`}>
                          {opt.text}
                        </span>
                      </div>
                      {isSelected && <Check size={20} className="text-primary flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Footer Controls */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <button type="button" className="btn btn-outline-secondary px-4 py-2 d-inline-flex align-items-center gap-2">
                  <ChevronLeft size={18} /> ย้อนกลับ
                </button>
                <button type="button" className="btn btn-primary px-5 py-2 fw-semibold d-inline-flex align-items-center gap-2">
                  ถัดไป <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            /* Result View: Style 1 Clean Light Document Card */
            <div className="card bg-white text-dark border-0 rounded-4 shadow-2xl p-4 p-md-5 mx-auto" style={{ maxWidth: "960px" }}>
              <div className="text-center pb-4 mb-4 border-bottom">
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-bold mb-2">
                  การประเมินเสร็จสมบูรณ์
                </span>
                <h2 className="fw-bold text-dark mt-2 mb-1">ผลการวิเคราะห์สายอาชีพของคุณ</h2>
                <p className="text-muted small">วิเคราะห์ตามเกณฑ์มาตรฐาน BCS Tech Career Framework</p>
              </div>

              {/* Primary Match */}
              <div className="p-4 rounded-3 border border-primary border-opacity-25 bg-light mb-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span className="badge bg-primary text-white mb-2">อันดับที่ 1 (Top Match)</span>
                    <h3 className="fw-bold text-dark mb-1">{sampleResult.topRole.title}</h3>
                    <h5 className="text-secondary fw-normal mb-0">{sampleResult.topRole.title_th}</h5>
                  </div>
                  <div className="text-end">
                    <div className="display-6 fw-bold text-primary">{sampleResult.topRole.match}%</div>
                    <small className="text-muted">ความสอดคล้อง</small>
                  </div>
                </div>

                <p className="text-dark mb-4">{sampleResult.topRole.summary}</p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="text-uppercase small fw-bold text-muted mb-2">ทักษะสำคัญที่เกี่ยวข้อง</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {sampleResult.topRole.skills.map((s, idx) => (
                        <span key={idx} className="badge bg-white text-dark border px-3 py-2">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-uppercase small fw-bold text-muted mb-2">รายวิชาที่แนะนำในหลักสูตร CE</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {sampleResult.topRole.courses.map((c, idx) => (
                        <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Matches */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border bg-white h-100">
                    <span className="badge bg-secondary text-white mb-2">อันดับที่ 2</span>
                    <h5 className="fw-bold text-dark mb-1">{sampleResult.secondRole.title}</h5>
                    <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
                      <span>ความสอดคล้อง</span>
                      <strong className="text-dark">{sampleResult.secondRole.match}%</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border bg-white h-100">
                    <span className="badge bg-secondary text-white mb-2">อันดับที่ 3</span>
                    <h5 className="fw-bold text-dark mb-1">{sampleResult.thirdRole.title}</h5>
                    <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
                      <span>ความสอดคล้อง</span>
                      <strong className="text-dark">{sampleResult.thirdRole.match}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex justify-content-center gap-3 pt-3 border-top">
                <button type="button" className="btn btn-outline-secondary px-4 d-inline-flex align-items-center gap-2">
                  <RotateCcw size={16} /> ทำแบบประเมินใหม่
                </button>
                <button type="button" className="btn btn-primary px-4 fw-semibold d-inline-flex align-items-center gap-2">
                  <Printer size={16} /> บันทึกผลลัพธ์ (Print)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STYLE 2: Minimalist Tech Dark (Deep Charcoal, Sleek Border)
         ========================================================================= */}
      {selectedStyle === "style2" && (
        <div>
          {viewMode === "question" ? (
            <div
              className="card text-white border rounded-4 shadow-2xl p-4 p-md-5 mx-auto"
              style={{ maxWidth: "860px", backgroundColor: "#121212", borderColor: "#262626" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary small font-monospace">
                  SECTION {sampleQuestion.id > 15 ? "02" : "01"} // {sampleQuestion.section}
                </span>
                <span className="font-monospace text-primary small fw-bold">
                  {sampleQuestion.id.toString().padStart(2, "0")} / {sampleQuestion.total}
                </span>
              </div>

              <div className="progress mb-4 bg-black" style={{ height: "4px" }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${(sampleQuestion.id / sampleQuestion.total) * 100}%` }}
                ></div>
              </div>

              <h3 className="fw-semibold text-white mb-4 lh-base" style={{ letterSpacing: "-0.01em" }}>
                {sampleQuestion.question}
              </h3>

              <div className="d-flex flex-column gap-3 mb-5">
                {sampleQuestion.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-3 p-md-4 rounded-3 border d-flex align-items-center justify-content-between transition-all`}
                      style={{
                        backgroundColor: isSelected ? "#1e293b" : "#171717",
                        borderColor: isSelected ? "#3b82f6" : "#262626",
                        cursor: "pointer",
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span
                          className="font-monospace fw-bold small d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: "28px",
                            height: "28px",
                            backgroundColor: isSelected ? "#3b82f6" : "#262626",
                            color: isSelected ? "#ffffff" : "#888888",
                          }}
                        >
                          {opt.label}
                        </span>
                        <span className={`fs-6 ${isSelected ? "text-white fw-semibold" : "text-light"}`}>
                          {opt.text}
                        </span>
                      </div>
                      {isSelected && <Check size={18} className="text-primary" />}
                    </div>
                  );
                })}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{ borderColor: "#262626" }}>
                <button
                  type="button"
                  className="btn btn-dark border px-4 py-2 text-secondary d-inline-flex align-items-center gap-2"
                  style={{ borderColor: "#333" }}
                >
                  <ChevronLeft size={16} /> ย้อนกลับ
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  ถัดไป <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Result View: Style 2 Minimalist Dark */
            <div
              className="card text-white border rounded-4 shadow-2xl p-4 p-md-5 mx-auto"
              style={{ maxWidth: "960px", backgroundColor: "#121212", borderColor: "#262626" }}
            >
              <div className="text-center pb-4 mb-4 border-bottom" style={{ borderColor: "#262626" }}>
                <span className="badge bg-dark border border-secondary text-primary px-3 py-1 font-monospace mb-2">
                  EVALUATION COMPLETE
                </span>
                <h2 className="fw-bold text-white mt-2 mb-1">ผลการประเมินทักษะและบทบาทที่เหมาะสม</h2>
                <p className="text-secondary small">CE50 BCS Tech Career Analytical Matrix</p>
              </div>

              <div className="p-4 rounded-3 border mb-4" style={{ backgroundColor: "#181818", borderColor: "#2c2c2c" }}>
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span className="badge bg-primary text-white mb-2">RANK #01</span>
                    <h3 className="fw-bold text-white mb-1">{sampleResult.topRole.title}</h3>
                    <h5 className="text-secondary small mb-0">{sampleResult.topRole.title_th}</h5>
                  </div>
                  <div className="text-end">
                    <div className="display-6 fw-bold text-primary font-monospace">{sampleResult.topRole.match}%</div>
                    <small className="text-secondary">MATCH RATE</small>
                  </div>
                </div>

                <p className="text-light mb-4">{sampleResult.topRole.summary}</p>

                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="text-secondary small font-monospace text-uppercase mb-2">CORE SKILLS</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {sampleResult.topRole.skills.map((s, idx) => (
                        <span key={idx} className="badge bg-black border border-secondary text-secondary px-3 py-2 font-monospace">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-secondary small font-monospace text-uppercase mb-2">RECOMMENDED COURSES</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {sampleResult.topRole.courses.map((c, idx) => (
                        <span key={idx} className="badge bg-primary bg-opacity-20 text-info border border-primary border-opacity-30 px-3 py-2">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border" style={{ backgroundColor: "#181818", borderColor: "#2c2c2c" }}>
                    <span className="badge bg-secondary text-white small mb-2">RANK #02</span>
                    <h5 className="fw-semibold text-white mb-1">{sampleResult.secondRole.title}</h5>
                    <div className="text-end text-primary font-monospace mt-3">{sampleResult.secondRole.match}% MATCH</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded-3 border" style={{ backgroundColor: "#181818", borderColor: "#2c2c2c" }}>
                    <span className="badge bg-secondary text-white small mb-2">RANK #03</span>
                    <h5 className="fw-semibold text-white mb-1">{sampleResult.thirdRole.title}</h5>
                    <div className="text-end text-primary font-monospace mt-3">{sampleResult.thirdRole.match}% MATCH</div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 pt-3 border-top" style={{ borderColor: "#262626" }}>
                <button
                  type="button"
                  className="btn btn-dark border px-4 d-inline-flex align-items-center gap-2"
                  style={{ borderColor: "#333" }}
                >
                  <RotateCcw size={16} /> ทำแบบประเมินใหม่
                </button>
                <button type="button" className="btn btn-primary px-4 fw-semibold d-inline-flex align-items-center gap-2">
                  <Printer size={16} /> พิมพ์รายงานผล
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STYLE 3: Interactive Card Deck (Focus Mode, Big Buttons)
         ========================================================================= */}
      {selectedStyle === "style3" && (
        <div>
          {viewMode === "question" ? (
            <div className="mx-auto" style={{ maxWidth: "800px" }}>
              <div className="text-center mb-4">
                <span className="text-secondary small fw-bold text-uppercase d-block mb-1">
                  คำถามที่ {sampleQuestion.id} จาก {sampleQuestion.total}
                </span>
                <div className="progress bg-dark border border-secondary mx-auto" style={{ height: "8px", maxWidth: "400px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${(sampleQuestion.id / sampleQuestion.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="card bg-dark border-secondary p-4 p-md-5 rounded-4 shadow-lg mb-4 text-center">
                <h3 className="fw-bold text-white mb-5">{sampleQuestion.question}</h3>

                <div className="row g-3">
                  {sampleQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <div className="col-12" key={opt.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedOption(opt.id)}
                          className={`btn w-100 py-3 px-4 text-start rounded-3 d-flex align-items-center justify-content-between ${
                            isSelected
                              ? "btn-primary shadow-lg fw-bold"
                              : "btn-outline-secondary text-light bg-black"
                          }`}
                          style={{ transition: "all 0.2s ease" }}
                        >
                          <span className="fs-6">{opt.text}</span>
                          {isSelected && <Check size={20} className="flex-shrink-0" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-outline-light px-4 py-2 rounded-pill">
                  &larr; ก่อนหน้า
                </button>
                <button type="button" className="btn btn-primary px-5 py-2 fw-bold rounded-pill">
                  ข้อถัดไป &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* Result View: Style 3 Focused Cards */
            <div className="mx-auto" style={{ maxWidth: "860px" }}>
              <div className="card bg-dark border-primary p-4 p-md-5 rounded-4 shadow-lg text-center mb-4">
                <div className="p-3 rounded-circle bg-primary bg-opacity-25 text-primary d-inline-flex mx-auto mb-3">
                  <Award size={40} />
                </div>
                <h2 className="fw-bold text-white mb-1">{sampleResult.topRole.title}</h2>
                <h5 className="text-secondary fw-normal mb-3">{sampleResult.topRole.title_th}</h5>
                <div className="display-4 fw-bold text-primary mb-3">{sampleResult.topRole.match}% Match</div>
                <p className="lead text-light mb-4">{sampleResult.topRole.summary}</p>
                <div className="d-flex justify-content-center gap-3">
                  <button type="button" className="btn btn-outline-light px-4 rounded-pill">
                    ทำใหม่
                  </button>
                  <button type="button" className="btn btn-primary px-4 fw-bold rounded-pill">
                    ดูโครงงานที่เกี่ยวข้อง
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
