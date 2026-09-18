import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { CitizenCharter } from "@/components/home/CitizenCharter";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Citizen charter" };

export default function CitizenCharterPage() {
  return (
    <PublicPageShell
      title="Citizen charter"
      description="Published service commitments, including the 48-hour review SLA and the distinction between preferred date and confirmed slot."
      breadcrumbs={[{ href: routes.citizenCharter, label: "Citizen charter" }]}
    >
      <CitizenCharter heading={false} contained={false} showAllLink={false} />
    </PublicPageShell>
  );
}
