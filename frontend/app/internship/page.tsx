"use client";
import { useState, useEffect } from "react";
import { Internships } from "@/types/internship";

export default function InternshipPage() {
  const [internships, setInternships] = useState<Internships[]>([]);

  useEffect(() => {
    async function getInternship() {
      const response = await fetch("http://localhost:8000/internship");
      setInternships(await response.json());
    }

    getInternship();
  }, []);

  return (
    <div>
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
          {internships.map((internship) => (
            <tr key={internship.internship_id}>
              <td>{internship.internship_id}</td>
              <td>{internship.student_id}</td>
              <td>{internship.company_id}</td>
              <td>{internship.internship_title}</td>
              <td>{internship.internship_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*
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
        </table>*/}
    </div>
  );
}
