import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { FindOffice } from "@/components/home/FindOffice";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offices" };

export default function OfficesPage() {
  return (
    <PublicPageShell
      title="Government offices"
      description="Search by office name or district before you submit a request. Booking still requires login."
      breadcrumbs={[{ href: routes.offices, label: "Offices" }]}
    >
      <FindOffice heading={false} contained={false} />
    </PublicPageShell>
  );
}
