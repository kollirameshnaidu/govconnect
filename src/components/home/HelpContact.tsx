import { Card } from "@/components/common/Card";
import { Icon, type IconName } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { SITE } from "@/mock/homepage";

export const CONTACT_CHANNELS = [
  {
    id: "helpline",
    title: "Helpline",
    value: SITE.helpline,
    detail: SITE.hours,
    icon: "phone" as IconName,
    href: `tel:${SITE.helpline}`,
  },
  {
    id: "email",
    title: "Email support",
    value: SITE.email,
    detail: "Response within one working day",
    icon: "mail" as IconName,
    href: `mailto:${SITE.email}`,
  },
  {
    id: "grievance",
    title: "Grievance",
    value: "Lodge a service complaint",
    detail: "Use the public grievance form",
    icon: "help" as IconName,
    href: routes.grievance,
  },
];

type HelpContactProps = {
  heading?: boolean;
  contained?: boolean;
  showAllLink?: boolean;
};

export function HelpContact({
  heading = true,
  contained = true,
  showAllLink = true,
}: HelpContactProps) {
  return (
    <SectionFrame contained={contained} className={contained ? "bg-white" : undefined}>
      {heading ? (
        <SectionHeading
          eyebrow="Help / Contact"
          title="Need assistance?"
          description="Helpline staff can explain the process. They cannot confirm an appointment slot on behalf of an official."
          href={showAllLink ? routes.contact : undefined}
          actionLabel={showAllLink ? "Contact page" : undefined}
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {CONTACT_CHANNELS.map((item) => (
          <a key={item.id} href={item.href} className="block">
            <Card className="h-full hover:border-navy-700">
              <Icon name={item.icon} className="text-navy-800" />
              <h3 className="mt-4 font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-1 text-sm font-medium text-ink">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </Card>
          </a>
        ))}
      </div>
    </SectionFrame>
  );
}
