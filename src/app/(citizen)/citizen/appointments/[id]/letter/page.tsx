import { CitizenAppointmentLetter } from "@/components/citizen/CitizenAppointmentLetter";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/citizen/appointments/[id]/letter">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Letter ${id}` };
}

export default async function CitizenLetterPage({
  params,
}: PageProps<"/citizen/appointments/[id]/letter">) {
  const { id } = await params;
  return <CitizenAppointmentLetter appointmentId={id} />;
}
