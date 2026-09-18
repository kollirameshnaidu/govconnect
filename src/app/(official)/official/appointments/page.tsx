import { OfficialAppointmentList } from "@/components/official/OfficialAppointmentList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Appointments" };

export default function OfficialAppointmentsPage() {
  return <OfficialAppointmentList />;
}
