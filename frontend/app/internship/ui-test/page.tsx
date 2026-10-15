"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  MapPin,
  Globe,
  Users,
  Briefcase,
  ExternalLink,
  GraduationCap,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  legalName: string;
  category: string;
  location: string;
  website: string;
  websiteDisplay: string;
  badgeText: string;
  headline: string;
  about: string;
  stats: {
    internsCount: number;
    generations: string[];
    returnOfferRate: string;
    mentorshipRating: string;
  };
  topRoles: string[];
  techStack: string[];
  sampleInterns: {
    id: string;
    name: string;
    role: string;
    gen: string;
  }[];
}

const SAMPLE_COMPANIES: Record<string, CompanyData> = {
  agoda: {
    id: "agoda",
    name: "Agoda",
    legalName: "Agoda Services Co., Ltd.",
    category: "Global Travel & Tech Platform",
    location: "CentralWorld Offices, Bangkok (Hybrid)",
    website: "https://careersatagoda.com",
    websiteDisplay: "careersatagoda.com",
    badgeText: "Enterprise Partner",
    headline: "Global travel platform connecting millions of travelers with real-time distributed systems",
    about:
      "Agoda is a digital travel platform operating at scale. Computer Engineering interns work on high-throughput microservices, real-time analytics, and resilient cloud infrastructure serving hundreds of millions of global queries every day.",
    stats: {
      internsCount: 8,
      generations: ["CE01", "CE02", "CE03", "CE04"],
      returnOfferRate: "87%",
      mentorshipRating: "4.9 / 5.0",
    },
    topRoles: ["Backend Engineer", "Data / ML Engineer", "Full Stack Developer"],
    techStack: ["Scala", "Go", "React", "Kafka", "Kubernetes", "PostgreSQL"],
    sampleInterns: [
      { id: "64010123", name: "กฤษฎา ตั้งจิตต์", role: "Backend Engineer", gen: "CE01" },
      { id: "65010456", name: "ธนภัทร วัฒนกุล", role: "Data Engineer", gen: "CE02" },
      { id: "66010789", name: "ชิดชนก ศรีสุข", role: "Full Stack Engineer", gen: "CE03" },
      { id: "67010012", name: "วริศรา ภัทรชัย", role: "Backend Intern", gen: "CE04" },
    ],
  },
  lmwn: {
    id: "lmwn",
    name: "LINE MAN Wongnai",
    legalName: "LINE MAN Wongnai Co., Ltd.",
    category: "On-Demand Delivery & Lifestyle Platform",
    location: "T-One Building, Thong Lo, Bangkok",
    website: "https://careers.lmwn.com",
    websiteDisplay: "careers.lmwn.com",
    badgeText: "Unicorn Partner",
    headline: "Thailand's #1 on-demand food delivery, mart, and lifestyle tech powerhouse",
    about:
      "LINE MAN Wongnai powers daily life for millions across Thailand. Interns join agile squads to develop high-concurrency dispatching systems, merchant tools, and cloud pipelines.",
    stats: {
      internsCount: 12,
      generations: ["CE02", "CE03", "CE04"],
      returnOfferRate: "92%",
      mentorshipRating: "4.8 / 5.0",
    },
    topRoles: ["Software Engineer", "Mobile Developer", "Platform / DevOps"],
    techStack: ["Go", "TypeScript", "React", "Flutter", "Kubernetes", "Redis"],
    sampleInterns: [
      { id: "65010221", name: "ภาณุพงศ์ เจริญผล", role: "Software Engineer", gen: "CE02" },
      { id: "66010334", name: "นภัสสร อริยวิกรม", role: "Mobile Developer", gen: "CE03" },
      { id: "67010445", name: "อภิสิทธิ์ เลิศวานิช", role: "Platform Engineer", gen: "CE04" },
      { id: "67010889", name: "ปวีณา กิตติโภคิน", role: "Frontend Engineer", gen: "CE04" },
    ],
  },
  kbtg: {
    id: "kbtg",
    name: "KBTG",
    legalName: "Kasikorn Business-Technology Group",
    category: "Fintech & AI Research Powerhouse",
    location: "K+ Building, Chaengwattana, Nonthaburi",
    website: "https://www.kbtg.tech",
    websiteDisplay: "kbtg.tech",
    badgeText: "Strategic Partner",
    headline: "Innovating financial technologies, AI frontiers, and digital banking for Southeast Asia",
    about:
      "KBTG drives digital transformation and pioneers AI/ML research in Thailand. CE interns engage in projects spanning AI research, core banking transaction systems, and cybersecurity.",
    stats: {
      internsCount: 15,
      generations: ["CE01", "CE02", "CE03", "CE04"],
      returnOfferRate: "90%",
      mentorshipRating: "4.9 / 5.0",
    },
    topRoles: ["AI / ML Research", "Core Backend", "Cybersecurity Analyst"],
    techStack: ["Python", "PyTorch", "Java", "Go", "Docker", "PostgreSQL"],
    sampleInterns: [
      { id: "64010992", name: "ณัฐดนัย เตชะสกุล", role: "AI Research Intern", gen: "CE01" },
      { id: "65010341", name: "ศุภกฤต สุวรรณฉัตร", role: "Core Backend Intern", gen: "CE02" },
      { id: "66010552", name: "พงศธร พิริยะกุล", role: "Cybersecurity Intern", gen: "CE03" },
      { id: "67010771", name: "ชนัญชิดา ชัยวรวัฒน์", role: "Machine Learning Intern", gen: "CE04" },
    ],
  },
};

type ViewMode = "all" | "style1" | "style2" | "style3";

export default function InternshipUiTestPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedCompanyKey, setSelectedCompanyKey] = useState<string>("agoda");

  const company = SAMPLE_COMPANIES[selectedCompanyKey] || SAMPLE_COMPANIES.agoda;

  return (
    <div className="container py-4">
      {/* Top Header & Breadcrumb */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom pb-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link href="/company" className="text-decoration-none">
                  Companies
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                UI Test
              </li>
            </ol>
          </nav>
          <h1 className="h3 mb-0">Company Info UI Components</h1>
          <p className="text-secondary mb-0">
            Preview 3 standard Bootstrap 5 component styles for company profile headers.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link href="/company" className="btn btn-outline-secondary d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
          <Link href="/internship/1" className="btn btn-primary d-inline-flex align-items-center gap-2">
            <span>Internship Page</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Control Bar: Nav Pills & Company Select */}
      <div className="card text-bg-dark border mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-12 col-lg-7">
              <label className="form-label text-secondary small fw-bold text-uppercase mb-2">
                Bootstrap Component Style:
              </label>
              <ul className="nav nav-pills">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${viewMode === "all" ? "active" : "text-white"}`}
                    onClick={() => setViewMode("all")}
                  >
                    View All
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${viewMode === "style1" ? "active" : "text-white"}`}
                    onClick={() => setViewMode("style1")}
                  >
                    Style 1: Hero / Jumbotron
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${viewMode === "style2" ? "active" : "text-white"}`}
                    onClick={() => setViewMode("style2")}
                  >
                    Style 2: Horizontal Card
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${viewMode === "style3" ? "active" : "text-white"}`}
                    onClick={() => setViewMode("style3")}
                  >
                    Style 3: Header &amp; List Group
                  </button>
                </li>
              </ul>
            </div>

            <div className="col-12 col-lg-5">
              <label className="form-label text-secondary small fw-bold text-uppercase mb-2">
                Sample Data:
              </label>
              <div className="btn-group w-100" role="group">
                {Object.keys(SAMPLE_COMPANIES).map((key) => {
                  const comp = SAMPLE_COMPANIES[key];
                  const isActive = selectedCompanyKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCompanyKey(key)}
                      className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline-secondary text-white"}`}
                    >
                      {comp.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STYLE 1: Standard Bootstrap 5 Hero / Jumbotron
         ========================================================================= */}
      {(viewMode === "all" || viewMode === "style1") && (
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h2 className="h5 text-secondary mb-0">
              Style 1: Standard Hero / Jumbotron (<code>p-5 mb-4 bg-dark text-white rounded-3 border</code>)
            </h2>
            <span className="badge text-bg-secondary">Jumbotron</span>
          </div>

          <div className="p-5 mb-4 bg-dark text-white rounded-3 border">
            <div className="container-fluid py-2">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge text-bg-primary">{company.badgeText}</span>
                <span className="badge text-bg-secondary">{company.category}</span>
              </div>
              <h1 className="display-6 fw-bold">{company.name}</h1>
              <p className="lead text-secondary">{company.headline}</p>
              <p className="col-md-10 fs-6">{company.about}</p>

              <div className="d-flex flex-wrap align-items-center gap-3 my-4 text-secondary small">
                <div className="d-flex align-items-center gap-1">
                  <MapPin size={16} />
                  <span>{company.location}</span>
                </div>
                <div>•</div>
                <div className="d-flex align-items-center gap-1">
                  <Globe size={16} />
                  <span>{company.websiteDisplay}</span>
                </div>
                <div>•</div>
                <div className="d-flex align-items-center gap-1">
                  <Users size={16} />
                  <span>{company.stats.internsCount} นักศึกษา (CE)</span>
                </div>
                <div>•</div>
                <div className="d-flex align-items-center gap-1">
                  <GraduationCap size={16} />
                  <span>รุ่น {company.stats.generations.join(", ")}</span>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary d-inline-flex align-items-center gap-2"
                >
                  <Globe size={16} />
                  <span>Official Careers</span>
                  <ExternalLink size={14} />
                </a>
                <Link
                  href="/company"
                  className="btn btn-outline-light"
                >
                  All Companies
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          STYLE 2: Standard Bootstrap 5 Horizontal Card
         ========================================================================= */}
      {(viewMode === "all" || viewMode === "style2") && (
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h2 className="h5 text-secondary mb-0">
              Style 2: Horizontal Card (<code>card text-bg-dark mb-4 border</code> + <code>row g-0</code>)
            </h2>
            <span className="badge text-bg-secondary">Horizontal Card</span>
          </div>

          <div className="card text-bg-dark mb-4 border">
            <div className="row g-0">
              {/* Thumbnail / Column 2 */}
              <div className="col-md-2 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 border-end border-secondary border-opacity-25 p-3 text-center">
                <div>
                  <Building size={48} className="text-secondary mb-2" />
                  <div className="fw-bold fs-5">{company.name}</div>
                  <small className="text-secondary d-block">{company.category}</small>
                </div>
              </div>

              {/* Body */}
              <div className="col-md-10">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="card-title h4 mb-0">{company.name}</h3>
                      <span className="badge text-bg-primary">{company.badgeText}</span>
                    </div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <p className="card-text text-secondary mb-2">{company.headline}</p>
                  <p className="card-text small mb-3">{company.about}</p>

                  <div className="row g-2 pt-2 border-top border-secondary border-opacity-25">
                    <div className="col-6 col-md-3">
                      <small className="text-secondary d-block">Location</small>
                      <span className="small">{company.location}</span>
                    </div>
                    <div className="col-6 col-md-3">
                      <small className="text-secondary d-block">Interns Count</small>
                      <span className="fw-semibold">{company.stats.internsCount} คน</span>
                      <span className="text-secondary small ms-1">({company.stats.generations.join(", ")})</span>
                    </div>
                    <div className="col-6 col-md-3">
                      <small className="text-secondary d-block">Return Offer Rate</small>
                      <span className="text-success fw-semibold">{company.stats.returnOfferRate}</span>
                    </div>
                    <div className="col-6 col-md-3">
                      <small className="text-secondary d-block">Tech Stack</small>
                      <span className="small text-secondary">{company.techStack.slice(0, 4).join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          STYLE 3: Standard Bootstrap 5 Header Card with List Group
         ========================================================================= */}
      {(viewMode === "all" || viewMode === "style3") && (
        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h2 className="h5 text-secondary mb-0">
              Style 3: Header Card with List Group (<code>card text-bg-dark border mb-4</code> + <code>list-group-horizontal</code>)
            </h2>
            <span className="badge text-bg-secondary">Card with List Group</span>
          </div>

          <div className="card text-bg-dark border mb-4">
            <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2 bg-secondary bg-opacity-10 py-3">
              <div className="d-flex align-items-center gap-2">
                <Building size={20} className="text-primary" />
                <h3 className="h5 mb-0 fw-bold">{company.name}</h3>
                <span className="text-secondary small">•</span>
                <span className="text-secondary small">{company.legalName}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge text-bg-primary">{company.badgeText}</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-1"
                >
                  <Globe size={14} />
                  <span>Careers</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="card-body">
              <p className="card-text fw-medium text-white mb-2">{company.headline}</p>
              <p className="card-text text-secondary small mb-3">{company.about}</p>

              <div className="d-flex flex-wrap gap-1 align-items-center">
                <span className="text-secondary small me-2">Technologies:</span>
                {company.techStack.map((tech) => (
                  <span key={tech} className="badge bg-secondary text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <ul className="list-group list-group-flush list-group-horizontal-md text-bg-dark border-top border-secondary border-opacity-25">
              <li className="list-group-item text-bg-dark flex-fill">
                <div className="d-flex align-items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <div>
                    <div className="small text-secondary">Interns</div>
                    <div className="fw-bold">{company.stats.internsCount} นักศึกษา</div>
                  </div>
                </div>
              </li>
              <li className="list-group-item text-bg-dark flex-fill">
                <div className="d-flex align-items-center gap-2">
                  <GraduationCap size={16} className="text-primary" />
                  <div>
                    <div className="small text-secondary">Generations</div>
                    <div className="fw-bold">{company.stats.generations.join(", ")}</div>
                  </div>
                </div>
              </li>
              <li className="list-group-item text-bg-dark flex-fill">
                <div className="d-flex align-items-center gap-2">
                  <TrendingUp size={16} className="text-success" />
                  <div>
                    <div className="small text-secondary">Offer Rate</div>
                    <div className="fw-bold text-success">{company.stats.returnOfferRate}</div>
                  </div>
                </div>
              </li>
              <li className="list-group-item text-bg-dark flex-fill">
                <div className="d-flex align-items-center gap-2">
                  <Briefcase size={16} className="text-primary" />
                  <div>
                    <div className="small text-secondary">Top Track</div>
                    <div className="fw-bold text-truncate">{company.topRoles[0]}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* =========================================================================
          Sample Interns Grid (Clean Bootstrap 5 Cards)
         ========================================================================= */}
      <section className="mt-4 pt-3 border-top">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="h6 text-uppercase text-secondary fw-bold mb-0">
            Interns Roster Preview ({company.sampleInterns.length} Students)
          </h4>
        </div>

        <div className="row row-cols-2 row-cols-md-4 g-3">
          {company.sampleInterns.map((student) => (
            <div className="col" key={student.id}>
              <div className="card text-bg-dark border h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge text-bg-primary">{student.gen}</span>
                    <small className="text-secondary">{student.id}</small>
                  </div>
                  <h5 className="card-title fs-6 mb-1 text-truncate">{student.name}</h5>
                  <p className="card-text small text-secondary mb-0 text-truncate">{student.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
