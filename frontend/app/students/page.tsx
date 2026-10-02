"use client";

import { useState, useEffect } from "react";
import { Students } from "@/types/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<Students[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Students | null>(null);

  useEffect(() => {
    async function getStudent() {
      try {
        const response = await fetch("http://localhost:8000/students");
        if (response.ok) {
          const result = await response.json();
          setStudents(result);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    }

    getStudent();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedStudent(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic Hero section */}
      <div className="position-relative w-100 pb-5 d-flex flex-column justify-content-between align-items-center overflow-hidden bg-gradient" style={{ minHeight: "75vh" }}>
        {/* Background Image with bottom fade-out mask */}
        <img
          src="/image/students/ce04/backgrounds/ce04.webp"
          alt="CE04 Background"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = "none";
          }}
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0"
          style={{
            objectPosition: "50% 46%",
            maskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
          }}
        />
        {/* Contrast overlay with bottom fade-out mask */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 z-1 bg-black bg-opacity-50"
          style={{
            maskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 100%)",
          }}
        />

        {/* Top spacer */}
        <div className="position-relative z-2 mx-auto w-100 pt-4" style={{ maxWidth: "1440px", paddingInline: "1.5rem" }} />

        {/* Section Header */}
        <div
          className="position-relative z-2 mx-auto w-100 text-start"
          style={{
            maxWidth: "1440px",
            paddingInline: "1.5rem",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          <h1 className="display-5 fw-bolder text-white user-select-none mb-1">
            นักศึกษาชั้นปีที่ 3
          </h1>
          <p className="fs-2 fw-bolder text-info user-select-none mb-0">
            รุ่นที่ 4 (CE04)
          </p>
        </div>
      </div>

      {/* Bootstrap 5 Student List Section */}
      <div className="container py-5" style={{ maxWidth: "1440px" }}>
        {/* Sub-header counter */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-50">
          <div>
            <h2 className="h3 fw-bold text-white mb-1 d-flex align-items-center gap-2">
              <span className="spinner-grow spinner-grow-sm text-info" role="status" style={{ width: "10px", height: "10px" }} />
              ทำเนียบรุ่น CE04
            </h2>
            <p className="text-secondary small mb-0">
              ภาควิชาวิศวกรรมคอมพิวเตอร์ สจล. วิทยาเขตชุมพรเขตรอุดมศักดิ์
            </p>
          </div>
          <span className="badge bg-dark border border-secondary text-info px-3 py-2 fs-6 rounded-pill">
            {students.length} คน
          </span>
        </div>

        {/* Bootstrap 5 Grid */}
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
          {students.map((student) => {
            const photoUrl = `http://localhost:8000/uploads/students/ce_04/${student.student_id}.png`;
            const fullName = `${student.student_firstname} ${student.student_lastname}`;

            return (
              <div className="col" key={student.student_id}>
                <div
                  className="card bg-dark text-white border-secondary border-opacity-50 h-100 rounded-4 shadow-sm overflow-hidden position-relative"
                  onClick={() => setSelectedStudent(student)}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.borderColor = "var(--bs-info)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(13, 202, 240, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(108, 117, 125, 0.5)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="position-relative w-100 bg-black overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    {/* Portrait Photo */}
                    <img
                      src={photoUrl}
                      alt={fullName}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 z-1"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 45%, transparent 100%)",
                      }}
                    />

                    {/* Top Badges */}
                    <div className="position-absolute top-0 start-0 w-100 p-2 d-flex justify-content-between align-items-center z-2 pointer-events-none">
                      {student.student_lineage ? (
                        <span className="badge bg-dark bg-opacity-75 border border-secondary text-light">
                          T{student.student_lineage}
                        </span>
                      ) : <span />}

                      {student.student_role && (
                        <span className="badge bg-info text-dark fw-bold">
                          {student.student_role}
                        </span>
                      )}
                    </div>

                    {/* Bottom Info */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3 text-start z-2">
                      <small className="font-monospace text-info fw-bold d-block mb-1">
                        {student.student_id}
                      </small>
                      <h6 className="card-title text-white fw-bold mb-1 text-truncate">
                        {fullName}
                      </h6>
                      {student.student_instagram && (
                        <small className="text-secondary d-flex align-items-center gap-1">
                          <i className="bi bi-instagram text-danger" style={{ fontSize: "0.75rem" }} />
                          <span className="text-truncate">{student.student_instagram}</span>
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bootstrap 5 Modal */}
      {selectedStudent && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark text-white border-secondary border-opacity-75 rounded-4 shadow-lg overflow-hidden">
              {/* Modal Header with Portrait */}
              <div className="position-relative bg-black text-center pt-4 pb-3 border-bottom border-secondary border-opacity-50">
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3"
                  aria-label="Close"
                  onClick={() => setSelectedStudent(null)}
                />

                {/* Framed Photo */}
                <div className="d-flex justify-content-center">
                  <div
                    className="rounded-4 overflow-hidden border border-secondary shadow-lg bg-black"
                    style={{ width: "160px", height: "210px" }}
                  >
                    <img
                      src={`http://localhost:8000/uploads/students/ce_04/${selectedStudent.student_id}.png`}
                      alt={`${selectedStudent.student_firstname} ${selectedStudent.student_lastname}`}
                      className="w-100 h-100 object-fit-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="font-monospace text-info fw-bold small">
                    STUDENT ID: {selectedStudent.student_id}
                  </span>
                  {selectedStudent.student_role && (
                    <span className="badge bg-info text-dark fw-bold px-2 py-1">
                      {selectedStudent.student_role}
                    </span>
                  )}
                </div>
                <h4 className="modal-title fw-bold text-white mb-3">
                  {selectedStudent.student_firstname} {selectedStudent.student_lastname}
                </h4>

                {/* List Group Info Cards */}
                <div className="list-group list-group-flush border-0 gap-2">
                  {/* Lineage */}
                  <div className="list-group-item bg-black bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 d-flex justify-content-between align-items-center text-white">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-info bg-opacity-25 text-info rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-diagram-3 fs-5" />
                      </div>
                      <div>
                        <small className="text-secondary d-block">สายรหัส (Lineage)</small>
                        <span className="fw-bold">
                          {selectedStudent.student_lineage ? `T${selectedStudent.student_lineage}` : "-"}
                        </span>
                      </div>
                    </div>
                    <span className="badge bg-secondary bg-opacity-50 border border-secondary text-light">
                      รุ่น 4
                    </span>
                  </div>

                  {/* Telephone */}
                  <div className="list-group-item bg-black bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 d-flex justify-content-between align-items-center text-white">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-success bg-opacity-25 text-success rounded-3 d-flex align-items-center justify-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-telephone-fill fs-5" />
                      </div>
                      <div>
                        <small className="text-secondary d-block">เบอร์โทรศัพท์ (Tel)</small>
                        {selectedStudent.student_contact ? (
                          <a
                            href={`tel:${selectedStudent.student_contact}`}
                            className="fw-bold text-success text-decoration-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {selectedStudent.student_contact}
                          </a>
                        ) : (
                          <span className="text-secondary">-</span>
                        )}
                      </div>
                    </div>
                    {selectedStudent.student_contact && (
                      <a
                        href={`tel:${selectedStudent.student_contact}`}
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                      >
                        โทรออก ↗
                      </a>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="list-group-item bg-black bg-opacity-50 border border-secondary border-opacity-50 rounded-3 p-3 d-flex justify-content-between align-items-center text-white">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-danger bg-opacity-25 text-danger rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-instagram fs-5" />
                      </div>
                      <div>
                        <small className="text-secondary d-block">Instagram</small>
                        {selectedStudent.student_instagram ? (
                          <a
                            href={`https://instagram.com/${selectedStudent.student_instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fw-bold text-danger text-decoration-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            @{selectedStudent.student_instagram}
                          </a>
                        ) : (
                          <span className="text-secondary">-</span>
                        )}
                      </div>
                    </div>
                    {selectedStudent.student_instagram && (
                      <a
                        href={`https://instagram.com/${selectedStudent.student_instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                      >
                        เปิดโปรไฟล์ ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-secondary border-opacity-50 p-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 rounded-3"
                  onClick={() => setSelectedStudent(null)}
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
