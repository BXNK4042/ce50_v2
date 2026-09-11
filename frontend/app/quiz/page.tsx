"use client";

import { useState } from "react";
import quizData from "@/data/career_quiz.json";
import Link from "next/link";

export default function CareerQuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const questions = quizData.questions;
  const roles: Record<string, string> = quizData.roles;

  const currentQ = questions[currentIdx];

  const handleSelect = (roleIds: number[]) => {
    const nextScores = { ...scores };
    roleIds.forEach((id) => {
      const key = String(id);
      nextScores[key] = (nextScores[key] || 0) + 1;
    });
    setScores(nextScores);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScores({});
    setFinished(false);
  };

  // Calculate top roles
  const sortedRoles = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topRole = sortedRoles.length > 0 ? sortedRoles[0] : null;
  const topRoleName = topRole ? roles[topRole[0]] || "Tech Generalist" : "Tech Explorer";

  return (
    <div className="container py-5 text-light" style={{ maxWidth: "700px" }}>
      <div className="text-center mb-4">
        <h1 className="text-primary font-weight-bold">BCS Tech Career Quiz</h1>
        <p className="text-secondary">ค้นหาเส้นทางอาชีพสายเทคโนโลยีที่เหมาะกับคุณ</p>
      </div>

      {!finished ? (
        <div className="card bg-dark border-secondary p-4 shadow">
          <div className="d-flex justify-content-between align-items-center mb-3 text-secondary">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
          </div>

          <div className="progress mb-4" style={{ height: "6px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{
                width: `${((currentIdx + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>

          <h4 className="mb-4 text-white">{currentQ.question}</h4>

          <div className="d-grid gap-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                className="btn btn-outline-light text-start p-3 hover-shadow"
                onClick={() => handleSelect(opt.roleIds)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card bg-dark border-primary p-5 text-center shadow">
          <h2 className="text-white mb-2">ผลลัพธ์ของคุณคือ</h2>
          <h1 className="text-primary display-5 font-weight-bold my-4">
            {topRoleName}
          </h1>
          <p className="text-secondary mb-4">
            คะแนนสายอาชีพตรงกับทักษะ บุคลิกภาพ และความสนใจของคุณมากที่สุด
          </p>

          <h5 className="text-white mb-3">Top Matching Roles:</h5>
          <ul className="list-group list-group-flush bg-transparent mb-4">
            {sortedRoles.slice(0, 5).map(([id, score]) => (
              <li
                key={id}
                className="list-group-item bg-transparent text-light d-flex justify-content-between border-secondary"
              >
                <span>{roles[id] || id}</span>
                <span className="badge bg-primary rounded-pill">{score} pts</span>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary" onClick={handleRestart}>
              ทำแบบทดสอบใหม่อีกครั้ง
            </button>
            <Link href="/" className="btn btn-outline-secondary">
              กลับหน้าแรก
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
