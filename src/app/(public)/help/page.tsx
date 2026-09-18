import { HelpContact } from "@/components/home/HelpContact";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { HelpTopics } from "@/components/public/HelpTopics";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <PublicPageShell
      title="Help centre"
      description="Find guidance for booking, tracking, documents, and office visits. Helpline staff cannot assign a confirmed appointment slot."
      breadcrumbs={[{ href: routes.help, label: "Help" }]}
    >
      <HelpTopics />
      <div className="mt-10">
        <HelpContact heading={false} contained={false} showAllLink={false} />
      </div>
    </PublicPageShell>
  );
}
