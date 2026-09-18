import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { DepartmentsServices } from "@/components/home/DepartmentsServices";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Departments" };

export default function DepartmentsPage() {
  return (
    <PublicPageShell
      title="Departments"
      description="Choose the department that owns your request. If the matter belongs elsewhere, an official can transfer it without changing the appointment ID."
      breadcrumbs={[{ href: routes.departments, label: "Departments" }]}
    >
      <DepartmentsServices heading={false} contained={false} showAllLink={false} />
    </PublicPageShell>
  );
}
