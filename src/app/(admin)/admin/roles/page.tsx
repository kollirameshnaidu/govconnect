import { AdminRoles } from "@/components/admin/AdminPeople";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Roles" };

export default function AdminRolesPage() {
  return <AdminRoles />;
}
