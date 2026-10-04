"use client";

import { useState } from "react";
import { Table } from "lucide-react";

export default function TableShowcasePage() {
  const [activeTab, setActiveTab] = useState<"all" | "style1" | "style2" | "style3">("all");

  const sampleData = [
    {
      code: "11256011",
      name: "Software Development Processes",
      gen: "CE04",
      sem: 1,
      type: "MIDTERM",
      date: "2026-08-23",
      time: "13:30 - 16:30",
      room: "E113",
      day: "Monday",
      teacher: "อาจารย์อรรถศาสตร์",
    },
    {
      code: "11256016",
      name: "Database Systems",
      gen: "CE04",
      sem: 1,
      type: "FINAL",
      date: "2026-10-30",
      time: "13:30 - 16:30",
      room: "E113",
      day: "Tuesday",
      teacher: "ดร.รัตติกร",
    },
    {
      code: "11256025",
      name: "Computer Architecture",
      gen: "CE04",
      sem: 1,
      type: "FINAL",
      date: "2026-10-28",
      time: "10:00 - 12:00",
      room: "E111",
      day: "Wednesday",
      teacher: "ดร.รัตติกร",
    },
    {
      code: "11256031",
      name: "Data Structures & Algorithms",
      gen: "CE04",
      sem: 2,
      type: "MIDTERM",
      date: "2027-01-15",
      time: "09:30 - 12:30",
      room: "E111",
      day: "Thursday",
      teacher: "ดร.รัตติกร",
    },
    {
      code: "11256040",
      name: "Computer Networks & Protocols",
      gen: "CE04",
      sem: 2,
      type: "FINAL",
      date: "2027-03-26",
      time: "09:30 - 12:30",
      room: "E113",
      day: "Friday",
      teacher: "อาจารย์อรรถศาสตร์",
    },
  ];

  return (
    <div className="template-container py-5 text-white">
      <div className="mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">เปรียบเทียบสไตล์ตาราง (Table Styles Showcase)</h1>
        <div className="bg-blue-500 w-24 h-1 mt-2 mb-4"></div>
        <p className="text-secondary lead">
          ลองดูตัวอย่างตาราง 3 รูปแบบด้านล่าง แล้วบอกได้เลยว่าชอบ Style ไหนที่สุด
        </p>

        {/* View Switcher */}
        <div className="d-flex gap-2 mt-4">
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "all" ? "btn-primary" : "btn-outline-secondary text-light"}`}
            onClick={() => setActiveTab("all")}
          >
            ดูทั้งหมด (Compare All)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "style1" ? "btn-primary" : "btn-outline-secondary text-light"}`}
            onClick={() => setActiveTab("style1")}
          >
            Style 1: Clean Light Surface
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "style2" ? "btn-primary" : "btn-outline-secondary text-light"}`}
            onClick={() => setActiveTab("style2")}
          >
            Style 2: Minimalist Dark (Seamless)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === "style3" ? "btn-primary" : "btn-outline-secondary text-light"}`}
            onClick={() => setActiveTab("style3")}
          >
            Style 3: Structured Modern Bordered
          </button>
        </div>
      </div>

      {/* =========================================================================
          STYLE 1: Clean Light Card (High Contrast, Document Style)
          - Card พื้นขาวแบบคลีนคอนทราสต์สูง อ่านตัวหนังสือง่าย สบายตา สไตล์เอกสารทางการ
         ========================================================================= */}
      {(activeTab === "all" || activeTab === "style1") && (
        <section className="mb-5 pb-4 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="text-warning fw-bold mb-1">
                Style 1: Clean Light Surface (High Contrast)
              </h3>
              <p className="text-secondary small mb-0">
                สไตล์หน้ากระดาษสว่าง (Card พื้นขาวครอบตาราง) อ่านง่าย ชัดเจนที่สุด คอนทราสต์ตัดกับพื้นหลังสีดำของเว็บ
              </p>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2">Option 1</span>
          </div>

          <div className="card shadow-lg border-0 overflow-hidden rounded-3">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="py-3 px-3">รหัสวิชา</th>
                    <th className="py-3">ชื่อวิชา</th>
                    <th className="py-3 text-center">รุ่น</th>
                    <th className="py-3 text-center">เทอม</th>
                    <th className="py-3 text-center">ประเภท</th>
                    <th className="py-3">วันและเวลา</th>
                    <th className="py-3 text-center">ห้อง</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 font-monospace fw-bold text-dark">{row.code}</td>
                      <td className="fw-semibold text-dark">{row.name}</td>
                      <td className="text-center">
                        <span className="badge bg-primary text-white">{row.gen}</span>
                      </td>
                      <td className="text-center text-muted small">เทอม {row.sem}</td>
                      <td className="text-center">
                        <span className={`badge ${row.type === "FINAL" ? "bg-danger" : "bg-warning text-dark"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="text-muted small">
                        <div>{row.date}</div>
                        <div className="text-dark fw-semibold">{row.time}</div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary text-white">{row.room}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          STYLE 2: Minimalist Seamless Dark (Modern SaaS / Clean Flat)
          - เน้นความมินิมอล เส้นบาง ไร้ขอบหนา ตัวหนังสือขาวคมชัด เข้ากับโทนสีดำของเว็บ 100%
         ========================================================================= */}
      {(activeTab === "all" || activeTab === "style2") && (
        <section className="mb-5 pb-4 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="text-info fw-bold mb-1">
                Style 2: Minimalist Seamless Dark (Modern Flat)
              </h3>
              <p className="text-secondary small mb-0">
                สไตล์ Dark Mode เรียบหรู คลีน ไร้ขอบรกตา (Borderless + Bottom Line) เข้ากับธีมสีดำของเว็บกลมกลืน
              </p>
            </div>
            <span className="badge bg-info text-dark px-3 py-2">Option 2</span>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: "transparent" }}>
              <thead>
                <tr className="border-bottom border-secondary text-secondary small text-uppercase">
                  <th className="py-3 ps-2">รหัสวิชา</th>
                  <th className="py-3">ชื่อรายวิชา</th>
                  <th className="py-3 text-center">รุ่น</th>
                  <th className="py-3 text-center">ภาคเรียน</th>
                  <th className="py-3 text-center">ประเภท</th>
                  <th className="py-3">กำหนดการ</th>
                  <th className="py-3 text-end pe-2">ห้อง</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {sampleData.map((row, idx) => (
                  <tr key={idx} className="border-bottom border-secondary border-opacity-25">
                    <td className="py-3 ps-2 font-monospace text-primary fw-semibold">{row.code}</td>
                    <td className="py-3">
                      <div className="fw-semibold text-light">{row.name}</div>
                      <div className="text-secondary small">{row.teacher}</div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-light fw-medium">{row.gen}</span>
                    </td>
                    <td className="py-3 text-center text-secondary small">เทอม {row.sem}</td>
                    <td className="py-3 text-center">
                      <span className={`badge ${row.type === "FINAL" ? "bg-danger" : "bg-warning text-dark"} rounded-pill px-3`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-light small d-block">{row.date}</span>
                      <span className="text-secondary small">{row.time}</span>
                    </td>
                    <td className="py-3 text-end pe-2">
                      <span className="badge bg-dark border border-secondary text-secondary px-3 py-2">
                        {row.room}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* =========================================================================
          STYLE 3: Structured Modern Card (Bordered Glass / Grid)
          - แบ่งช่องมีกรอบชัดเจน หัวตารางน้ำเงินแบรนด์ สไตล์เทคโนโลยีและวิศวกรรม
         ========================================================================= */}
      {(activeTab === "all" || activeTab === "style3") && (
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h3 className="text-primary fw-bold mb-1">
                Style 3: Structured Tech Grid (Bordered Card)
              </h3>
              <p className="text-secondary small mb-0">
                สไตล์กริดโครงสร้างชัดเจน (Bordered Card) มีเส้นแบ่งคอลัมน์และหัวตารางชัดเจน เหมาะกับตารางข้อมูลเชิงวิศวกรรม
              </p>
            </div>
            <span className="badge bg-primary text-white px-3 py-2">Option 3</span>
          </div>

          <div className="card bg-black border border-secondary rounded-3 overflow-hidden shadow">
            <div className="card-header bg-dark border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold text-light d-flex align-items-center">
                <Table size={18} className="text-primary me-2" /> รายการตารางสอบและตารางเรียน
              </span>
              <span className="badge bg-secondary text-light">5 วิชา</span>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-bordered table-striped table-hover mb-0 align-middle border-secondary border-opacity-50">
                <thead className="table-dark text-secondary small text-uppercase">
                  <tr>
                    <th className="py-3 text-center" style={{ width: "120px" }}>รหัสวิชา</th>
                    <th className="py-3">ชื่อวิชา / อาจารย์</th>
                    <th className="py-3 text-center" style={{ width: "90px" }}>รุ่น</th>
                    <th className="py-3 text-center" style={{ width: "90px" }}>เทอม</th>
                    <th className="py-3 text-center" style={{ width: "110px" }}>การสอบ</th>
                    <th className="py-3" style={{ width: "180px" }}>วัน - เวลา</th>
                    <th className="py-3 text-center" style={{ width: "100px" }}>ห้อง</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-center font-monospace text-info fw-bold">{row.code}</td>
                      <td>
                        <div className="fw-bold text-white">{row.name}</div>
                        <small className="text-secondary">{row.teacher}</small>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-primary bg-opacity-75">{row.gen}</span>
                      </td>
                      <td className="text-center text-light">{row.sem}</td>
                      <td className="text-center">
                        <span className={`badge ${row.type === "FINAL" ? "bg-danger" : "bg-warning text-dark"}`}>
                          {row.type}
                        </span>
                      </td>
                      <td>
                        <div className="text-light small">{row.date}</div>
                        <div className="text-secondary small">{row.time}</div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary">{row.room}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
