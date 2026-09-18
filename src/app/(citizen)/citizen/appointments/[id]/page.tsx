import { CitizenAppointmentDetail } from "@/components/citizen/CitizenAppointmentDetail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/citizen/appointments/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: id };
}

export default async function CitizenAppointmentPage({
  params,
}: PageProps<"/citizen/appointments/[id]">) {
  const { id } = await params;
  return <CitizenAppointmentDetail appointmentId={id} />;
}
