import { OfficialDashboard } from "@/components/official/OfficialDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Official dashboard" };

export default function OfficialDashboardPage() {
  return <OfficialDashboard />;
}
