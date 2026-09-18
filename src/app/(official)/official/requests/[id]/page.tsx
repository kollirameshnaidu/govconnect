import { OfficialRequestDetail } from "@/components/official/OfficialRequestDetail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/official/requests/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: id };
}

export default async function OfficialRequestPage({
  params,
}: PageProps<"/official/requests/[id]">) {
  const { id } = await params;
  return <OfficialRequestDetail appointmentId={id} />;
}
