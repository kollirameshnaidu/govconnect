import { TrackAppointment } from "@/components/home/TrackAppointment";
import { Button } from "@/components/common/Button";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track appointment" };

export default async function TrackPage({
  searchParams,
}: PageProps<"/track">) {
  const params = await searchParams;
  const initialId = typeof params.id === "string" ? params.id : "";
  const initialMobile = typeof params.mobile === "string" ? params.mobile : "";

  return (
    <PublicPageShell
      title="Track appointment"
      description="Enter the appointment ID and the registered mobile number. Seeded demo IDs need the mobile recorded on that request. Login is only required for personal actions such as confirmation or document download."
      breadcrumbs={[{ href: routes.track, label: "Track" }]}
      actions={<Button href={routes.login}>Login if this is your request</Button>}
    >
      <TrackAppointment
        heading={false}
        contained={false}
        initialId={initialId}
        initialMobile={initialMobile}
      />
    </PublicPageShell>
  );
}
