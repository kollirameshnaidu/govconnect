import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { CHARTER_ITEMS } from "@/mock/homepage";

type CitizenCharterProps = {
  heading?: boolean;
  contained?: boolean;
  showAllLink?: boolean;
};

export function CitizenCharter({
  heading = true,
  contained = true,
  showAllLink = true,
}: CitizenCharterProps) {
  return (
    <SectionFrame contained={contained} className={contained ? "bg-white" : undefined}>
      {heading ? (
        <SectionHeading
          eyebrow="Citizen charter"
          title="Service commitments"
          description="GovConnect publishes review timelines and clearly separates preferred dates from confirmed appointments."
          href={showAllLink ? routes.citizenCharter : undefined}
          actionLabel={showAllLink ? "Read the charter" : undefined}
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {CHARTER_ITEMS.map((item) => (
          <Card key={item.id} className="flex gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
              <Icon name="check" />
            </span>
            <div>
              <h3 className="font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
