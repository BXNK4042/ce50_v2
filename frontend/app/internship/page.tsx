"use client";

import { useEffect, useState } from "react";
import { Internships } from "@/types/internship";

export default function InternshipPage() {
  const [internships, setInternships] = useState<Internships[]>([]);

  useEffect(() => {
    async function getInternships() {
      const response = await fetch("http://localhost:8000/internship");
      setInternships(await response.json());
    }

    getInternships();
  }, []);

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {internships.map((internship) => (
            <tr key={internship.internship_id}>
              <td>{internship.internship_id}</td>
              <td>{internship.internship_title}</td>
              <td>{internship.internship_company}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
