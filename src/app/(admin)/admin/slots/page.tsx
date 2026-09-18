import { AdminSlots } from "@/components/admin/AdminOperations";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Slots" };

export default function AdminSlotsPage() {
  return <AdminSlots />;
}
