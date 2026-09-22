import { Card } from "@/components/common/Card";
import { CitizenRegisterForm } from "@/components/forms/CitizenRegisterForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citizen registration",
};

export default function RegisterPage() {
  return (
    <PublicPageShell
      title="Register as a citizen"
      description="Create a citizen account with email and password. We will send a confirmation link to your email address."
      breadcrumbs={[{ href: routes.register, label: "Register" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <CitizenRegisterForm />
      </Card>
    </PublicPageShell>
  );
}
