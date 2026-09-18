import { CitizenDashboard } from "@/components/citizen/CitizenDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Citizen dashboard" };

export default function CitizenDashboardPage() {
  return <CitizenDashboard />;
}
