import { Button } from "@/components/common/Button";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { AppointmentJourney } from "@/components/home/AppointmentJourney";
import { HowItWorks } from "@/components/home/HowItWorks";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How it works" };

export default function HowItWorksPage() {
  return (
    <>
      <PublicPageShell
        title="How it works"
        description="Submit a request with a preferred date. An official reviews availability and assigns the confirmed appointment date and time."
        breadcrumbs={[{ href: routes.howItWorks, label: "How it works" }]}
        actions={<Button href={routes.bookAppointment}>Book appointment</Button>}
      >
        <HowItWorks heading={false} contained={false} />
      </PublicPageShell>
      <AppointmentJourney />
    </>
  );
}
