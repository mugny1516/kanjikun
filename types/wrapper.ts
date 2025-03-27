import { Database } from "./database";

export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type DateOption = Database["public"]["Tables"]["date_options"]["Row"];
export type AttendanceWithAvailabilities =
  Database["public"]["Tables"]["attendances"]["Row"] & {
    attendance_availabilities: Database["public"]["Tables"]["attendance_availabilities"]["Row"][];
  };
export type GroupWithDetails = Group & {
  date_options: DateOption[];
  attendancesWithAvailabilities: AttendanceWithAvailabilities[];
};
