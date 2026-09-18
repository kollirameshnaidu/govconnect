import { OfficialRequestList } from "@/components/official/OfficialRequestList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Requests" };

export default function OfficialRequestsPage() {
  return <OfficialRequestList />;
}
