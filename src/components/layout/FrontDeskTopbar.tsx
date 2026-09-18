"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Icon } from "@/components/common/Icon";
import { routes } from "@/constants/routes";
import { logoutSession } from "@/lib/auth-store";
import type { FrontDeskSession } from "@/types";

type FrontDeskTopbarProps = {
  session: FrontDeskSession;
  onMenu: () => void;
};

export function FrontDeskTopbar({ session, onMenu }: FrontDeskTopbarProps) {
  const router = useRouter();

  function logout() {
    logoutSession();
    router.push(routes.home);
    router.refresh();
  }

  return (
    <div className="flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 md:px-6">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line lg:hidden"
        onClick={onMenu}
      >
        <span className="sr-only">Open portal menu</span>
        <Icon name="menu" />
      </button>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy-900">{session.name}</p>
        <p className="truncate text-xs text-muted">
          {session.designation} · {session.staffId}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button href={routes.frontDeskSearch} variant="ghost" size="sm" icon={<Icon name="search" />}>
          <span className="hidden sm:inline">Search</span>
        </Button>
        <Button variant="outline" size="sm" onClick={logout} icon={<Icon name="logout" />}>
          Logout
        </Button>
      </div>
    </div>
  );
}
