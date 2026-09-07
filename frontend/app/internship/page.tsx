"use client";

import { useEffect, useState } from "react";
import { Internships } from "@/types/internship";
import Image from "next/image";

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
    <div className="template-container">
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
        </table>
      */}
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">การฝึกงาน</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="row rows-cols-1 row-cols-md-6 g-4">
        {internships.map((internship) => {
          return (
            <div className="col" key={internship.internship_id}>
              <div className="card bg-black ">
                <Image
                  src={`http://localhost:8000/uploads/internships/${internship.internship_company_image}`}
                  alt={internship.internship_company}
                  width={1000}
                  height={1000}
                  draggable="false"
                  className="card-img-top hover:opacity-70 duration-150"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
