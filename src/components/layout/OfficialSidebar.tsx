"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OFFICIAL_NAV } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/common/Icon";

function isOfficialNavActive(href: string, pathname: string) {
  if (href === routes.officialDashboard) return pathname === href;
  if (href === routes.officialRequests) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  if (href === routes.officialAppointments) {
    return pathname === href || pathname.startsWith("/official/meetings/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type OfficialSidebarProps = {
  onNavigate?: () => void;
};

export function OfficialSidebar({ onNavigate }: OfficialSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Official portal" className="grid gap-1">
      {OFFICIAL_NAV.map((item) => {
        const active = isOfficialNavActive(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50",
              active && "bg-navy-800 text-white hover:bg-navy-900 hover:text-white",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
      <Link
        href={routes.home}
        onClick={onNavigate}
        className="mt-4 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-navy-50 hover:text-navy-800"
      >
        <Icon name="home" className="h-4 w-4" />
        Public website
      </Link>
    </nav>
  );
}
