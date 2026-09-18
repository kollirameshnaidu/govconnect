import { Card } from "@/components/common/Card";
import { FrontDeskLoginForm } from "@/components/forms/FrontDeskLoginForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Front desk sign-in",
};

export default async function FrontDeskLoginPage({
  searchParams,
}: PageProps<"/front-desk/login">) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : undefined;

  return (
    <PublicPageShell
      title="Front desk sign-in"
      description="Verify visitors, check in confirmed appointments, manage the waiting queue, and record a no-show. Front desk cannot assign a confirmed date and time. Search by appointment ID if a visit token cannot be scanned."
      breadcrumbs={[{ href: routes.frontDeskLogin, label: "Front desk sign-in" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <FrontDeskLoginForm heading="Log in with staff ID" nextPath={nextPath} />
      </Card>
    </PublicPageShell>
  );
}
