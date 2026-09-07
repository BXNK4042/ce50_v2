"use client";

import { useEffect, useState } from "react";
import { Projects } from "@/types/project";
import Image from "next/image";

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
      {/*
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.project_id}>
                <td>{project.project_id}</td>
                <td>{project.project_name}</td>
                <td>{project.project_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      */}
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">โครงงาน</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="row rows-cols-1 row-cols-md-3 g-4">
        {projects.map((project) => {
          const modalId = `project-${project.project_id}-modal`;

          return (
            <div className="col" key={project.project_id}>
              <div className="card bg-black ">
                <Image
                  src={`http://localhost:8000/uploads/projects/${project.project_image}`}
                  alt={project.project_name}
                  width={1000}
                  height={1000}
                  draggable="false"
                  className="card-img-top hover:opacity-70 duration-150"
                  data-bs-toggle="modal"
                  data-bs-target={`#${modalId}`}
                />
              </div>
              <div
                className="modal fade"
                id={modalId}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <p className="modal-title fs-5" id="exampleModalLabel">
                        {project.project_name}
                      </p>
                    </div>
                    <div className="modal-body">
                      <p>{project.project_description}</p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
