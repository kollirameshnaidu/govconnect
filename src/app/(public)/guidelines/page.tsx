import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { GUIDELINE_GROUPS } from "@/mock/public-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Guidelines" };

export default function GuidelinesPage() {
  return (
    <PublicPageShell
      title="Guidelines"
      description="Bring only documents relevant to the purpose of visit. A preferred date is not an appointment slot."
      breadcrumbs={[{ href: routes.guidelines, label: "Guidelines" }]}
    >
      <div className="grid gap-4">
        {GUIDELINE_GROUPS.map((group) => (
          <Card key={group.id}>
            <h2 className="text-lg font-semibold text-navy-900">{group.title}</h2>
            <ul className="mt-3 grid gap-3">
              {group.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
                  <Icon name="check" className="mt-0.5 text-green-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </PublicPageShell>
  );
}
