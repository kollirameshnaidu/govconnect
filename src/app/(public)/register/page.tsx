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
      description="Create a citizen profile to submit appointment requests. You can still browse offices, departments, and announcements without an account."
      breadcrumbs={[{ href: routes.register, label: "Register" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <CitizenRegisterForm />
      </Card>
    </PublicPageShell>
  );
}
