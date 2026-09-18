import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Icon, type IconName } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { QUICK_SERVICES } from "@/mock/homepage";

type QuickServicesProps = {
  heading?: boolean;
  contained?: boolean;
  showAllLink?: boolean;
};

export function QuickServices({
  heading = true,
  contained = true,
  showAllLink = true,
}: QuickServicesProps) {
  return (
    <SectionFrame contained={contained}>
      {heading ? (
        <SectionHeading
          eyebrow="Quick services"
          title="Common government services"
          description="Start from a service category. You still choose office, department, and official before submitting a request."
          href={showAllLink ? routes.services : undefined}
          actionLabel={showAllLink ? "View all services" : undefined}
        />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_SERVICES.map((service) => (
          <Link key={service.id} href={service.href} className="block h-full">
            <Card className="h-full transition-colors hover:border-navy-700">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md bg-navy-50 text-navy-800">
                <Icon name={service.icon as IconName} />
              </span>
              <h3 className="text-base font-semibold text-navy-900">{service.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{service.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </SectionFrame>
  );
}
