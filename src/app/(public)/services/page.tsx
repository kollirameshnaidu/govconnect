import { Button } from "@/components/common/Button";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { ServicesCatalogue } from "@/components/public/ServicesCatalogue";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <PublicPageShell
      title="Services"
      description="Browse common public services. Booking still follows office, department, category, and official selection. A preferred date is not a confirmed slot."
      breadcrumbs={[{ href: routes.services, label: "Services" }]}
      actions={<Button href={routes.bookAppointment}>Book appointment</Button>}
    >
      <ServicesCatalogue />
    </PublicPageShell>
  );
}
