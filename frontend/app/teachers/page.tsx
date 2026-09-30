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
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4">
        {teachers.map((teacher) => (
          <div className="col" key={teacher.teacher_id}>
            <div className="card text-bg-dark h-100 justify-content-between align-items-center hover:opacity-75 duration-150 overflow-hidden">
              <Image
                src={`http://localhost:8000/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
                alt={teacher.teacher_firstname}
                width={1000}
                height={1000}
                draggable="false"
                className="img-fluid w-100 h-auto object-cover"
              />
              <div className="card-body text-center w-100">
                <h5 className="card-title mb-0">
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
