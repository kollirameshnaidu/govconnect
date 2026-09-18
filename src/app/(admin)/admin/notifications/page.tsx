import { AdminNotifications } from "@/components/admin/AdminOversight";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default function AdminNotificationsPage() {
  return <AdminNotifications />;
}
