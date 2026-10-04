"use client";
import { useState, useEffect } from "react";
import { Internships } from "@/types/internship";
import { Students } from "@/types/student";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getStudentGeneration } from "@/utils/generation";

export default function InternshipPage() {
  const { id } = useParams();
  const [internships, setInternships] = useState<Internships[]>([]);
  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
    async function getInternship() {
      const response = await fetch("/api/internship");
      setInternships(await response.json());
    }

    getInternship();
  }, []);

  useEffect(() => {
    async function getStudent() {
      const response = await fetch("/api/students");
      setStudents(await response.json());
    }

    getStudent();
  }, []);

  const internFiltered = internships.filter(
    (internship) => internship.company_id === Number(id),
  );

  const studentIds = internFiltered.map((item) => item.student_id);

  const studentFiltered = students.filter((student) =>
    studentIds.includes(student.student_id),
  );

  return (
    <div className="template-container">
      <div className="mb-4 pt-2">
        <Link
          href="/company"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Back to Company</span>
        </Link>
      </div>

      <div className="mt-3 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">นักศึกษาฝึกงาน</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
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
            {studentFiltered.map((student) => (
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
      <div className="row rows-cols-1 row-cols-md-6 g-4">
        {studentFiltered.map((student) => {
          const modalId = `student-${student.student_id}-modal`;

          return (
            <div className="col" key={student.student_id}>
              <div className="card bg-black ">
                <Image
                  src={
                    student.student_image
                      ? (student.student_image.startsWith("/") ? student.student_image : `/uploads/students/${student.student_image}`)
                      : `/uploads/students/${getStudentGeneration(student.student_id).toLowerCase().replace("ce", "ce_")}/${student.student_id}.png`
                  }
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
                      </p>
                      {/*internship_description, how am I going to be able to get internship.internship_description since we're in student T_T. still working on it*/}
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
