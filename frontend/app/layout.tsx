"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ce_logo from "../public/ce_logo.webp";
import { Outfit } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";

const outfit = Outfit({ subsets: ["latin"] });

const footerRoutes = [
  { href: "/", label: "Home" },
  { href: "/teachers", label: "Teachers" },
  { href: "/students", label: "Students" },
  { href: "/news", label: "News" },
  { href: "/projects", label: "Projects" },
  { href: "/exam", label: "Exam" },
  { href: "/class", label: "Class" },
  { href: "/rooms", label: "Rooms" },
  { href: "/company", label: "Company" },
  { href: "/quiz", label: "Career Quiz" },
  { href: "/admin/login", label: "Admin" },
];

const currentYear = new Date().getFullYear();

export default function RootLayout({ children }: LayoutProps<"/">) {
  const [mounted, setMounted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<{ user_name: string; user_role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = localStorage.getItem("ce50_admin_token");
      const userStr = localStorage.getItem("ce50_admin_user");
      if (token && userStr) {
        try {
          setIsAdminLoggedIn(true);
          setAdminUser(JSON.parse(userStr));
        } catch {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      } else {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    // @ts-expect-error Bootstrap bundle has no TypeScript declarations.
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <div className="bg-black position-relative border-bottom border-secondary border-opacity-25">
          <ul className="nav justify-content-center align-items-center py-2">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              People
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <Link href="/teachers" className="dropdown-item">
                  Teachers
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/students" className="dropdown-item">
                  Students
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link href="/news" className="nav nav-link text-light">
              News
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/projects" className="nav nav-link text-light">
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/" className="nav nav-link">
              <Image
                src={ce_logo}
                alt="CE_LOGO"
                width="50"
                height="50"
                draggable="false"
              />
            </Link>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Schedule
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <Link href="/exam" className="dropdown-item">
                  Exam
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/class" className="dropdown-item">
                  Class
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link href="/rooms" className="nav nav-link text-light">
              Rooms
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/company" className="nav nav-link text-light">
              Internship
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/quiz" className="nav nav-link text-warning fw-semibold">
              <i className="bi bi-stars me-1"></i>Quiz
            </Link>
          </li>
        </ul>

        {mounted && isAdminLoggedIn && (
          <div className="position-absolute top-50 end-0 translate-middle-y me-3 d-flex align-items-center gap-2">
            <Link
              href="/admin"
              className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 shadow-sm rounded-pill px-3"
            >
              <i className="bi bi-shield-lock-fill"></i>
              <span>Admin</span>
              {adminUser?.user_role && (
                <span
                  className="badge bg-warning text-dark ms-1"
                  style={{ fontSize: "0.65rem" }}
                >
                  {adminUser.user_role}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
        {children}
        <footer className="template-container text-white">
          <div className="row">
            <div className="col-2 col-md-6 mb-3">
              <h5 className="p-2">Section</h5>
              <ul className="nav flex-row">
                {footerRoutes.map((route) => (
                  <li key={route.href} className="nav-item mb-2">
                    <Link href={route.href} className="nav-link p-2 text-white">
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-5 offset-md-1 mb-3">
              <form onSubmit={(e) => e.preventDefault()}>
                <h5>Contact us</h5>
                <p>
                  If you want more information about our computer engineering
                </p>
                {mounted ? (
                  <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                    <label htmlFor="newsletter1" className="visually-hidden">
                      Email address
                    </label>
                    <input
                      id="newsletter1"
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      data-lpignore="true"
                      autoComplete="off"
                    />
                    <button className="btn btn-primary" type="button">
                      Send
                    </button>
                  </div>
                ) : (
                  <div style={{ minHeight: "38px" }} />
                )}
              </form>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            <p>© {currentYear} KMITL PCC All rights reserved.</p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3">
                <a className="text-white" href="#" aria-label="Instagram">
                  <svg className="bi" width="24" height="24">
                    <use xlinkHref="#instagram" />
                  </svg>
                </a>
              </li>
              <li className="ms-3">
                <a className="text-white" href="#" aria-label="Facebook">
                  <svg className="bi" width="24" height="24" aria-hidden="true">
                    <use xlinkHref="#facebook" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </body>
    </html>
  );
}
