import { OfficialMeeting } from "@/components/official/OfficialMeeting";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/official/meetings/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Meeting ${id}` };
}

export default async function OfficialMeetingPage({
  params,
}: PageProps<"/official/meetings/[id]">) {
  const { id } = await params;
  return <OfficialMeeting appointmentId={id} />;
}
