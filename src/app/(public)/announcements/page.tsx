import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { AnnouncementBoard } from "@/components/public/AnnouncementBoard";
import { routes } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Announcements" };

export default function AnnouncementsPage() {
  return (
    <PublicPageShell
      title="Announcements"
      description="Office notices, service updates, and system changes that affect appointment requests."
      breadcrumbs={[{ href: routes.announcements, label: "Announcements" }]}
    >
      <AnnouncementBoard />
    </PublicPageShell>
  );
}
