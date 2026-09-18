import { Card } from "@/components/common/Card";
import { GrievanceForm } from "@/components/forms/GrievanceForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grievance" };

export default function GrievancePage() {
  return (
    <PublicPageShell
      title="Lodge a grievance"
      description="Use this channel for service delays or process issues. This is not a substitute for an appointment request."
      breadcrumbs={[{ href: routes.grievance, label: "Grievance" }]}
    >
      <Card className="max-w-xl" padding="lg">
        <GrievanceForm />
      </Card>
    </PublicPageShell>
  );
}
