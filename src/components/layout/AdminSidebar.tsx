"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, canAdmin } from "@/constants/admin";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/common/Icon";
import type { AdminSession } from "@/types";

function isAdminNavActive(href: string, pathname: string) {
  if (href === routes.adminDashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  session: AdminSession;
  onNavigate?: () => void;
};

export function AdminSidebar({ session, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const items = ADMIN_NAV_ITEMS.filter(
    (item) => !item.permission || canAdmin(session, item.permission),
  );

  return (
    <nav aria-label="Admin portal" className="grid gap-1">
      {items.map((item) => {
        const active = isAdminNavActive(item.href, pathname);
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
