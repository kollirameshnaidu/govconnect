import Link from "next/link";
import { Container } from "@/components/common/Container";
import { GovEmblem } from "@/components/common/GovEmblem";
import { FOOTER_NAV } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { SITE } from "@/mock/homepage";

export function PublicFooter() {
  return (
    <footer className="mt-auto bg-navy-950 text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <GovEmblem className="h-12 w-12" />
            <div>
              <p className="text-lg font-bold">{SITE.name}</p>
              <p className="text-xs text-white/70">{SITE.fullName}</p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/75">
            Official channel to request, track, and complete government office
            appointments. A preferred date is a request, not a confirmed slot.
          </p>
        </div>
        <FooterColumn title="For citizens" items={FOOTER_NAV.citizens} />
        <FooterColumn title="Information" items={FOOTER_NAV.information} />
        <FooterColumn title="Support" items={FOOTER_NAV.support} />
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-4 text-xs text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {SITE.copyrightYear} {SITE.authority}. Content is for official public service use.
          </p>
          <p>Last updated: {SITE.lastUpdated}</p>
        </Container>
      </div>
      <p className="sr-only">
        <Link href={routes.accessibility}>Accessibility statement</Link>
      </p>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-india-saffron">
        {title}
      </p>
      <ul className="grid gap-2 text-sm text-white/80">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
