"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CITIZEN_NAV } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/common/Icon";

function isCitizenNavActive(href: string, pathname: string) {
  if (href === routes.citizenDashboard) return pathname === href;
  if (href === routes.citizenAppointments) {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) && pathname !== routes.citizenBook)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type CitizenSidebarProps = {
  onNavigate?: () => void;
};

export function CitizenSidebar({ onNavigate }: CitizenSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Citizen portal" className="grid gap-1">
      {CITIZEN_NAV.map((item) => {
        const active = isCitizenNavActive(item.href, pathname);
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
