import { CitizenAppointmentQr } from "@/components/citizen/CitizenAppointmentQr";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/citizen/appointments/[id]/qr">): Promise<Metadata> {
  const { id } = await params;
  return { title: `QR ${id}` };
}

export default async function CitizenQrPage({
  params,
}: PageProps<"/citizen/appointments/[id]/qr">) {
  const { id } = await params;
  return <CitizenAppointmentQr appointmentId={id} />;
}
