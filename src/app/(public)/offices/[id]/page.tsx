import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { OFFICES } from "@/mock/homepage";
import { getDepartmentsForOffice, getOfficeById } from "@/services/officeService";
import type { Metadata } from "next";

export function generateStaticParams() {
  return OFFICES.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/offices/[id]">): Promise<Metadata> {
  const { id } = await params;
  const office = getOfficeById(id);
  return { title: office?.name ?? "Office" };
}

export default async function OfficeDetailPage({
  params,
}: PageProps<"/offices/[id]">) {
  const { id } = await params;
  const office = getOfficeById(id);
  if (!office) notFound();
  const departments = getDepartmentsForOffice(office);

  return (
    <PublicPageShell
      title={office.name}
      description={office.address}
      breadcrumbs={[
        { href: routes.offices, label: "Offices" },
        { label: office.name },
      ]}
      actions={<Button href={routes.bookAppointment}>Book appointment</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Visit details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-muted">District</dt>
              <dd className="font-medium text-ink">{office.district}</dd>
            </div>
            <div>
              <dt className="text-muted">Hours</dt>
              <dd className="font-medium text-ink">{office.hours}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium text-ink">{office.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-medium text-ink">{office.email}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Departments at this office</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {departments.map((department) => (
              <li key={department.id}>
                <Link href={routes.department(department.id)} className="font-semibold text-navy-800">
                  {department.name}
                </Link>
                <p className="text-muted">{department.summary}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PublicPageShell>
  );
}
