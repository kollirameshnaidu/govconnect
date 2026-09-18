import { FrontDeskDashboard } from "@/components/frontdesk/FrontDeskDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Front desk dashboard" };

export default function FrontDeskDashboardPage() {
  return <FrontDeskDashboard />;
}
