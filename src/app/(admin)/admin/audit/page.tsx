import { AdminAudit } from "@/components/admin/AdminOversight";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Audit" };

export default function AdminAuditPage() {
  return <AdminAudit />;
}
