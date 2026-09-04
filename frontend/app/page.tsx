"use client";

import { useState, useEffect } from "react";

type Students = {
  student_id: number;
  student_firstname: string;
  student_lastname: string;
  image: string;
  role: string;
  lineage: string;
  contact: string;
  instagram: string;
  created_at: string;
}

export default function Home() {

  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
    async function getStudent() {
      const response = await fetch("http://localhost:8000/students")
      const result = await response.json()
      setStudents(result)
    }

    getStudent();
  }, []); //dependency array shit

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Firstname</th><th>Lastname</th></tr></thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.student_id}</td><td>{student.student_firstname}</td><td>{student.student_lastname}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

{ /*
  //code example: fetch data -> put it in list -> display it
  "use client";
  import { useEffect, useState } from "react";

  type User = { id: number; name: string; email: string };

  export default function Users() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
      fetch("http://localhost:8000/users")
        .then((response) => response.json())
        .then(setUsers);
    }, []);

    return (
      <div className="container py-4">
        <table className="table table-striped">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td><td>{user.name}</td><td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  */}
