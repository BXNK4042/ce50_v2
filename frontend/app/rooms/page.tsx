"use client";

import { useEffect, useState } from "react";
import { Rooms } from "@/types/room";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Rooms[]>([]);

  useEffect(() => {
    async function getRooms() {
      const response = await fetch("http://localhost:8000/rooms");
      setRooms(await response.json());
    }

    getRooms();
  }, []);

  return (
    <div className="template-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.room_id}>
              <td>{room.room_id}</td>
              <td>{room.room_name}</td>
              <td>{room.room_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
