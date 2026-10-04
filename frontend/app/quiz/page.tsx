"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  RotateCcw,
  Printer,
  Zap,
  GraduationCap,
  GitBranch,
  FolderCheck,
  Building,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

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
  category_th?: string;
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
        const res = await fetch("/api/quiz/questions");
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
      const res = await fetch("/api/quiz/evaluate", {
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
  // VIEW: RESULT SCREEN (Style 3 Focused Hero)
  // ==========================================
  if (result && result.top_roles && result.top_roles.length > 0) {
    const topRole = result.top_roles[0];
    const secondRole = result.top_roles[1];
    const thirdRole = result.top_roles[2];

    return (
      <div className="template-container py-5 text-white">
        <div className="mx-auto" style={{ maxWidth: "880px" }}>
          {/* Top Hero Card */}
          <div className="card bg-dark border-primary p-4 p-md-5 rounded-4 shadow-lg text-center mb-5 border-2">
            <div className="p-3 rounded-circle bg-primary bg-opacity-25 text-primary d-inline-flex mx-auto mb-3">
              <Award size={44} />
            </div>
            <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold mb-2">
              อาชีพที่เหมาะสมที่สุดสำหรับคุณ (Rank #1)
            </span>
            <h1 className="fw-bold text-white mb-1 mt-2">{topRole.title_th}</h1>
            <h5 className="text-secondary fw-normal mb-3">{topRole.title} ({topRole.category_th || topRole.category})</h5>

            <div className="display-4 fw-bold text-primary mb-2">{topRole.match_percentage}% Match</div>
            <p className="lead text-light mb-4 mx-auto" style={{ maxWidth: "700px" }}>
              {topRole.summary}
            </p>

            <div className="row g-4 text-start mt-2 pt-4 border-top border-secondary border-opacity-30">
              <div className="col-md-6">
                <h6 className="text-uppercase text-secondary small fw-bold mb-2 d-flex align-items-center gap-1">
                  <Zap size={16} className="text-warning" /> ทักษะสำคัญประจำตำแหน่ง
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {topRole.key_skills?.map((skill, idx) => (
                    <span key={idx} className="badge bg-secondary bg-opacity-50 text-white px-3 py-2 rounded-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="text-uppercase text-secondary small fw-bold mb-2 d-flex align-items-center gap-1">
                  <GraduationCap size={16} className="text-info" /> รายวิชาที่เกี่ยวข้องในหลักสูตร CE
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {topRole.matching_ce_courses?.map((course, idx) => (
                    <span key={idx} className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 px-3 py-2 rounded-pill">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-3">
                <div className="p-3 rounded-3 bg-black bg-opacity-50 border border-secondary border-opacity-25">
                  <h6 className="text-warning small fw-bold mb-1 d-flex align-items-center gap-1">
                    <GitBranch size={16} /> เส้นทางการเติบโตในสายงาน (Career Progression)
                  </h6>
                  <p className="text-secondary small mb-0">{topRole.career_prospects}</p>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4 pt-3">
              <button onClick={handleRetake} className="btn btn-outline-light px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2">
                <RotateCcw size={16} /> ทำแบบประเมินใหม่
              </button>
              <button onClick={() => window.print()} className="btn btn-primary px-4 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2">
                <Printer size={16} /> พิมพ์รายงานผล
              </button>
            </div>
          </div>

          {/* Rank #2 and #3 Matches */}
          <h4 className="fw-bold mb-3 text-light text-center">อาชีพแนะนำลำดับถัดไป</h4>
          <div className="row g-3 mb-5">
            {[secondRole, thirdRole].filter(Boolean).map((role, idx) => (
              <div key={role.role_id} className="col-md-6">
                <div className="card h-100 bg-dark text-white border-secondary p-4 rounded-4 shadow-sm text-center">
                  <span className="badge bg-secondary mb-2 align-self-center px-3 py-1">
                    {idx === 0 ? "อันดับที่ 2" : "อันดับที่ 3"}
                  </span>
                  <h5 className="fw-bold text-white mb-1">{role.title_th}</h5>
                  <p className="text-secondary small mb-2">{role.title} ({role.category_th || role.category})</p>
                  <div className="text-primary fw-bold fs-5 mt-auto">{role.match_percentage}% Match</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="p-4 rounded-4 bg-dark border border-secondary text-center mb-5">
            <h5 className="fw-bold mb-3">ศึกษาข้อมูลเพิ่มเติมเกี่ยวกับภาควิชา CE</h5>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link href="/projects" className="btn btn-outline-light rounded-pill px-4 d-inline-flex align-items-center gap-2">
                <FolderCheck size={16} /> ดูโครงงานที่เกี่ยวข้อง
              </Link>
              <Link href="/company" className="btn btn-outline-light rounded-pill px-4 d-inline-flex align-items-center gap-2">
                <Building size={16} /> ดูสถานที่ฝึกงาน
              </Link>
              <Link href="/class" className="btn btn-outline-light rounded-pill px-4 d-inline-flex align-items-center gap-2">
                <BookOpen size={16} /> ดูตารางเรียน
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: QUIZ QUESTION (Style 3 Interactive Card Deck)
  // ==========================================
  return (
    <div className="template-container py-5 text-white">
      <div className="mx-auto" style={{ maxWidth: "820px" }}>
        {/* Top Header Progress */}
        <div className="text-center mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 px-1">
            <span className="badge bg-secondary text-white px-3 py-1 rounded-pill small">
              {currentQ ? currentQ.section_th : "แบบประเมินสายอาชีพ"}
            </span>
            <span className="text-secondary small fw-bold">
              คำถามที่ {currentIndex + 1} จาก {questions.length} ข้อ
            </span>
          </div>

          <div className="progress bg-dark border border-secondary mx-auto" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <AlertTriangle size={16} className="me-2" />
              {error}
            </div>
            <button onClick={() => setError(null)} className="btn-close" aria-label="Close"></button>
          </div>
        )}

        {/* Current Question Card Deck */}
        {currentQ && (
          <div className="card bg-dark border-secondary p-4 p-md-5 rounded-4 shadow-lg mb-4 text-center">
            <div className="mb-2">
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 px-3 py-1 rounded-pill small">
                {currentQ.section}
              </span>
              {currentQ.is_multiple && (
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill small ms-2">
                  เลือกได้หลายข้อ
                </span>
              )}
            </div>

            <h3 className="fw-bold text-white mb-4 lh-base mt-2">
              Q{currentQ.id}. {currentQ.question}
            </h3>

            {currentQ.section_desc && (
              <p className="text-secondary small mb-4">{currentQ.section_desc}</p>
            )}

            {/* Big Interactive Option Tiles */}
            <div className="row g-3">
              {currentQ.options.map((opt) => {
                const isSelected = currentQ.is_multiple
                  ? ((answers[currentQ.id.toString()] as number[]) || []).includes(opt.id)
                  : answers[currentQ.id.toString()] === opt.id;

                const letterLabel = String.fromCharCode(65 + opt.id);

                return (
                  <div className="col-12" key={opt.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (currentQ.is_multiple) {
                          handleToggleMultipleOption(opt.id);
                        } else {
                          handleSelectOption(opt.id);
                        }
                      }}
                      className={`btn w-100 py-3 px-4 text-start rounded-3 d-flex align-items-center justify-content-between ${
                        isSelected
                          ? "btn-primary shadow-lg fw-bold"
                          : "btn-outline-secondary text-light bg-black"
                      }`}
                      style={{ transition: "all 0.15s ease" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`badge rounded-circle p-2 d-flex align-items-center justify-content-center ${
                            isSelected ? "bg-white text-primary" : "bg-dark text-secondary border border-secondary"
                          }`}
                          style={{ width: "30px", height: "30px" }}
                        >
                          {letterLabel}
                        </span>
                        <span className="fs-6 text-wrap">{opt.text}</span>
                      </div>
                      {isSelected && <Check size={20} className="flex-shrink-0 ms-2" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn btn-outline-light px-4 py-2 rounded-pill d-inline-flex align-items-center gap-1"
          >
            <ChevronLeft size={16} /> ย้อนกลับ
          </button>

          <div className="d-flex gap-2">
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="btn btn-primary px-5 py-2 fw-bold rounded-pill d-inline-flex align-items-center gap-1"
              >
                ข้อถัดไป <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={evaluating}
                className="btn btn-success px-5 py-2 fw-bold rounded-pill d-inline-flex align-items-center gap-2"
              >
                {evaluating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    กำลังประมวลผล...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    ส่งคำตอบและดูผลลัพธ์
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Floating Fast Submit Bar (when >= 20 questions answered) */}
        {answeredCount >= 20 && !result && (
          <div className="p-3 rounded-4 bg-black border border-secondary mt-5 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 shadow">
            <div className="d-flex align-items-center gap-2">
              <CheckCheck size={22} className="text-primary" />
              <div>
                <div className="fw-semibold text-white small">ตอบแล้ว {answeredCount} จาก {questions.length} ข้อ</div>
                <div className="text-secondary small">สามารถกดส่งคำตอบได้ทันทีเพื่อดู 3 เส้นทางอาชีพที่เหมาะสมที่สุด</div>
              </div>
            </div>
            <button
              onClick={handleSubmitEvaluation}
              disabled={evaluating}
              className="btn btn-primary btn-sm px-4 fw-semibold rounded-pill"
            >
              {evaluating ? "กำลังประมวลผล..." : "ประเมินผลเลย"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
