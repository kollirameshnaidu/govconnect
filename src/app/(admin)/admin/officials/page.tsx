import { AdminOfficials } from "@/components/admin/AdminMasterData";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Officials" };

export default function AdminOfficialsPage() {
  return <AdminOfficials />;
}
