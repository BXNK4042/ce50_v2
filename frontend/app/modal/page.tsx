"use client";

import { useState } from "react";
import { X, CheckCircle, Upload, AlertCircle, Sparkles } from "lucide-react";

export default function ModalShowcasePage() {
  const [openModal, setOpenModal] = useState<null | "style1" | "style2" | "style3">(null);

  return (
    <div className="template-container py-5 text-white">
      <div className="mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">เปรียบเทียบสไตล์ Modal Dialog (Modal Styles Showcase)</h1>
        <div className="bg-blue-500 w-24 h-1 mt-2 mb-4"></div>
        <p className="text-secondary lead">
          กดปุ่มด้านล่างเพื่อเปิดทดสอบ Modal ป๊อปอัปทั้ง 3 รูปแบบ แล้วเลือกสไตล์ที่ชอบได้เลย
        </p>

        {/* Modal Trigger Buttons */}
        <div className="d-flex flex-wrap gap-3 mt-4">
          <button
            type="button"
            className="btn btn-warning text-dark fw-bold px-4 py-2 rounded-3 shadow"
            onClick={() => setOpenModal("style1")}
          >
            เปิดดู Style 1: Clean Light Surface (เข้าชุดกับตาราง Style 1)
          </button>
          <button
            type="button"
            className="btn btn-info text-dark fw-bold px-4 py-2 rounded-3 shadow"
            onClick={() => setOpenModal("style2")}
          >
            เปิดดู Style 2: Sleek Modern Dark (Deep Charcoal)
          </button>
          <button
            type="button"
            className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow"
            onClick={() => setOpenModal("style3")}
          >
            เปิดดู Style 3: Structured Accent (Section Dividers)
          </button>
        </div>
      </div>

      {/* Static Preview Cards */}
      <div className="row g-4 mt-2">
        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 h-100 rounded-3">
            <span className="badge bg-warning text-dark mb-2 align-self-start">Option 1</span>
            <h4 className="fw-bold text-white mb-2">Style 1: Clean Light Surface</h4>
            <p className="text-secondary small mb-4">
              หน้าต่างพื้นหลังสีขาวสะอาดตา คอนทราสต์สูง อ่านและกรอกฟอร์มง่ายที่สุด เข้าชุด 100% กับตาราง Style 1 ที่ใช้อยู่
            </p>
            <button className="btn btn-outline-warning btn-sm mt-auto" onClick={() => setOpenModal("style1")}>
              ทดลองเปิด Modal Style 1 &rarr;
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 h-100 rounded-3">
            <span className="badge bg-info text-dark mb-2 align-self-start">Option 2</span>
            <h4 className="fw-bold text-white mb-2">Style 2: Sleek Modern Dark</h4>
            <p className="text-secondary small mb-4">
              สไตล์ Dark Mode เรียบหรู ใช้โทนสีเทาดำลึก (Deep Charcoal) ขอบบางกลมกลืน ช่องกรอกฟอร์มมีโฟกัสเรืองแสงนุ่มนวล
            </p>
            <button className="btn btn-outline-info btn-sm mt-auto" onClick={() => setOpenModal("style2")}>
              ทดลองเปิด Modal Style 2 &rarr;
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark border-secondary p-4 h-100 rounded-3">
            <span className="badge bg-primary text-white mb-2 align-self-start">Option 3</span>
            <h4 className="fw-bold text-white mb-2">Style 3: Structured Accent</h4>
            <p className="text-secondary small mb-4">
              มีแถบสีน้ำเงินนำสายตาด้านบน แบ่งส่วนฟอร์มชัดเจน (ข้อมูลทั่วไป / แนบไฟล์) ชัดเจนแบบวิศวกรรม
            </p>
            <button className="btn btn-outline-primary btn-sm mt-auto" onClick={() => setOpenModal("style3")}>
              ทดลองเปิด Modal Style 3 &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: Clean Light Surface (Matches Table Style 1)
         ========================================================================= */}
      {openModal === "style1" && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(6px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-white text-dark border-0 rounded-4 shadow-2xl overflow-hidden">
              <div className="modal-header border-bottom px-4 py-3 bg-light bg-opacity-50">
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-0">เพิ่มข้อมูลรายวิชาใหม่ (Add Class Schedule)</h5>
                  <small className="text-secondary">กรอกรายละเอียดตารางเรียนสำหรับนักศึกษา</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setOpenModal(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">ชื่อวิชา</label>
                    <input
                      type="text"
                      className="form-control py-2"
                      placeholder="เช่น Software Engineering"
                      defaultValue="Database Systems"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">รุ่น (Generation)</label>
                    <select className="form-select py-2" defaultValue="CE04">
                      <option value="CE04">CE04</option>
                      <option value="CE03">CE03</option>
                      <option value="CE02">CE02</option>
                      <option value="CE01">CE01</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold text-secondary">ภาคเรียน (Semester)</label>
                    <select className="form-select py-2" defaultValue={1}>
                      <option value={1}>เทอม 1 (Semester 1)</option>
                      <option value={2}>เทอม 2 (Semester 2)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">วันเรียน</label>
                    <select className="form-select py-2" defaultValue="monday">
                      <option value="monday">Monday (จันทร์)</option>
                      <option value="tuesday">Tuesday (อังคาร)</option>
                      <option value="wednesday">Wednesday (พุธ)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">เวลาเริ่ม</label>
                    <input type="text" className="form-control py-2" defaultValue="10:00" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-secondary">เวลาสิ้นสุด</label>
                    <input type="text" className="form-control py-2" defaultValue="12:00" />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">คำอธิบายรายวิชา</label>
                    <textarea className="form-control" rows={3} defaultValue="หลักการออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์"></textarea>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top px-4 py-3 bg-light bg-opacity-25 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-light border px-4"
                  onClick={() => setOpenModal(null)}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-semibold"
                  onClick={() => setOpenModal(null)}
                >
                  บันทึกข้อมูล (Save)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: Sleek Modern Dark (Deep Charcoal, Soft Border)
         ========================================================================= */}
      {openModal === "style2" && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content text-white rounded-4 shadow-2xl overflow-hidden border"
              style={{ backgroundColor: "#151515", borderColor: "#282828" }}
            >
              <div className="modal-header border-bottom px-4 py-3" style={{ borderColor: "#282828" }}>
                <div>
                  <h5 className="modal-title fw-bold text-white mb-0">เพิ่มข้อมูลรายวิชาใหม่ (Add Class Schedule)</h5>
                  <small className="text-secondary">กรอกรายละเอียดตารางเรียนสำหรับนักศึกษา</small>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setOpenModal(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">ชื่อวิชา</label>
                    <input
                      type="text"
                      className="form-control text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue="Database Systems"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">รุ่น (Generation)</label>
                    <select
                      className="form-select text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue="CE04"
                    >
                      <option value="CE04">CE04</option>
                      <option value="CE03">CE03</option>
                      <option value="CE02">CE02</option>
                      <option value="CE01">CE01</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">ภาคเรียน (Semester)</label>
                    <select
                      className="form-select text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue={1}
                    >
                      <option value={1}>เทอม 1 (Semester 1)</option>
                      <option value={2}>เทอม 2 (Semester 2)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">วันเรียน</label>
                    <select
                      className="form-select text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue="monday"
                    >
                      <option value="monday">Monday (จันทร์)</option>
                      <option value="tuesday">Tuesday (อังคาร)</option>
                      <option value="wednesday">Wednesday (พุธ)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">เวลาเริ่ม</label>
                    <input
                      type="text"
                      className="form-control text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue="10:00"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">เวลาสิ้นสุด</label>
                    <input
                      type="text"
                      className="form-control text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      defaultValue="12:00"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small text-secondary">คำอธิบายรายวิชา</label>
                    <textarea
                      className="form-control text-white border"
                      style={{ backgroundColor: "#1f1f1f", borderColor: "#333" }}
                      rows={3}
                      defaultValue="หลักการออกแบบและจัดการฐานข้อมูลเชิงสัมพันธ์"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top px-4 py-3 d-flex justify-content-between" style={{ borderColor: "#282828" }}>
                <button
                  type="button"
                  className="btn btn-dark border px-4"
                  style={{ borderColor: "#333" }}
                  onClick={() => setOpenModal(null)}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-semibold"
                  onClick={() => setOpenModal(null)}
                >
                  บันทึกข้อมูล (Save)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: Structured Accent (Section Dividers + Accent Header)
         ========================================================================= */}
      {openModal === "style3" && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(6px)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-0 rounded-4 shadow-2xl overflow-hidden border-top border-4 border-primary">
              <div className="modal-header border-bottom border-secondary border-opacity-50 px-4 py-3 bg-black bg-opacity-40">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded bg-primary bg-opacity-20 text-primary">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold text-white mb-0">เพิ่มข้อมูลรายวิชาใหม่ (Class Schedule)</h5>
                    <small className="text-secondary">CE50 Academic Curriculum System</small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setOpenModal(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Section 1 */}
                <h6 className="text-primary small fw-bold text-uppercase mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  1. ข้อมูลพื้นฐานของรายวิชา (Basic Information)
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">ชื่อวิชา</label>
                    <input type="text" className="form-control bg-black border-secondary text-white" defaultValue="Database Systems" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">รุ่น</label>
                    <select className="form-select bg-black border-secondary text-white" defaultValue="CE04">
                      <option value="CE04">CE04</option>
                      <option value="CE03">CE03</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary">ภาคเรียน</label>
                    <select className="form-select bg-black border-secondary text-white" defaultValue={1}>
                      <option value={1}>เทอม 1</option>
                      <option value={2}>เทอม 2</option>
                    </select>
                  </div>
                </div>

                {/* Section 2 */}
                <h6 className="text-primary small fw-bold text-uppercase mb-3 pb-2 border-bottom border-secondary border-opacity-25">
                  2. วัน เวลา และสถานที่ (Schedule & Location)
                </h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">วันเรียน</label>
                    <select className="form-select bg-black border-secondary text-white" defaultValue="monday">
                      <option value="monday">Monday (จันทร์)</option>
                      <option value="tuesday">Tuesday (อังคาร)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">เวลาเริ่ม</label>
                    <input type="text" className="form-control bg-black border-secondary text-white" defaultValue="10:00" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary">เวลาสิ้นสุด</label>
                    <input type="text" className="form-control bg-black border-secondary text-white" defaultValue="12:00" />
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-50 px-4 py-3 bg-black bg-opacity-40 d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary text-white px-4"
                  onClick={() => setOpenModal(null)}
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 fw-semibold"
                  onClick={() => setOpenModal(null)}
                >
                  ยืนยันบันทึกข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
