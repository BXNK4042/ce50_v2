import Link from "next/link"

export default function Home() {
  return (<div>
    <h1>CE50</h1>
    <Link href="/class" className="btn btn-primary">Class</Link>
    <Link href="/exam" className="btn btn-primary">Exam</Link>
    <Link href="/internship" className="btn btn-primary">Internship</Link>
    <Link href="/news" className="btn btn-primary">News</Link>
    <Link href="/projects" className="btn btn-primary">Projects</Link>
    <Link href="/rooms" className="btn btn-primary">Rooms</Link>
    <Link href="/students" className="btn btn-primary">Students</Link>
    <Link href="/teachers" className="btn btn-primary">Teachers</Link>
  </div>)
}
