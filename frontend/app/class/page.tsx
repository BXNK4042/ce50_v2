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
    <div className="template-container">
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ตารางเรียน</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="table-responsive">
        <table className="table table-light table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Teacher ID</th>
              <th>Room ID</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classSchedule) => (
              <tr key={classSchedule.class_id}>
                <td>{classSchedule.class_id}</td>
                <td>{classSchedule.class_name}</td>
                <td>{classSchedule.class_description}</td>
                <td>{classSchedule.teacher_id}</td>
                <td>{classSchedule.room_id}</td>
                <td>{classSchedule.class_day}</td>
                <td>{classSchedule.class_start}</td>
                <td>{classSchedule.class_end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
