import { AdminSla } from "@/components/admin/AdminOperations";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SLA" };

export default function AdminSlaPage() {
  return <AdminSla />;
}
