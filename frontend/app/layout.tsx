"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import ce_logo from "../public/ce_logo.webp";
import { Outfit } from "next/font/google";
import { Compass } from "lucide-react";

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
];

const currentYear = new Date().getFullYear();

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [, setAdminUser] = useState<{ user_name: string; user_role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("ce50_admin_token") : null;
      const userStr = typeof window !== "undefined" ? localStorage.getItem("ce50_admin_user") : null;
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.user_id) {
            setIsAdminLoggedIn(true);
            setAdminUser(user);
            return;
          }
        } catch {
          // ignore
        }
      }
      setIsAdminLoggedIn(false);
      setAdminUser(null);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("ce50_auth_change", checkAuth);

    // @ts-expect-error Bootstrap bundle has no TypeScript declarations.
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("ce50_auth_change", checkAuth);
    };
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        {/* Desktop Navbar */}
        <div className="d-none d-lg-block bg-black position-relative border-bottom border-secondary border-opacity-25">
          {/* Left: Career Quiz Button */}
          <div className="position-absolute top-50 start-0 translate-middle-y ms-4">
            <Link
              href="/quiz"
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 fw-bold"
            >
              <Compass size={16} />
              <span>Career Quiz</span>
            </Link>
          </div>

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
          </ul>

          {mounted && isAdminLoggedIn && !pathname.startsWith("/admin") && (
            <div className="position-absolute top-50 end-0 translate-middle-y me-4">
              <Link href="/admin" className="btn btn-primary btn-sm">
                Admin
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navbar */}
        <nav className="navbar navbar-dark bg-black border-bottom border-secondary border-opacity-25 px-3 d-lg-none">
          <div className="container-fluid px-0">
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <Image
                src={ce_logo}
                alt="CE_LOGO"
                width="45"
                height="45"
                draggable="false"
              />
            </Link>

            <div className="d-flex align-items-center gap-2">
              <Link
                href="/quiz"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 fw-bold"
              >
                <Compass size={16} />
                <span>Career Quiz</span>
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mobileNavbarNav"
                aria-controls="mobileNavbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>

            <div className="collapse navbar-collapse" id="mobileNavbarNav">
              <ul className="navbar-nav pt-2">
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
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link href="/teachers" className="dropdown-item">
                        Teachers
                      </Link>
                    </li>
                    <li>
                      <Link href="/students" className="dropdown-item">
                        Students
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="/news" className="nav-link text-light">
                    News
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/projects" className="nav-link text-light">
                    Projects
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
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link href="/exam" className="dropdown-item">
                        Exam
                      </Link>
                    </li>
                    <li>
                      <Link href="/class" className="dropdown-item">
                        Class
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="/rooms" className="nav-link text-light">
                    Rooms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/company" className="nav-link text-light">
                    Internship
                  </Link>
                </li>
                {mounted && isAdminLoggedIn && !pathname.startsWith("/admin") && (
                  <li className="nav-item pt-2 border-top border-secondary border-opacity-25 mt-2">
                    <Link href="/admin" className="btn btn-primary btn-sm w-100">
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {children}
        <footer className="template-container text-white">
          <div className="row">
            <div className="col-12 col-md-6 mb-3">
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
