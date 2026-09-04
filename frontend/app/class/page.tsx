"use client";

import { useEffect, useState } from "react";
import { ClassSchedules } from "@/types/class-schedule";

export default function ClassPage() {
  const [classes, setClasses] = useState<ClassSchedules[]>([]);

  useEffect(() => {
    async function getClasses() {
      const response = await fetch("http://localhost:8000/class");
      setClasses(await response.json());
    }

    getClasses();
  }, []);

  return (
    <div className="container py-4">
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Name</th><th>Day</th><th>Start</th><th>End</th></tr></thead>
        <tbody>
          {classes.map((classSchedule) => (
            <tr key={classSchedule.class_id}>
              <td>{classSchedule.class_id}</td><td>{classSchedule.class_name}</td><td>{classSchedule.class_day}</td><td>{classSchedule.class_start}</td><td>{classSchedule.class_end}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
