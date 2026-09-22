import { Card } from "@/components/common/Card";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <PublicPageShell
      title="Reset password"
      description="Choose a new password for your GovConnect account. The link from your email can be used only once."
      breadcrumbs={[{ href: routes.resetPassword, label: "Reset password" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <ResetPasswordForm token={token} />
      </Card>
    </PublicPageShell>
  );
}
