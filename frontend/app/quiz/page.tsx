"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  section: string;
  section_th: string;
  section_desc: string;
  question: string;
  is_multiple: boolean;
  options: Option[];
}

interface RoleResult {
  rank: number;
  role_id: number;
  title: string;
  title_th: string;
  category: string;
  icon: string;
  badge_color: string;
  score: number;
  max_score: number;
  match_percentage: number;
  relative_percentage: number;
  skills_abilities_score: number;
  summary: string;
  description: string;
  key_skills: string[];
  matching_ce_courses: string[];
  career_prospects: string;
}

interface EvaluationResponse {
  success: boolean;
  total_questions: number;
  answered_count: number;
  top_roles: RoleResult[];
  all_roles: RoleResult[];
}

export default function CareerQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllRoles, setShowAllRoles] = useState<boolean>(false);

  // Fetch 30 questions from Backend
  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/quiz/questions");
        if (!res.ok) {
          throw new Error(`Failed to load quiz questions (status: ${res.status})`);
        }
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err: unknown) {
        console.error("Error loading questions:", err);
        setError("ไม่สามารถโหลดข้อสอบจากระบบได้ โปรดตรวจสอบการเชื่อมต่อ Backend");
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Count answered questions
  const answeredCount = Object.entries(answers).filter(
    ([, val]) => val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : true)
  ).length;

  const progressPercentage = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  // Handle single option selection (Q1 - Q29)
  const handleSelectOption = (optionId: number) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id.toString()]: optionId,
    }));
  };

  // Handle multiple option selection (Q30)
  const handleToggleMultipleOption = (optionId: number) => {
    if (!currentQ) return;
    const currentSelected = (answers[currentQ.id.toString()] as number[]) || [];
    const exists = currentSelected.includes(optionId);
    const updated = exists
      ? currentSelected.filter((id) => id !== optionId)
      : [...currentSelected, optionId];

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id.toString()]: updated,
    }));
  };

  // Quick auto-fill for testing purposes (Random answers for Q1-Q30)
  const handleQuickAutofill = () => {
    const mockAnswers: Record<string, number | number[]> = {};
    questions.forEach((q) => {
      if (q.is_multiple) {
        // Select 3 to 5 random interests
        const shuffled = [...Array(q.options.length).keys()].sort(() => 0.5 - Math.random());
        mockAnswers[q.id.toString()] = shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
      } else {
        const randOpt = Math.floor(Math.random() * q.options.length);
        mockAnswers[q.id.toString()] = randOpt;
      }
    });
    setAnswers(mockAnswers);
  };

  // Submit answers to evaluate
  const handleSubmitEvaluation = async () => {
    if (answeredCount < 10) {
      if (!confirm("คุณยังตอบคำถามไม่ครบ คุณต้องการส่งเพื่อประเมินผลเบื้องต้นหรือไม่?")) {
        return;
      }
    }

    try {
      setEvaluating(true);
      setError(null);
      const res = await fetch("http://localhost:8000/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        throw new Error(`การประเมินผลล้มเหลว (Status: ${res.status})`);
      }

      const data = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Evaluation error:", err);
      setError("เกิดข้อผิดพลาดในการประเมินผล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setEvaluating(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="template-container py-5 text-center text-white min-vh-50 d-flex flex-column align-items-center justify-content-center">
        <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="fw-semibold">กำลังโหลดแบบประเมิน BCS Tech Career Quiz...</h4>
        <p className="text-secondary small">ระบบกำลังเตรียมคำถาม 30 ข้อมาตรฐานสากล</p>
      </div>
    );
  }

  // ==========================================
  // VIEW: RESULTS EVALUATION VIEW
  // ==========================================
  if (result && result.top_roles && result.top_roles.length > 0) {
    const topRole = result.top_roles[0];
    const secondRole = result.top_roles[1];
    const thirdRole = result.top_roles[2];

    return (
      <div className="template-container py-5 text-white">
        {/* Result Header */}
        <div className="text-center mb-5">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-2">
            <i className="bi bi-stars me-1"></i> Career Assessment Complete
          </span>
          <h1 className="fw-bold display-5 text-gradient mb-2">
            ผลการวิเคราะห์เส้นทางอาชีพไอทีของคุณ
          </h1>
          <p className="text-secondary lead mx-auto" style={{ maxWidth: "700px" }}>
            วิเคราะห์ตามกรอบมาตรฐาน <strong>BCS Tech Career Framework (30 มิติ)</strong> คัดสรรบทบาทที่ตรงกับทักษะ
            วิธีคิด พฤติกรรม และความชอบของคุณมากที่สุด
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button onClick={handleRetake} className="btn btn-outline-light rounded-pill px-4">
              <i className="bi bi-arrow-counterclockwise me-2"></i>ทำแบบประเมินใหม่
            </button>
            <button onClick={() => window.print()} className="btn btn-primary rounded-pill px-4">
              <i className="bi bi-printer me-2"></i>พิมพ์หรือบันทึกผล
            </button>
          </div>
        </div>

        {/* Top 1 Primary Career Match (Hero Card) */}
        {topRole && (
          <div className="card bg-dark text-white border-warning mb-5 shadow-lg overflow-hidden" style={{ borderWidth: "2px" }}>
            <div className="card-header bg-gradient bg-warning text-dark py-3 px-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <span className="fs-4">👑</span>
                <span className="fw-bold fs-5 text-uppercase letter-spacing-1">
                  อันดับที่ 1: เหมาะสมที่สุด (Top Match)
                </span>
              </div>
              <span className="badge bg-dark text-warning fs-6 px-3 py-2 rounded-pill">
                ความสอดคล้อง {topRole.match_percentage}%
              </span>
            </div>

            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-3 rounded-circle bg-warning bg-opacity-20 text-warning fs-2">
                      <i className={`bi ${topRole.icon || "bi-briefcase"}`}></i>
                    </div>
                    <div>
                      <h2 className="card-title fw-bold text-warning mb-1">{topRole.title}</h2>
                      <h5 className="text-secondary fw-semibold mb-0">{topRole.title_th}</h5>
                    </div>
                  </div>

                  <p className="lead text-light mb-3">{topRole.summary}</p>
                  <p className="text-secondary mb-4">{topRole.description}</p>

                  {/* Key Skills */}
                  <div className="mb-4">
                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">
                      <i className="bi bi-lightning-charge text-warning me-1"></i> ทักษะสำคัญประจำตำแหน่ง (Core Competencies)
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {topRole.key_skills?.map((skill, idx) => (
                        <span key={idx} className="badge bg-secondary bg-opacity-50 text-white px-3 py-2 rounded-pill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Matching CE Courses */}
                  <div className="mb-4">
                    <h6 className="text-uppercase text-secondary small fw-bold mb-2">
                      <i className="bi bi-mortarboard text-info me-1"></i> รายวิชาวิศวกรรมคอมพิวเตอร์ KMITL ที่เกี่ยวข้อง
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {topRole.matching_ce_courses?.map((course, idx) => (
                        <span key={idx} className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-2 rounded-pill">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Career Progression */}
                  <div className="p-3 rounded bg-black bg-opacity-40 border border-secondary border-opacity-25">
                    <h6 className="text-warning small fw-bold mb-1">
                      <i className="bi bi-diagram-3 me-1"></i> เส้นทางการเติบโตในสายงาน (Career Progression)
                    </h6>
                    <div className="text-light small">{topRole.career_prospects}</div>
                  </div>
                </div>

                <div className="col-lg-4 text-center">
                  <div className="p-4 rounded-4 bg-black bg-opacity-60 border border-warning border-opacity-30">
                    <h6 className="text-secondary text-uppercase small mb-2">คะแนนความเหมาะสม</h6>
                    <div className="display-4 fw-bold text-warning mb-2">{topRole.match_percentage}%</div>
                    <div className="progress bg-secondary bg-opacity-25 mb-3" style={{ height: "10px" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${topRole.match_percentage}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between text-secondary small mb-3">
                      <span>คะแนนที่ได้: {topRole.score}</span>
                      <span>คะแนนเต็ม: {topRole.max_score}</span>
                    </div>
                    <div className="badge bg-secondary bg-opacity-50 text-white w-100 py-2">
                      หมวดหมู่: {topRole.category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2nd and 3rd Role Matches Grid */}
        <h3 className="fw-bold mb-4 text-light">
          <i className="bi bi-award me-2 text-primary"></i>อาชีพแนะนำลำดับถัดไป (Rank #2 & #3)
        </h3>
        <div className="row g-4 mb-5">
          {[secondRole, thirdRole].filter(Boolean).map((role, idx) => {
            const isSecond = idx === 0;
            const rankLabel = isSecond ? "🥈 อันดับที่ 2" : "🥉 อันดับที่ 3";
            const borderCls = isSecond ? "border-primary" : "border-info";
            const badgeCls = isSecond ? "bg-primary" : "bg-info text-dark";

            return (
              <div key={role.role_id} className="col-md-6">
                <div className={`card h-100 bg-dark text-white border ${borderCls} shadow-sm overflow-hidden`}>
                  <div className="card-header bg-black bg-opacity-50 d-flex justify-content-between align-items-center py-3">
                    <span className="fw-bold fs-6">{rankLabel}</span>
                    <span className={`badge ${badgeCls} px-3 py-1 rounded-pill`}>
                      ความสอดคล้อง {role.match_percentage}%
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="p-3 rounded-circle bg-secondary bg-opacity-25 text-white fs-3">
                        <i className={`bi ${role.icon || "bi-briefcase"}`}></i>
                      </div>
                      <div>
                        <h4 className="fw-bold text-white mb-0">{role.title}</h4>
                        <div className="text-secondary small">{role.title_th}</div>
                      </div>
                    </div>

                    <p className="text-light small mb-3">{role.summary}</p>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between text-secondary small mb-1">
                        <span>คะแนนสะสม: {role.score} / {role.max_score}</span>
                        <span>{role.match_percentage}%</span>
                      </div>
                      <div className="progress bg-secondary bg-opacity-25" style={{ height: "6px" }}>
                        <div
                          className={`progress-bar ${isSecond ? "bg-primary" : "bg-info"}`}
                          style={{ width: `${role.match_percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="text-secondary small fw-bold mb-1">ทักษะสำคัญ:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {role.key_skills?.slice(0, 4).map((s, i) => (
                          <span key={i} className="badge bg-secondary bg-opacity-50 text-white small">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
                      <h6 className="text-info small fw-bold mb-1">
                        <i className="bi bi-mortarboard me-1"></i>วิชาที่แนะนำ:
                      </h6>
                      <div className="text-secondary small">
                        {role.matching_ce_courses?.join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All 20 Roles Breakdown Accordion */}
        <div className="card bg-dark text-white border-secondary mb-5">
          <div
            className="card-header bg-black bg-opacity-50 p-3 d-flex justify-content-between align-items-center cursor-pointer"
            onClick={() => setShowAllRoles(!showAllRoles)}
            style={{ cursor: "pointer" }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-list-columns-reverse text-warning fs-5"></i>
              <span className="fw-bold">ดูคะแนนความสอดคล้องทั้ง 20 สาขาอาชีพไอที</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary text-white">
              {showAllRoles ? "ซ่อนรายละเอียด" : "แสดงทั้งหมด (20 อาชีพ)"}{" "}
              <i className={`bi ${showAllRoles ? "bi-chevron-up" : "bi-chevron-down"} ms-1`}></i>
            </button>
          </div>

          {showAllRoles && (
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr className="text-secondary border-secondary">
                      <th className="ps-4">อันดับ</th>
                      <th>ชื่ออาชีพ (Role)</th>
                      <th>หมวดหมู่</th>
                      <th>คะแนน</th>
                      <th>ความสอดคล้อง</th>
                      <th className="pe-4">รายวิชาที่ตรงกัน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.all_roles?.map((r) => (
                      <tr key={r.role_id} className="border-secondary">
                        <td className="ps-4">
                          <span
                            className={`badge ${
                              r.rank === 1
                                ? "bg-warning text-dark"
                                : r.rank === 2
                                ? "bg-primary"
                                : r.rank === 3
                                ? "bg-info text-dark"
                                : "bg-secondary"
                            } rounded-pill px-2`}
                          >
                            #{r.rank}
                          </span>
                        </td>
                        <td>
                          <div className="fw-semibold text-white">{r.title}</div>
                          <div className="text-secondary small">{r.title_th}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary bg-opacity-50 text-light small">{r.category}</span>
                        </td>
                        <td>
                          <span className="text-light fw-bold">{r.score}</span>
                          <span className="text-secondary small"> / {r.max_score}</span>
                        </td>
                        <td style={{ minWidth: "150px" }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1 bg-secondary bg-opacity-25" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: `${r.match_percentage}%` }}
                              ></div>
                            </div>
                            <span className="small text-secondary">{r.match_percentage}%</span>
                          </div>
                        </td>
                        <td className="pe-4 text-secondary small">
                          {r.matching_ce_courses?.slice(0, 2).join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 p-md-5 rounded-4 bg-gradient bg-black border border-secondary border-opacity-30 text-center">
          <h3 className="fw-bold mb-2">พร้อมต่อยอดสู่อาชีพในฝันที่ภาควิชาวิศวกรรมคอมพิวเตอร์?</h3>
          <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            ศึกษาหลักสูตรรายวิชา โครงงานรุ่นพี่ และโอกาสฝึกงานกับบริษัทชั้นนำได้ที่เว็บไซต์ CE50
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/projects" className="btn btn-outline-warning rounded-pill px-4">
              <i className="bi bi-folder-check me-2"></i>ดูโครงงานที่เกี่ยวข้อง
            </Link>
            <Link href="/company" className="btn btn-outline-info rounded-pill px-4">
              <i className="bi bi-building me-2"></i>ดูสถานที่ฝึกงาน
            </Link>
            <Link href="/class" className="btn btn-outline-light rounded-pill px-4">
              <i className="bi bi-book me-2"></i>ดูตารางเรียน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: QUIZ IN PROGRESS
  // ==========================================
  return (
    <div className="template-container py-4 text-white">
      {/* Quiz Hero Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold">
              <i className="bi bi-compass me-1"></i> BCS Tech Career Quiz
            </span>
            <span className="text-secondary small">• 30 คำถามมาตรฐานสากล</span>
          </div>
          <h2 className="fw-bold text-white mb-0">ค้นหาอาชีพสายเทคโนโลยีที่ใช่สำหรับคุณ</h2>
        </div>

        {/* Quick Autofill button for testing */}
        <div className="d-flex gap-2">
          <button
            onClick={handleQuickAutofill}
            className="btn btn-sm btn-outline-warning rounded-pill px-3"
            title="สุ่มตอบทุกข้ออัตโนมัติเพื่อทดสอบระบบการให้คะแนนอย่างรวดเร็ว"
          >
            <i className="bi bi-lightning-charge me-1"></i>ทดสอบสุ่มคำตอบอัตโนมัติ (Demo Fill)
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
          <button onClick={() => setError(null)} className="btn-close" aria-label="Close"></button>
        </div>
      )}

      {/* Progress Card */}
      <div className="card bg-dark text-white border-secondary mb-4 p-3 shadow-sm">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
              ข้อ {currentIndex + 1} จาก {questions.length}
            </span>
            <span className="text-secondary small">
              (ตอบแล้ว {answeredCount} จาก {questions.length} ข้อ)
            </span>
          </div>
          <div className="text-warning small fw-bold">
            ความคืบหน้า {progressPercentage}%
          </div>
        </div>

        <div className="progress bg-black" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Question Quick Jump Pills */}
        <div className="d-flex flex-wrap gap-1 mt-3">
          {questions.map((q, idx) => {
            const isAnswered =
              answers[q.id.toString()] !== undefined &&
              answers[q.id.toString()] !== null &&
              (Array.isArray(answers[q.id.toString()])
                ? (answers[q.id.toString()] as number[]).length > 0
                : true);
            const isCurrent = idx === currentIndex;

            let pillClass = "btn-outline-secondary text-secondary";
            if (isCurrent) {
              pillClass = "btn-warning text-dark fw-bold ring-2";
            } else if (isAnswered) {
              pillClass = "btn-success text-white";
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`btn btn-sm py-0 px-2 rounded ${pillClass}`}
                style={{ fontSize: "11px", minWidth: "28px" }}
                title={`ข้อ ${q.id}: ${q.question}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Question Card */}
      {currentQ && (
        <div className="card bg-dark text-white border-secondary shadow-lg mb-4">
          <div className="card-header bg-black bg-opacity-40 py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <span className="badge bg-info text-dark rounded-pill px-3 py-1 me-2 fw-semibold">
                {currentQ.section}
              </span>
              <span className="text-secondary small">{currentQ.section_th}</span>
            </div>
            {currentQ.is_multiple && (
              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill">
                <i className="bi bi-check2-square me-1"></i>เลือกได้หลายข้อ
              </span>
            )}
          </div>

          <div className="card-body p-4 p-md-5">
            <h4 className="fw-bold text-white mb-2">
              Q{currentQ.id}. {currentQ.question}
            </h4>
            {currentQ.section_desc && (
              <p className="text-secondary small mb-4">{currentQ.section_desc}</p>
            )}

            {/* Options List */}
            <div className="row g-3 mt-1">
              {currentQ.options.map((opt) => {
                const isSelected = currentQ.is_multiple
                  ? ((answers[currentQ.id.toString()] as number[]) || []).includes(opt.id)
                  : answers[currentQ.id.toString()] === opt.id;

                return (
                  <div key={opt.id} className={currentQ.is_multiple ? "col-md-6" : "col-12"}>
                    <div
                      onClick={() => {
                        if (currentQ.is_multiple) {
                          handleToggleMultipleOption(opt.id);
                        } else {
                          handleSelectOption(opt.id);
                        }
                      }}
                      className={`p-3 p-md-4 rounded-3 border d-flex align-items-center justify-content-between transition-all ${
                        isSelected
                          ? "bg-warning bg-opacity-15 border-warning text-white shadow"
                          : "bg-black bg-opacity-40 border-secondary border-opacity-40 text-light hover:border-secondary"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            isSelected ? "bg-warning text-dark" : "border border-secondary text-secondary"
                          }`}
                          style={{ width: "28px", height: "28px", flexShrink: 0 }}
                        >
                          {isSelected ? (
                            <i className="bi bi-check-lg fw-bold"></i>
                          ) : (
                            <span className="small">{opt.id + 1}</span>
                          )}
                        </div>
                        <span className="fw-semibold fs-6">{opt.text}</span>
                      </div>
                      {isSelected && (
                        <i className="bi bi-check-circle-fill text-warning fs-5"></i>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Footer Navigation */}
          <div className="card-footer bg-black bg-opacity-40 py-3 px-4 d-flex justify-content-between align-items-center">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="btn btn-outline-secondary text-white rounded-pill px-4"
            >
              <i className="bi bi-chevron-left me-1"></i> ย้อนกลับ
            </button>

            <div className="d-flex gap-2">
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-primary rounded-pill px-4"
                >
                  ถัดไป <i className="bi bi-chevron-right ms-1"></i>
                </button>
              ) : (
                <button
                  onClick={handleSubmitEvaluation}
                  disabled={evaluating}
                  className="btn btn-success rounded-pill px-4 fw-bold"
                >
                  {evaluating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      กำลังประมวลผล...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      ส่งคำตอบและดูผลลัพธ์
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Submit Bar when user has answered all questions */}
      {answeredCount >= 20 && !result && (
        <div className="p-3 rounded-4 bg-gradient bg-dark border border-warning border-opacity-50 shadow d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-all text-warning fs-4"></i>
            <div>
              <div className="fw-bold text-white">ตอบคำถามแล้ว {answeredCount} / {questions.length} ข้อ</div>
              <div className="text-secondary small">คุณสามารถกดส่งคำตอบได้ทันทีเพื่อดู 3 เส้นทางอาชีพที่เหมาะสมที่สุด</div>
            </div>
          </div>
          <button
            onClick={handleSubmitEvaluation}
            disabled={evaluating}
            className="btn btn-warning text-dark fw-bold rounded-pill px-4"
          >
            {evaluating ? "กำลังประมวลผล..." : "ประเมินผลอาชีพของคุณเลย"}
          </button>
        </div>
      )}
    </div>
  );
}
