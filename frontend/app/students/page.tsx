"use client";

import { useState, useEffect, useMemo } from "react";
import { Students } from "@/types/student";
import { getStudentGeneration } from "@/utils/generation";
import Image from "next/image";

export default function Home() {
  const [students, setStudents] = useState<Students[]>([]);
  const [selectedGen, setSelectedGen] = useState<string>("All");
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

  // Compute available generations auto-derived from student IDs
  const availableGens = useMemo(() => {
    const genSet = new Set<string>();
    students.forEach((s) => {
      genSet.add(getStudentGeneration(s.student_id));
    });
    const sorted = Array.from(genSet).sort().reverse();
    return ["All", ...sorted];
  }, [students]);

  // Filter students based on selected generation
  const filteredStudents = useMemo(() => {
    if (selectedGen === "All") return students;
    return students.filter(
      (s) => getStudentGeneration(s.student_id) === selectedGen,
    );
  }, [students, selectedGen]);

  const getStudentImage = (student: Students) => {
    if (student.student_image) {
      return student.student_image.startsWith("/")
        ? student.student_image
        : `/uploads/students/${student.student_image}`;
    }
    const gen = getStudentGeneration(student.student_id).toLowerCase().replace("ce", "ce_");
    return `/uploads/students/${gen}/${student.student_id}.png`;
  };

  return (
    <div className="template-container">
      <div className="bg-gradient">
        <Image
          src="/ce_04_cropped.webp"
          alt="ce_banner"
          width={2000}
          height={2000}
          className="opacity-25"
          draggable="false"
        />
      </div>
      <div className="mt-5 mb-4">
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
        <>
          {/* Generation Tabs Selector using Bootstrap 5 nav-pills */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <ul className="nav nav-pills gap-2">
              {availableGens.map((gen) => (
                <li className="nav-item" key={gen}>
                  <button
                    type="button"
                    className={`nav-link ${
                      selectedGen === gen
                        ? "active bg-primary text-white"
                        : "text-light bg-dark border border-secondary"
                    }`}
                    onClick={() => setSelectedGen(gen)}
                  >
                    {gen === "All" ? "ทุกรุ่น (All)" : `รุ่น ${gen}`}
                  </button>
                </li>
              ))}
            </ul>
            <span className="text-secondary small">
              จำนวน {filteredStudents.length} คน
            </span>
          </div>

          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3 g-md-4">
            {filteredStudents.map((student) => {
              const modalId = `student-${student.student_id}-modal`;
              const gen = getStudentGeneration(student.student_id);

              return (
                <div className="col" key={student.student_id}>
                  <div className="card bg-black border-secondary">
                    <Image
                      src={getStudentImage(student)}
                      alt={student.student_firstname}
                      width={500}
                      height={500}
                      draggable="false"
                      className="card-img-top hover:opacity-70 duration-150"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/404.png";
                      }}
                    />
                  </div>
                  <div
                    className="modal fade"
                    id={modalId}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                      <div className="modal-content bg-dark text-white border-secondary">
                        <div className="modal-header border-secondary">
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary">{gen}</span>
                            <span className="modal-title fs-5" id="exampleModalLabel">
                              {student.student_id}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <h5>
                            {student.student_firstname} {student.student_lastname}
                          </h5>
                          <p className="text-secondary mb-0">
                            สายรหัส: T{student.student_lineage}
                          </p>
                        </div>
                        <div className="modal-footer border-secondary">
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
        </>
      )}
    </div>
  );
}
