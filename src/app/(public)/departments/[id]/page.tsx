import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { DEPARTMENTS } from "@/mock/homepage";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficesByIds, getServicesForDepartment } from "@/services/officeService";
import type { Metadata } from "next";

export function generateStaticParams() {
  return DEPARTMENTS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/departments/[id]">): Promise<Metadata> {
  const { id } = await params;
  const department = getDepartmentById(id);
  return { title: department?.name ?? "Department" };
}

export default async function DepartmentDetailPage({
  params,
}: PageProps<"/departments/[id]">) {
  const { id } = await params;
  const department = getDepartmentById(id);
  if (!department) notFound();

  const offices = getOfficesByIds(department.officeIds);
  const services = getServicesForDepartment(department.id);

  return (
    <PublicPageShell
      title={department.name}
      description={department.summary}
      breadcrumbs={[
        { href: routes.departments, label: "Departments" },
        { label: department.name },
      ]}
      actions={<Button href={routes.bookAppointment}>Book appointment</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <Badge>{department.serviceCount} services</Badge>
          <h2 className="mt-4 text-lg font-semibold text-navy-900">Categories</h2>
          <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-ink">
            {department.categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
          {services.length > 0 ? (
            <>
              <h2 className="mt-6 text-lg font-semibold text-navy-900">Related services</h2>
              <ul className="mt-2 grid gap-2 text-sm">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={routes.services} className="font-medium text-navy-700">
                      {service.name}
                    </Link>
                    <span className="text-muted"> — {service.description}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Offices</h2>
          <ul className="mt-3 grid gap-3 text-sm">
            {offices.map((office) => (
              <li key={office.id}>
                <Link href={routes.office(office.id)} className="font-semibold text-navy-800">
                  {office.name}
                </Link>
                <p className="text-muted">{office.district}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-muted">
            If this department is not the right owner, the official can transfer
            the request. The appointment ID does not change.
          </p>
        </Card>
      </div>
    </PublicPageShell>
  );
}
