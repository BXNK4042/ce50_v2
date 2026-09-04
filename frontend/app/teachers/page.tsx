"use client";

import { useEffect, useState } from "react";
import { Teachers } from "@/types/teacher";
import Image from "next/image";

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
        <thead><tr><th>ID</th><th>Firstname</th><th>Lastname</th><th>Image</th><th>Contact</th><th>Name_En</th></tr></thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td>{teacher.teacher_id}</td><td>{teacher.teacher_firstname}</td><td>{teacher.teacher_lastname}</td><td>{teacher.teacher_image}</td><td>{teacher.teacher_contact}</td><td>{teacher.teacher_name_en}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row rows-cols-1 row-cols-md-4 g-4">
          {teachers.map((teacher) => (
            <div className="col" key={teacher.teacher_id}>
              <div className="card justify-content-center align-items-center">
                <Image
                  src={`http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}.webp`}
                  alt={teacher.teacher_firstname}
                  width={300}
                  height={300}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{teacher.teacher_firstname} {teacher.teacher_lastname}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>

  );
}

{/*
  Bootstrap Card
  <div class="row row-cols-1 row-cols-md-3 g-4">
    <div class="col">
      <div class="card">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        </div>
      </div>
    </div>
  </div>
*/}
