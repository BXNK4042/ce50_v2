"use client";

import { useEffect, useState } from "react";
import { Teachers } from "@/types/teacher";
import Image from "next/image";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTeachers() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/teachers");
        if (!response.ok) throw new Error("Failed to fetch teachers");
        setTeachers(await response.json());
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error fetching teachers");
      } finally {
        setLoading(false);
      }
    }

    getTeachers();
  }, []);

  return (
    <div className="template-container">
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">คณาจารย์</h1>
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
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {teachers.map((teacher) => (
            <div className="col" key={teacher.teacher_id}>
              <div className="card text-bg-dark justify-content-center align-items-center hover:opacity-75 duration-150">
                <Image
                  src={`/uploads/teachers/${teacher.teacher_name_en}_bg.webp`}
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
      )}
    </div>
  );
}
