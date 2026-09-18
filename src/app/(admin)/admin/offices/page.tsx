import { AdminOffices } from "@/components/admin/AdminMasterData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offices" };

export default function AdminOfficesPage() {
  return <AdminOffices />;
}
