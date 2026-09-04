"use client";

import { useEffect, useState } from "react";
import { Teachers } from "@/types/teacher";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);

  useEffect(() => {
    async function getTeachers() {
      const response = await fetch("http://localhost:8000/teachers");
      setTeachers(await response.json());
    }

    getTeachers();
  }, []);

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Firstname</th><th>Lastname</th></tr></thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td>{teacher.teacher_id}</td><td>{teacher.teacher_firstname}</td><td>{teacher.teacher_lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
