import { Card } from "@/components/common/Card";
import { ConfirmEmailForm } from "@/components/forms/ConfirmEmailForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm email",
};

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <PublicPageShell
      title="Confirm email address"
      description="Finish creating your citizen account by confirming the email address you registered with."
      breadcrumbs={[{ href: routes.confirmEmail, label: "Confirm email" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <ConfirmEmailForm token={token} />
      </Card>
    </PublicPageShell>
  );
}
