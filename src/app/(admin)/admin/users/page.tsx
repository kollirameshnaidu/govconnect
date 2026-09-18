import { AdminUsers } from "@/components/admin/AdminPeople";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return <AdminUsers />;
}
