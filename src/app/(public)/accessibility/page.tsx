import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { ACCESSIBILITY_MEASURES } from "@/mock/public-content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <PublicPageShell
      title="Accessibility"
      description="GovConnect aims to meet WCAG 2.2 AA for public citizen pages. Use skip to content, text size, and high contrast controls in the utility bar."
      breadcrumbs={[{ href: routes.accessibility, label: "Accessibility" }]}
    >
      <Card className="max-w-3xl">
        <ul className="grid gap-3">
          {ACCESSIBILITY_MEASURES.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-6 text-ink">
              <Icon name="check" className="mt-0.5 text-green-700" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </PublicPageShell>
  );
}
