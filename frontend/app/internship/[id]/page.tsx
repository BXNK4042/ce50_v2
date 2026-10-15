"use client";
import { useState, useEffect } from "react";
import { Internships } from "@/types/internship";
import { Students } from "@/types/student";
import { Companys } from "@/types/companys";
import { useParams } from "next/navigation";
import { ArrowLeft, Building } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getStudentGeneration } from "@/utils/generation";

export default function InternshipPage() {
  const { id } = useParams();
  const [internships, setInternships] = useState<Internships[]>([]);
  const [students, setStudents] = useState<Students[]>([]);
  const [companys, setCompanys] = useState<Companys[]>([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [id]);

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

  useEffect(() => {
    async function getCompanys() {
      const response = await fetch("/api/companys");
      setCompanys(await response.json());
    }

    getCompanys();
  }, []);

  const currentCompany = companys.find(
    (company) => company.company_id === Number(id),
  );

  const internFiltered = internships.filter(
    (internship) => internship.company_id === Number(id),
  );

  const studentIds = internFiltered.map((item) => item.student_id);

  const studentFiltered = students.filter((student) =>
    studentIds.includes(student.student_id),
  );

  return (
    <div className="template-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-5 gap-3">
        <div>
          <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
          <h1 className="text-primary">นักศึกษาฝึกงาน</h1>
          <div className="bg-blue-500 w-20 h-1"></div>
        </div>
        <Link
          href="/company"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Back to Company</span>
        </Link>
      </div>

      {/* Style 2 Horizontal Card */}
      <div className="card text-bg-dark mb-4 border">
        <div className="row g-0">
          <div className="col-md-2 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 border-end border-secondary border-opacity-25 p-3 text-center">
            {currentCompany?.company_image && !imageError ? (
              <Image
                src={`/uploads/companys/${currentCompany.company_image}.jpg`}
                alt={currentCompany.company_name || "Company"}
                width={120}
                height={120}
                className="img-fluid rounded object-fit-contain"
                style={{ maxHeight: "100px", width: "auto" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Building size={48} className="text-secondary" />
            )}
          </div>
          <div className="col-md-10">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <h3 className="card-title mb-0">
                  {currentCompany?.company_name || "Company"}
                </h3>
                <span className="badge text-bg-primary">
                  CE Internship Partner
                </span>
              </div>
              <div className="row g-2 pt-2 border-top border-secondary border-opacity-25">
                <div className="col-12 col-md-6">
                  <small className="text-secondary d-block">Location</small>
                  <span className="fw-semibold">
                    {currentCompany?.company_location || "-"}
                  </span>
                </div>
                <div className="col-12 col-md-6">
                  <small className="text-secondary d-block">Email</small>
                  <span className="fw-semibold">
                    {currentCompany?.company_email ? (
                      <a
                        href={`mailto:${currentCompany.company_email}`}
                        className="text-primary text-decoration-none"
                      >
                        {currentCompany.company_email}
                      </a>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3 g-md-4 mb-5">
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
                <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
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
