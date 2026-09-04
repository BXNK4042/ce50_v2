"use client";

import { useState, useEffect } from "react";
import { Students } from "@/types/student";

export default function Home() {

  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
    async function getStudent() {
      const response = await fetch("http://localhost:8000/students")
      const result = await response.json()
      setStudents(result)
    }

    getStudent();
  }, []); //dependency array shit

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Firstname</th><th>Lastname</th><th>Image</th><th>Role</th><th>Lineage</th><th>Contact</th><th>Instagram</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td><td>{student.student_firstname}</td><td>{student.student_lastname}</td><td>{student.student_image}</td><td>{student.student_role}</td><td>{student.student_lineage}</td><td>{student.student_contact}</td><td>{student.student_instagram}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
