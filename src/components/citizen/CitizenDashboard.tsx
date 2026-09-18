"use client";

import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import { ACTIVE_STATUSES } from "@/mock/citizen-portal";
import { useCitizenAppointments } from "@/lib/use-citizen-appointments";
import { getNotificationsForCitizen } from "@/services/notificationService";

export function CitizenDashboard() {
  const session = useSession();
  const { appointments, ready } = useCitizenAppointments(session?.id);
  if (!session) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading appointments…</p>;
  }

  const notifications = getNotificationsForCitizen(session.id);
  const active = appointments.filter((item) =>
    (ACTIVE_STATUSES as readonly string[]).includes(item.status),
  );
  const confirmed = appointments.filter(
    (item) => item.status === AppointmentStatus.CONFIRMED,
  );
  const awaiting = appointments.filter(
    (item) => item.status === AppointmentStatus.UNDER_REVIEW || item.status === AppointmentStatus.SUBMITTED,
  );

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-600">
            Citizen portal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
            Welcome, {session.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Manage appointment requests from this dashboard. A preferred date is
            not a confirmed slot until an official assigns the visit time.
          </p>
        </div>
        <Button href={routes.citizenBook}>Book appointment</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active requests" value={active.length} />
        <StatCard label="Confirmed visits" value={confirmed.length} />
        <StatCard label="Awaiting review" value={awaiting.length} />
      </div>

      <Alert tone="info" title="Preferred date versus confirmed slot">
        Selecting a preferred date submits a request. The confirmed date and
        time appear here only after official review.
      </Alert>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Recent appointments</h2>
          <Link href={routes.citizenAppointments} className="text-sm font-semibold text-navy-700">
            View all
          </Link>
        </div>
        {appointments.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No appointment requests yet"
            description="Use New appointment to choose an office, department, official, purpose, and a preferred date. The preferred date is not a confirmed slot."
            action={<Button href={routes.citizenBook}>Start a request</Button>}
          />
        ) : (
          <ul className="grid gap-3">
            {appointments.slice(0, 3).map((item) => (
              <li key={item.id}>
                <Link href={routes.citizenAppointment(item.id)}>
                  <Card className="hover:border-navy-700">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy-900">{item.id}</p>
                        <p className="mt-1 text-sm text-muted">
                          {item.officeName} · {item.departmentName}
                        </p>
                        <p className="mt-2 text-sm text-ink">{item.purpose}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted">Preferred date</dt>
                        <dd className="font-medium">{item.preferredDate}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Confirmed date/time</dt>
                        <dd className="font-medium">{item.confirmedAt ?? "Not assigned yet"}</dd>
                      </div>
                    </dl>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Notifications</h2>
          <Link href={routes.citizenNotifications} className="text-sm font-semibold text-navy-700">
            All alerts
          </Link>
        </div>
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="No notifications"
            description="Status changes, confirmed slots, and transfer updates will appear here."
          />
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
