import { Card } from "@/components/common/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { HelpContact } from "@/components/home/HelpContact";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PublicPageShell
      title="Contact us"
      description="Call, email, or send a message. This channel cannot confirm an appointment date or time."
      breadcrumbs={[{ href: routes.contact, label: "Contact" }]}
    >
      <HelpContact heading={false} contained={false} showAllLink={false} />
      <Card className="mt-8 max-w-xl" padding="lg">
        <h2 className="mb-4 text-lg font-semibold text-navy-900">Send a message</h2>
        <ContactForm />
      </Card>
    </PublicPageShell>
  );
}
