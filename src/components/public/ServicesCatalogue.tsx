import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Icon, type IconName } from "@/components/common/Icon";
import { routes } from "@/constants/routes";
import { QUICK_SERVICES } from "@/mock/homepage";

export function ServicesCatalogue() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {QUICK_SERVICES.map((service) => (
        <Card key={service.id} className="h-full">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50 text-navy-800">
              <Icon name={service.icon as IconName} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-navy-900">{service.name}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{service.description}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-navy-700">
                Typical documents
              </p>
              <ul className="mt-1 list-disc pl-4 text-sm text-ink">
                {service.documents.map((document) => (
                  <li key={document}>{document}</li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="mt-3 inline-flex text-sm font-semibold text-navy-700 hover:text-saffron-600"
              >
                Open {service.name} department
              </Link>
              <span className="mx-2 text-muted">·</span>
              <Link
                href={routes.bookAppointment}
                className="text-sm font-semibold text-saffron-600 hover:text-saffron-500"
              >
                Book appointment
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
