"use client";

import { Check } from "lucide-react";

export interface ScheduleFilterProps {
  availableGens: string[];
  selectedGen: string;
  onSelectGen: (gen: string) => void;
  selectedSemester: number | "All";
  onSelectSemester: (sem: number | "All") => void;
  totalItems: number;
  itemTypeLabel?: string; // e.g. 'ตารางเรียน' or 'ตารางสอบ'
}

export default function ScheduleFilter({
  availableGens,
  selectedGen,
  onSelectGen,
  selectedSemester,
  onSelectSemester,
  itemTypeLabel = "ตาราง",
}: ScheduleFilterProps) {
  const semesterOptions: (number | "All")[] = [1, 2, "All"];

  return (
    <div className="schedule-filter-wrapper mb-4">
      <div className="text-white">
        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-2">
              เลือกรุ่น:
            </span>
            <div className="btn-group flex-wrap" role="group" aria-label="เลือกรุ่น">
              {availableGens.map((gen) => (
                <button
                  key={gen}
                  type="button"
                  className={`btn ${
                    selectedGen === gen
                      ? "btn-primary text-white fw-bold shadow-sm"
                      : "btn-dark text-light border-secondary"
                  }`}
                  onClick={() => onSelectGen(gen)}
                >
                  {selectedGen === gen && <Check size={14} className="me-1 inline" />}
                  {gen === "All" ? "ทุกรุ่น (All)" : `รุ่น ${gen}`}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <span className="text-secondary small fw-bold text-uppercase d-block mb-2">
              ภาคเรียน:
            </span>
            <div className="btn-group flex-wrap" role="group" aria-label="ภาคเรียน">
              {semesterOptions.map((sem) => (
                <button
                  key={sem}
                  type="button"
                  className={`btn ${
                    selectedSemester === sem
                      ? "btn-primary text-white fw-bold shadow-sm"
                      : "btn-dark text-light border-secondary"
                  }`}
                  onClick={() => onSelectSemester(sem)}
                >
                  {selectedSemester === sem && <Check size={14} className="me-1 inline" />}
                  {sem === "All" ? "ทุกเทอม" : `เทอม ${sem}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
