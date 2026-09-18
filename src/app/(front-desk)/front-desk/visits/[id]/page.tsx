import { FrontDeskVisitDetail } from "@/components/frontdesk/FrontDeskVisitDetail";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/front-desk/visits/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: id };
}

export default async function FrontDeskVisitPage({
  params,
}: PageProps<"/front-desk/visits/[id]">) {
  const { id } = await params;
  return <FrontDeskVisitDetail appointmentId={id} />;
}
