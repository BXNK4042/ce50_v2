"use client";

import { useEffect, useState } from "react";
import { Rooms } from "@/types/room";
import Image from "next/image";

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
            {rooms.map((room) => (
              <tr key={room.room_id}>
                <td>{room.room_id}</td>
                <td>{room.room_name}</td>
                <td>{room.room_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      */}
      <div className="mt-5 mb-5">
        <h1 className="text-white">วิศวกรรมคอมพิวเตอร์</h1>
        <h1 className="text-primary">ห้องเรียนและอื่นๆ</h1>
        <div className="bg-blue-500 w-20 h-1"></div>
      </div>
      <div className="row rows-cols-1 row-cols-md-3 g-4">
        {rooms.map((room) => {
          const modalId = `room-${room.room_id}-modal`;

          return (
            <div className="col" key={room.room_id}>
              <div className="card bg-black ">
                <Image
                  src={`http://localhost:8000/uploads/rooms/${room.room_name}.png`}
                  alt={room.room_name}
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
                        {room.room_name}
                      </p>
                    </div>
                    <div className="modal-body">
                      <p>{room.room_description}</p>
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
