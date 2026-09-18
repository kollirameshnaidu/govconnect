import { Card } from "@/components/common/Card";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { SITE } from "@/mock/homepage";
import { ABOUT_ROLES } from "@/mock/public-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PublicPageShell
      title="About GovConnect"
      description={`${SITE.name} is the ${SITE.fullName}. Citizens can explore offices and services without logging in. Login is required only to submit or manage personal appointment requests.`}
      breadcrumbs={[{ href: routes.about, label: "About" }]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">What this portal does</h2>
          <p className="mt-2 text-sm leading-7 text-ink">
            {SITE.name} is operated for {SITE.jurisdiction} under {SITE.authority}.
            A citizen selects a preferred date. An official reviews the request
            and assigns the confirmed date and time. The appointment ID stays the
            same if the request is transferred.
          </p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">What remains public</h2>
          <p className="mt-2 text-sm leading-7 text-ink">
            Offices, departments, announcements, guidelines, the citizen charter,
            FAQs, and tracking by appointment ID are available without an
            account. Booking, letters, and QR codes require citizen login.
          </p>
        </Card>
      </div>
      <h2 className="mt-10 text-xl font-bold text-navy-900">Who uses GovConnect</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {ABOUT_ROLES.map((role) => (
          <Card key={role.id}>
            <h3 className="font-semibold text-navy-900">{role.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{role.detail}</p>
          </Card>
        ))}
      </div>
    </PublicPageShell>
  );
}
