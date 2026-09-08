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
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ตารางสอบ</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="table-responsive">
        <table className="table table-light table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.exam_id}</td>
                <td>{exam.exam_code}</td>
                <td>{exam.exam_name}</td>
                <td>{exam.exam_final ? "Final" : "Midterm"}</td>
                <td>{exam.exam_date}</td>
                <td>{exam.exam_start}</td>
                <td>{exam.exam_end}</td>
                <td>{exam.exam_room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
