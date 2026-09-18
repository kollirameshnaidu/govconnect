import { Card } from "@/components/common/Card";
import { AdminLoginForm } from "@/components/forms/AdminLoginForm";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign-in",
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : undefined;

  return (
    <PublicPageShell
      title="Admin sign-in"
      description="Maintain offices, departments, categories, officials, slot templates, holidays, SLA, escalation, reports, and audit. Administrators cannot assign a confirmed date and time. A preferred date stays a request."
      breadcrumbs={[{ href: routes.adminLogin, label: "Admin sign-in" }]}
    >
      <Card className="mx-auto max-w-md" padding="lg">
        <AdminLoginForm heading="Log in with staff ID" nextPath={nextPath} />
      </Card>
    </PublicPageShell>
  );
}
