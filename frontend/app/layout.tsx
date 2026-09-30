"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";
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
];

const currentYear = new Date().getFullYear();

export default function RootLayout({ children }: LayoutProps<"/">) {
  useEffect(() => {
    // @ts-expect-error Bootstrap bundle has no TypeScript declarations.
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body className={outfit.className}>
        <header className="sticky top-3 z-50 px-2 px-md-3 w-100 d-flex justify-content-center pointer-events-none mb-2">
          <nav className="pointer-events-auto bg-black/80 backdrop-blur-md border border-white/15 rounded-4 rounded-md-pill px-3 py-1 shadow-2xl transition-all duration-300 max-w-[95vw]">
            <ul className="nav justify-content-center align-items-center flex-wrap mb-0 gap-1">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-light px-2 py-1.5"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  People
                </a>
                <ul className="dropdown-menu dropdown-menu-dark shadow-lg">
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
                <Link href="/news" className="nav-link text-light px-2 py-1.5">
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/projects" className="nav-link text-light px-2 py-1.5">
                  Projects
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link href="/" className="nav-link p-1 d-flex align-items-center">
                  <Image
                    src={ce_logo}
                    alt="CE_LOGO"
                    width={38}
                    height={38}
                    draggable="false"
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-light px-2 py-1.5"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Schedule
                </a>
                <ul className="dropdown-menu dropdown-menu-dark shadow-lg">
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
                <Link href="/rooms" className="nav-link text-light px-2 py-1.5">
                  Rooms
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/company" className="nav-link text-light px-2 py-1.5">
                  Internship
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow-1 w-100">{children}</main>
        <footer className="template-container text-white">
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <h5 className="p-2">Section</h5>
              <ul className="nav flex-row flex-wrap">
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
              <form>
                <h5>Contact us</h5>
                <p>
                  If you want more information about our computer engineering
                </p>
                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                  <label htmlFor="newsletter1" className="visually-hidden">
                    Email address
                  </label>
                  <input
                    id="newsletter1"
                    type="email"
                    className="form-control"
                    placeholder="Email address"
                  />
                  <button className="btn btn-primary" type="button">
                    Send
                  </button>
                </div>
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
