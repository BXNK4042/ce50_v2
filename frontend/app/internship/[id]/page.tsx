"use client";
import { useState, useEffect } from "react";
import { Internships } from "@/types/internship";
import { Students } from "@/types/student";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InternshipPage() {
  const { id } = useParams();
  const [internships, setInternships] = useState<Internships[]>([]);
  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
    async function getInternship() {
      const response = await fetch("http://localhost:8000/internship");
      setInternships(await response.json());
    }

    getInternship();
  }, []);

  useEffect(() => {
    async function getStudent() {
      const response = await fetch("http://localhost:8000/students");
      setStudents(await response.json());
    }

    getStudent();
  }, []);

  const internFiltered = internships.filter(
    (internship) => internship.company_id === Number(id),
  );

  const studentIds = internFiltered.map((item) => item.student_id);

  const studentFiltered = students.filter((student) =>
    studentIds.includes(student.student_id),
  );

  return (
    <div className="template-container">
      <Link href="/company">
        <div className="flex text-decoration-none">
          <ArrowLeft />
          <p className="text-decoration-none">Back to Company</p>
        </div>
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Image</th>
            <th>Role</th>
            <th>Lineage</th>
            <th>Contact</th>
            <th>Instagram</th>
          </tr>
        </thead>
        <tbody>
          {studentFiltered.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td>
              <td>{student.student_firstname}</td>
              <td>{student.student_lastname}</td>
              <td>{student.student_image}</td>
              <td>{student.student_role}</td>
              <td>{student.student_lineage}</td>
              <td>{student.student_contact}</td>
              <td>{student.student_instagram}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
