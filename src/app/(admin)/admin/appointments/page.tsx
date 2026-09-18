import { AdminAppointments } from "@/components/admin/AdminOperations";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Appointments" };

export default function AdminAppointmentsPage() {
  return <AdminAppointments />;
}
