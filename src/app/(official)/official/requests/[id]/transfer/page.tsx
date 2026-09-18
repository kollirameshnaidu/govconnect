import { OfficialTransferForm } from "@/components/official/OfficialTransferForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Transfer request" };

export default async function OfficialTransferPage({
  params,
}: PageProps<"/official/requests/[id]/transfer">) {
  const { id } = await params;
  return <OfficialTransferForm appointmentId={id} />;
}
