import { CitizenAppointmentTrack } from "@/components/citizen/CitizenAppointmentTrack";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/citizen/appointments/[id]/track">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Track ${id}` };
}

export default async function CitizenTrackPage({
  params,
}: PageProps<"/citizen/appointments/[id]/track">) {
  const { id } = await params;
  return <CitizenAppointmentTrack appointmentId={id} />;
}
