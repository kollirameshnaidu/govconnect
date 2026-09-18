"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Icon } from "@/components/common/Icon";
import { CitizenLoginForm } from "@/components/forms/CitizenLoginForm";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isAdminSession, isCitizenSession, isFrontDeskSession, isOfficialSession, maskMobile } from "@/lib/session";

export function Hero() {
  const session = useSession();
  const citizen = isCitizenSession(session) ? session : null;
  const official = isOfficialSession(session) ? session : null;
  const frontDesk = isFrontDeskSession(session) ? session : null;
  const admin = isAdminSession(session) ? session : null;

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-16 top-10 h-64 w-64 rounded-full border border-white/20" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full border border-white/10" />
      </div>
      <div className="relative mx-auto grid max-w-[1200px] gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1.15fr_0.85fr] xl:px-8">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-india-saffron">
            Official citizen services
          </p>
          <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight md:text-5xl md:leading-[1.15]">
            Book government appointments without standing in queue.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            Submit a request with your preferred date. An official reviews the
            request and assigns the confirmed date and time. Track every step
            until closure.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {official ? (
              <Button href={routes.officialDashboard} size="lg">
                Open official portal
              </Button>
            ) : frontDesk ? (
              <Button href={routes.frontDeskDashboard} size="lg">
                Open front desk
              </Button>
            ) : admin ? (
              <Button href={routes.adminDashboard} size="lg">
                Open admin portal
              </Button>
            ) : (
              <Button href={citizen ? routes.citizenBook : routes.bookAppointment} size="lg">
                Book appointment
              </Button>
            )}
            <Button href="#find-office" variant="inverse" size="lg">
              Find office
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Icon name="shield" /> Secure citizen records
            </li>
            <li className="flex items-center gap-2">
              <Icon name="clock" /> 48-hour review SLA
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" /> Official confirmation required
            </li>
          </ul>
        </div>
        <Card className="text-ink" padding="lg">
          {citizen ? (
            <div className="grid gap-4">
              <h2 className="text-lg font-bold text-navy-900">Signed in</h2>
              <p className="text-sm leading-6 text-muted">
                Welcome back, {citizen.name}. Public pages remain open without
                login. Use the dashboard to manage personal requests.
              </p>
              <p className="text-sm text-ink">Mobile {maskMobile(citizen.mobile)}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button href={routes.citizenDashboard} className="w-full">
                  Open dashboard
                </Button>
                <Button href={routes.citizenBook} variant="outline" className="w-full">
                  Book appointment
                </Button>
              </div>
            </div>
          ) : official ? (
            <div className="grid gap-4">
              <h2 className="text-lg font-bold text-navy-900">Official signed in</h2>
              <p className="text-sm leading-6 text-muted">
                Welcome back, {official.name}. Review requests and assign confirmed
                date and time from the official portal.
              </p>
              <p className="text-sm text-ink">
                {official.designation} · {official.staffId}
              </p>
              <Button href={routes.officialDashboard} className="w-full">
                Open official portal
              </Button>
            </div>
          ) : frontDesk ? (
            <div className="grid gap-4">
              <h2 className="text-lg font-bold text-navy-900">Front desk signed in</h2>
              <p className="text-sm leading-6 text-muted">
                Welcome back, {frontDesk.name}. Verify visitors, check in confirmed
                appointments, and call the waiting queue. This desk cannot assign a slot.
              </p>
              <p className="text-sm text-ink">
                {frontDesk.designation} · {frontDesk.staffId}
              </p>
              <Button href={routes.frontDeskDashboard} className="w-full">
                Open front desk
              </Button>
            </div>
          ) : admin ? (
            <div className="grid gap-4">
              <h2 className="text-lg font-bold text-navy-900">Administrator signed in</h2>
              <p className="text-sm leading-6 text-muted">
                Welcome back, {admin.name}. Maintain offices, holidays, and SLA from the
                admin portal. This role cannot assign a confirmed appointment slot.
              </p>
              <p className="text-sm text-ink">
                {admin.designation} · {admin.staffId}
              </p>
              <Button href={routes.adminDashboard} className="w-full">
                Open admin portal
              </Button>
            </div>
          ) : (
            <CitizenLoginForm />
          )}
        </Card>
      </div>
    </section>
  );
}
