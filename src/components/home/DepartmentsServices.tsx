import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Icon, type IconName } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { DEPARTMENTS } from "@/mock/homepage";

type DepartmentsServicesProps = {
  heading?: boolean;
  contained?: boolean;
  showAllLink?: boolean;
};

export function DepartmentsServices({
  heading = true,
  contained = true,
  showAllLink = true,
}: DepartmentsServicesProps) {
  return (
    <SectionFrame contained={contained}>
      {heading ? (
        <SectionHeading
          eyebrow="Departments & services"
          title="Choose the department that owns your request"
          description="If the request belongs elsewhere, an official can transfer it without changing the appointment ID."
          href={showAllLink ? routes.departments : undefined}
          actionLabel={showAllLink ? "Browse departments" : undefined}
        />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEPARTMENTS.map((department) => (
          <Link key={department.id} href={routes.department(department.id)}>
            <Card className="h-full hover:border-navy-700">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-saffron-50 text-saffron-600">
                <Icon name={department.icon as IconName} />
              </span>
              <h3 className="text-lg font-semibold text-navy-900">{department.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{department.summary}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-navy-700">
                {department.serviceCount} services
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionFrame>
  );
}
