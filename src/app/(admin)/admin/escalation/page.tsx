import { AdminEscalation } from "@/components/admin/AdminOperations";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Escalation" };

export default function AdminEscalationPage() {
  return <AdminEscalation />;
}
