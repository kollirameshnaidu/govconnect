import { Card } from "@/components/common/Card";
import { CitizenLoginForm } from "@/components/forms/CitizenLoginForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citizen login",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const intent = typeof params.intent === "string" ? params.intent : undefined;
  const nextPath = typeof params.next === "string" ? params.next : undefined;

  return (
    <PublicPageShell
      title="Citizen login"
      description="Log in to book an appointment, confirm a scheduled slot, or manage your requests. Public information remains available without login."
      breadcrumbs={[{ href: routes.login, label: "Login" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <CitizenLoginForm
          heading="Log in with mobile OTP"
          intent={intent}
          nextPath={nextPath}
        />
      </Card>
    </PublicPageShell>
  );
}
