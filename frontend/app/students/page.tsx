"use client";

import { useState, useEffect } from "react";
import { Students } from "@/types/student";
import Image from "next/image";

export default function Home() {
  const [students, setStudents] = useState<Students[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getStudent() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/students");
        if (!response.ok) throw new Error("Failed to fetch students");
        const result = await response.json();
        setStudents(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching students");
      } finally {
        setLoading(false);
      }
    }

    getStudent();
  }, []);

  return (
    <div className="template-container">
      <div className="bg-gradient">
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

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="row rows-cols-1 row-cols-md-6 g-4">
          {students.map((student) => {
            const modalId = `student-${student.student_id}-modal`;

            return (
              <div className="col" key={student.student_id}>
                <div className="card bg-black ">
                  <Image
                    src={`/uploads/students/ce_04/${student.student_id}.png`}
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
      )}
    </div>
  );
}
