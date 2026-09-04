"use client";

import { useEffect, useState } from "react";
import { Projects } from "@/types/project";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Projects[]>([]);

  useEffect(() => {
    async function getProjects() {
      const response = await fetch("http://localhost:8000/projects");
      setProjects(await response.json());
    }

    getProjects();
  }, []);

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Name</th><th>Description</th></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              <td>{project.project_id}</td><td>{project.project_name}</td><td>{project.project_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
