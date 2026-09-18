import { AdminHolidays } from "@/components/admin/AdminOperations";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Holidays" };

export default function AdminHolidaysPage() {
  return <AdminHolidays />;
}
