import { Card } from "@/components/common/Card";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <PublicPageShell
      title="Forgot password"
      description="Enter the email on your GovConnect account. If a matching account exists, we will send a single-use reset link."
      breadcrumbs={[{ href: routes.forgotPassword, label: "Forgot password" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <ForgotPasswordForm />
      </Card>
    </PublicPageShell>
  );
}
