"use client";

import { useState, useEffect } from "react";
import { Students } from "@/types/student";
import Image from "next/image";

export default function Home() {
  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
    async function getStudent() {
      const response = await fetch("http://localhost:8000/students");
      const result = await response.json();
      setStudents(result);
    }

    getStudent();
  }, []); //dependency array shit

  return (
    <div className="bg-black p-5 py-5">
      {/*
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
      */}
      <div className="bg-black bg-gradient">
        <Image
          src="/ce_04_cropped.webp"
          alt="ce_04"
          width={2000}
          height={2000}
          className="opacity-25"
          draggable="false"
        />
      </div>
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตร์</h1>
        <h1 className="text-primary">นักศึกษา</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="row rows-cols-1 row-cols-md-6 g-4">
        {students.map((student) => (
          <div className="col" key={student.student_id}>
            <div className="card bg-black ">
              <Image
                src={`http://localhost:8000/uploads/students/ce_04/${student.student_id}.png`}
                alt={student.student_firstname}
                width={500}
                height={500}
                draggable="false"
                className="card-img-top hover:opacity-70"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
