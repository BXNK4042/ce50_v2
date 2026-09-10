"use client";
import { useState, useEffect } from "react";
import { Internships } from "@/types/internship";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function InternshipPage() {
  const { id } = useParams();
  const [internships, setInternships] = useState<Internships[]>([]);

  useEffect(() => {
    async function getInternship() {
      const response = await fetch("http://localhost:8000/internship");
      setInternships(await response.json());
    }

    getInternship();
  }, []);

  const filtered = internships.filter(
    (internship) => internship.company_id === Number(id),
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
            <th>Student_ID</th>
            <th>Title</th>
            <th>Company_ID</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((internship) => (
            <tr key={internship.internship_id}>
              <td>{internship.internship_id}</td>
              <td>{internship.student_id}</td>
              <td>{internship.internship_title}</td>
              <td>{internship.company_id}</td>
              <td>{internship.internship_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
