import { AdminReports } from "@/components/admin/AdminOversight";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return <AdminReports />;
}
