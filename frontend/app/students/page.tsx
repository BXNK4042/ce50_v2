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
            {students.map((student) => (
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
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">นักศึกษา</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="row rows-cols-1 row-cols-md-6 g-4">
        {students.map((student) => {
          const modalId = `student-${student.student_id}-modal`;

          return (
            <div className="col" key={student.student_id}>
              <div className="card bg-black ">
                <Image
                  src={`http://localhost:8000/uploads/students/ce_04/${student.student_id}.png`}
                  alt={student.student_firstname}
                  width={500}
                  height={500}
                  draggable="false"
                  className="card-img-top hover:opacity-70 duration-150"
                  data-bs-toggle="modal"
                  data-bs-target={`#${modalId}`}
                />
              </div>
              <div
                className="modal fade"
                id={modalId}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <p className="modal-title fs-5" id="exampleModalLabel">
                        {student.student_id}
                      </p>
                    </div>
                    <div className="modal-body">
                      <p>
                        {student.student_firstname} {student.student_lastname}
                        <br />
                        สายรหัส: T{student.student_lineage}
                        <br />
                        <i className="bi bi-telephone">
                          : {student.student_contact}
                        </i>
                        <br />
                        <a
                          className="bi bi-instagram link-offset-2 link-underline link-underline-opacity-0"
                          href={`https://instagram.com/${student.student_instagram}`}
                          target="_blank"
                        >
                          : {student.student_instagram}
                        </a>
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
