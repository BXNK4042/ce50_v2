"use client";

import { useEffect, useState } from "react";
import { ExamSchedules } from "@/types/exam-schedule";

export default function ExamPage() {
  const [exams, setExams] = useState<ExamSchedules[]>([]);

  useEffect(() => {
    async function getExams() {
      const response = await fetch("http://localhost:8000/exam");
      setExams(await response.json());
    }

    getExams();
  }, []);

  return (
    <div className="template-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Final</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.exam_id}>
              <td>{exam.exam_id}</td>
              <td>{exam.exam_name}</td>
              <td>{exam.exam_final}</td>
              <td>{exam.exam_start}</td>
              <td>{exam.exam_end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
