"use client";

import { useEffect, useState } from "react";
import { Teachers } from "@/types/teacher";
import Image from "next/image";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function getTeachers() {
      const response = await fetch("http://localhost:8000/teachers");
      setTeachers(await response.json());
    }

    getTeachers();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? teachers.filter(
        (t) =>
          t.teacher_firstname?.toLowerCase().includes(q) ||
          t.teacher_lastname?.toLowerCase().includes(q) ||
          t.teacher_name_en?.toLowerCase().includes(q)
      )
    : teachers;

  return (
    <div className="template-container">
      {/*
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
      */}
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">คณาจารย์</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="mb-4">
        <input
          type="search"
          placeholder="ค้นหาอาจารย์ (ชื่อไทย / อังกฤษ)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {filtered.map((teacher) => (
          <div className="col" key={teacher.teacher_id}>
            <div className="card text-bg-dark justify-content-center align-items-center hover:opacity-75 duration-150">
              <Image
                src={`http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
                alt={teacher.teacher_firstname}
                width={1000}
                height={1000}
                draggable="false"
              />
              <div className="card-body text-center">
                <h5 className="card-title">
                  {teacher.teacher_firstname} {teacher.teacher_lastname}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

{
  /*
  "use client";

  import { useState } from "react";
  import OtherComponent from "./OtherComponent";

  export default function Page() {
    const [show, setShow] = useState(false);

    return (
      <>
        <button onClick={() => setShow(true)}>Show component</button>
        {show && <OtherComponent />}
      </>
    );
  }
*/
}
