import { AdminSettingsForm } from "@/components/admin/AdminOversight";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return <AdminSettingsForm />;
}
