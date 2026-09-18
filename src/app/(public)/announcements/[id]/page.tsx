import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { routes } from "@/constants/routes";
import { ANNOUNCEMENTS } from "@/mock/homepage";
import { getAnnouncementById } from "@/services/announcementService";
import type { Metadata } from "next";

export function generateStaticParams() {
  return ANNOUNCEMENTS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/announcements/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = getAnnouncementById(id);
  return { title: item?.title ?? "Announcement" };
}

export default async function AnnouncementDetailPage({
  params,
}: PageProps<"/announcements/[id]">) {
  const { id } = await params;
  const item = getAnnouncementById(id);
  if (!item) notFound();

  return (
    <PublicPageShell
      title={item.title}
      description={item.excerpt}
      breadcrumbs={[
        { href: routes.announcements, label: "Announcements" },
        { label: item.title },
      ]}
    >
      <Card className="max-w-3xl">
        <Badge>{item.category}</Badge>
        <p className="mt-3 text-sm text-muted">{item.date}</p>
        <div className="mt-4 grid gap-4 text-sm leading-7 text-ink">
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Card>
    </PublicPageShell>
  );
}
