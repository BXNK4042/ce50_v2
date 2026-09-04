"use client"

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import ce_logo from "../public/ce_logo.webp"

export default function RootLayout({ children }: LayoutProps<"/">) {
  useEffect(() => {
    // @ts-expect-error Bootstrap bundle has no TypeScript declarations.
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body>
        <ul className="nav justify-content-center bg-black align-items-center">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              People
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <Link href="/teachers" className="dropdown-item">Teachers</Link>
              </li>
              <li className="nav-item">
                <Link href="/students" className="dropdown-item">Students</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link href="/news" className="nav nav-link text-light">News</Link>
          </li>
          <li className="nav-item">
            <Link href="/projects" className="nav nav-link text-light">Projects</Link>
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
            <a className="nav-link dropdown-toggle text-light" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Schedule
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item">
                <Link href="/exam" className="dropdown-item">Exam</Link>
              </li>
              <li className="nav-item">
                <Link href="/class" className="dropdown-item">Class</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link href="/rooms" className="nav nav-link text-light">Rooms</Link>
          </li>
          <li className="nav-item">
            <Link href="/internship" className="nav nav-link text-light">Internship</Link>
          </li>
        </ul>
        {children}
      </body>
    </html>
  );
}
