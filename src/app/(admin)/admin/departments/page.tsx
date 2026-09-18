import { AdminDepartments } from "@/components/admin/AdminMasterData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Departments" };

export default function AdminDepartmentsPage() {
  return <AdminDepartments />;
}
