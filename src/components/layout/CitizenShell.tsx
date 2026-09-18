"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { SkipLink } from "@/components/common/SkipLink";
import { CitizenSidebar } from "@/components/layout/CitizenSidebar";
import { CitizenTopbar } from "@/components/layout/CitizenTopbar";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { routes } from "@/constants/routes";
import { homeForSession, isCitizenSession } from "@/lib/session";
import { SITE } from "@/mock/homepage";

export function CitizenShell({ children }: { children: ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace(`${routes.login}?next=${routes.citizenDashboard}`);
    } else if (!isCitizenSession(session)) {
      router.replace(homeForSession(session));
    }
  }, [router, session]);

  if (!isCitizenSession(session)) {
    return (
      <div className="flex min-h-full items-center justify-center bg-surface p-6 text-sm text-muted">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <div className="print:hidden">
        <SkipLink />
        <UtilityBar />
      </div>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-line bg-white p-4 print:hidden lg:block">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {SITE.name} citizen
          </p>
          <CitizenSidebar />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="print:hidden">
            <CitizenTopbar session={session} onMenu={() => setMenuOpen(true)} />
          </div>
          {menuOpen ? (
            <div className="border-b border-line bg-white p-4 print:hidden lg:hidden">
              <CitizenSidebar onNavigate={() => setMenuOpen(false)} />
            </div>
          ) : null}
          <main id="main-content" className="flex-1 px-4 py-6 md:px-6 md:py-8">
            {children}
          </main>
          <footer className="border-t border-line px-4 py-3 text-xs text-muted print:hidden md:px-6">
            A preferred date is a request, not a confirmed appointment slot.
          </footer>
        </div>
      </div>
    </div>
  );
}
