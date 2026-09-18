import { Card } from "@/components/common/Card";
import { OfficialLoginForm } from "@/components/forms/OfficialLoginForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official sign-in",
};

export default async function OfficialLoginPage({
  searchParams,
}: PageProps<"/official/login">) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : undefined;

  return (
    <PublicPageShell
      title="Official sign-in"
      description="Revenue, welfare, and other desk officers review requests and assign a confirmed date and time. A citizen’s preferred date is never treated as a reserved slot."
      breadcrumbs={[{ href: routes.officialLogin, label: "Official sign-in" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <OfficialLoginForm heading="Log in with staff ID" nextPath={nextPath} />
      </Card>
    </PublicPageShell>
  );
}
