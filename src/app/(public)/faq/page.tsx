import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { FaqSection } from "@/components/home/FaqSection";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <PublicPageShell
      title="Frequently asked questions"
      description="Answers about login, preferred dates, tracking, transfers, documents, and office visits."
      breadcrumbs={[{ href: routes.faq, label: "FAQ" }]}
    >
      <FaqSection heading={false} contained={false} showAllLink={false} />
    </PublicPageShell>
  );
}
