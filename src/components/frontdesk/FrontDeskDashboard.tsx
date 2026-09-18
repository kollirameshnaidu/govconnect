"use client";

import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { FrontDeskSearchForm } from "@/components/frontdesk/FrontDeskSearchForm";
import { FrontDeskVisitCard } from "@/components/frontdesk/FrontDeskVisitCard";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import { isScheduledVisit } from "@/lib/appointment-lifecycle";
import { isFrontDeskSession } from "@/lib/session";
import { useFrontDeskAppointments } from "@/lib/use-citizen-appointments";
import { listFrontDeskQueue } from "@/services/appointmentService";
import { getNotificationsForFrontDesk } from "@/services/notificationService";
import { getOfficeById } from "@/services/officeService";

export function FrontDeskDashboard() {
  const session = useSession();
  const staff = isFrontDeskSession(session) ? session : null;
  const { appointments, ready } = useFrontDeskAppointments(staff);

  if (!staff) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading office visits…</p>;
  }

  const office = getOfficeById(staff.officeId);
  const notifications = getNotificationsForFrontDesk(staff.id);
  const queue = listFrontDeskQueue(staff, appointments);
  const confirmed = appointments.filter((item) => item.status === AppointmentStatus.CONFIRMED);
  const visits = appointments.filter((item) => isScheduledVisit(item.status));
  const checkedIn = appointments.filter((item) => item.status === AppointmentStatus.CHECKED_IN);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-600">
            Front desk
          </p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
            Welcome, {staff.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {staff.designation} · {office?.name ?? "Office"}. Verify identity, check in confirmed
            visits, and call the waiting queue. A preferred date is not a confirmed slot. This desk
            cannot assign appointment times.
          </p>
        </div>
        <Button href={routes.frontDeskQueue}>Open queue</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Confirmed arrivals" value={confirmed.length} />
        <StatCard label="Checked in" value={checkedIn.length} />
        <StatCard label="Waiting" value={queue.length} />
        <StatCard label="Assigned visits" value={visits.length} />
      </div>

      <Alert tone="info" title="Visit token or appointment ID">
        If a QR or visit token cannot be scanned, search by the appointment ID printed on the
        letter. Registered mobile can also locate a visitor at this office.
      </Alert>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Find a visitor</h2>
        <p className="mt-2 mb-4 text-sm text-muted">
          Demo IDs GC-2026-000198 (confirmed) and GC-2026-000199 (waiting).
        </p>
        <FrontDeskSearchForm />
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Waiting queue</h2>
          <Link href={routes.frontDeskQueue} className="text-sm font-semibold text-navy-700">
            Manage queue
          </Link>
        </div>
        {queue.length === 0 ? (
          <EmptyState
            icon="users"
            title="No one is waiting"
            description="Check in a confirmed visitor, then add them to the queue."
          />
        ) : (
          <ul className="grid gap-3">
            {queue.slice(0, 4).map((item) => (
              <li key={item.id}>
                <FrontDeskVisitCard appointment={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-900">Confirmed, waiting to check in</h2>
        {confirmed.length === 0 ? (
          <EmptyState
            icon="check"
            title="No confirmed arrivals"
            description="Citizens must confirm the assigned slot before front desk check-in."
          />
        ) : (
          <ul className="grid gap-3">
            {confirmed.slice(0, 4).map((item) => (
              <li key={item.id}>
                <FrontDeskVisitCard appointment={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-navy-900">Alerts</h2>
        {notifications.length === 0 ? (
          <EmptyState icon="bell" title="No alerts" description="Check-in and queue updates appear here." />
        ) : (
          <ul className="grid gap-3">
            {notifications.slice(0, 2).map((item) => (
              <li key={item.id}>
                <Card>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                  <p className="mt-2 text-xs text-muted">{item.date}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
    </Card>
  );
}
