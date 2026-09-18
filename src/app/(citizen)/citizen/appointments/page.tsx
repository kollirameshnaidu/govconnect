import { CitizenAppointmentList } from "@/components/citizen/CitizenAppointmentList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My appointments" };

export default function CitizenAppointmentsPage() {
  return <CitizenAppointmentList />;
}
