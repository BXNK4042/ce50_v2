export type ClassSchedules = {
  class_id: number;
  teacher_id: number;
  class_name: string;
  room_id: number;
  class_description: string;
  class_day: string;
  class_start: string;
  class_end: string;
  generation?: string;
  semester?: number;
  created_at: string;
};
