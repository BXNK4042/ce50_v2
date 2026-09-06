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
                  src={`http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
                  alt={teacher.teacher_firstname}
                  width={500}
                  height={200}
                  draggable="false"
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
