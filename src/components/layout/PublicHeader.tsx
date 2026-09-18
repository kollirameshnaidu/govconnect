"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import { GovEmblem } from "@/components/common/GovEmblem";
import { Icon } from "@/components/common/Icon";
import { MAIN_NAV } from "@/constants/navigation";
import { routes } from "@/constants/routes";
import { logoutCitizen } from "@/lib/auth-store";
import { isAdminSession, isCitizenSession, isFrontDeskSession, isOfficialSession } from "@/lib/session";
import { SITE } from "@/mock/homepage";
import { cn } from "@/lib/cn";

export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const citizen = isCitizenSession(session);
  const official = isOfficialSession(session);
  const frontDesk = isFrontDeskSession(session);
  const admin = isAdminSession(session);

  function logout() {
    logoutCitizen();
    setOpen(false);
    router.push(routes.home);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <Container className="flex min-h-[88px] items-center justify-between gap-4 py-3">
        <Link href={routes.home} className="flex min-w-0 items-center gap-3">
          <GovEmblem className="h-12 w-12 md:h-14 md:w-14" />
          <span className="min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              {SITE.jurisdiction}
            </span>
            <span className="block truncate text-lg font-bold leading-6 text-navy-900 md:text-xl">
              {SITE.name}
            </span>
            <span className="hidden truncate text-xs text-muted sm:block">
              {SITE.fullName}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {citizen ? (
            <>
              <Button href={routes.citizenDashboard} variant="outline" size="sm">
                Dashboard
              </Button>
              <Button href={routes.citizenBook} size="sm">
                Book appointment
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} icon={<Icon name="logout" />}>
                Logout
              </Button>
            </>
          ) : official ? (
            <>
              <Button href={routes.officialDashboard} variant="outline" size="sm">
                Official portal
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} icon={<Icon name="logout" />}>
                Logout
              </Button>
            </>
          ) : frontDesk ? (
            <>
              <Button href={routes.frontDeskDashboard} variant="outline" size="sm">
                Front desk
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} icon={<Icon name="logout" />}>
                Logout
              </Button>
            </>
          ) : admin ? (
            <>
              <Button href={routes.adminDashboard} variant="outline" size="sm">
                Admin portal
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} icon={<Icon name="logout" />}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button href={routes.login} variant="outline" size="sm" icon={<Icon name="login" />}>
                Login
              </Button>
              <Button href={routes.register} variant="outline" size="sm" icon={<Icon name="userPlus" />}>
                Register
              </Button>
              <Button href={routes.bookAppointment} size="sm">
                Book appointment
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </Container>

      <nav className="bg-navy-800 text-white" aria-label="Primary">
        <Container className="hidden h-12 items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-12 items-center px-3 text-sm font-medium text-white/90 hover:bg-navy-900 hover:text-white",
                  active && "bg-navy-950 text-white",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </Container>
      </nav>

      {open ? (
        <div id="mobile-navigation" className="border-t border-line bg-white lg:hidden">
          <Container className="grid gap-1 py-3">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-navy-900 hover:bg-navy-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2">
              {citizen ? (
                <>
                  <Button href={routes.citizenDashboard} variant="outline">
                    Dashboard
                  </Button>
                  <Button href={routes.citizenBook}>Book appointment</Button>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : official ? (
                <>
                  <Button href={routes.officialDashboard} variant="outline">
                    Official portal
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : frontDesk ? (
                <>
                  <Button href={routes.frontDeskDashboard} variant="outline">
                    Front desk
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : admin ? (
                <>
                  <Button href={routes.adminDashboard} variant="outline">
                    Admin portal
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button href={routes.login} variant="outline">
                    Login
                  </Button>
                  <Button href={routes.register} variant="outline">
                    Register
                  </Button>
                  <Button href={routes.bookAppointment}>Book appointment</Button>
                </>
              )}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
