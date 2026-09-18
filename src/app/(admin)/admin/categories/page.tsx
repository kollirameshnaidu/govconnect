import { AdminCategories } from "@/components/admin/AdminMasterData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <AdminCategories />;
}
