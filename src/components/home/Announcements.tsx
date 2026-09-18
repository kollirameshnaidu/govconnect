import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { ANNOUNCEMENTS } from "@/mock/homepage";
import type { Announcement } from "@/types";

type AnnouncementsProps = {
  heading?: boolean;
  contained?: boolean;
  showAllLink?: boolean;
  items?: Announcement[];
};

export function Announcements({
  heading = true,
  contained = true,
  showAllLink = true,
  items = ANNOUNCEMENTS,
}: AnnouncementsProps) {
  return (
    <SectionFrame contained={contained}>
      {heading ? (
        <SectionHeading
          eyebrow="Important announcements"
          title="Office notices and service updates"
          href={showAllLink ? routes.announcements : undefined}
          actionLabel={showAllLink ? "All announcements" : undefined}
        />
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} as="article" className="h-full">
            <Badge>{item.category}</Badge>
            <p className="mt-3 text-xs text-muted">{item.date}</p>
            <h3 className="mt-2 text-base font-semibold text-navy-900">
              <Link href={routes.announcement(item.id)} className="hover:text-navy-700">
                {item.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
