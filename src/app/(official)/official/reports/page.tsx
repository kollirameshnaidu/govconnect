import { OfficialReports } from "@/components/official/OfficialReports";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default function OfficialReportsPage() {
  return <OfficialReports />;
}
