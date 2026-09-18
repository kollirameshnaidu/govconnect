"use client";

import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { OfficialAppointmentCard, requestHref, visitHref } from "@/components/official/OfficialAppointmentCard";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import { isReviewQueue, isScheduledVisit } from "@/lib/appointment-lifecycle";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointments } from "@/lib/use-citizen-appointments";
import { getNotificationsForOfficial } from "@/services/notificationService";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficeById } from "@/services/officeService";

export function OfficialDashboard() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const { appointments, ready } = useOfficialAppointments(official);

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading desk inbox…</p>;
  }

  const office = getOfficeById(official.officeId);
  const department = getDepartmentById(official.departmentId);
  const notifications = getNotificationsForOfficial(official.id);
  const inbox = appointments.filter((item) => isReviewQueue(item.status));
  const awaitingSlot = appointments.filter((item) => item.status === AppointmentStatus.ACCEPTED);
  const visits = appointments.filter((item) => isScheduledVisit(item.status));
  const meetings = appointments.filter((item) => item.status === AppointmentStatus.MEETING_IN_PROGRESS);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-600">
            Official portal
          </p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900 md:text-3xl">
            Welcome, {official.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {official.designation} · {office?.name ?? "Office"} · {department?.name ?? "Department"}.
            Review requests on this desk, then assign a confirmed date and time. A preferred date
            is not a reserved slot.
          </p>
        </div>
        <Button href={routes.officialRequests}>Open inbox</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Inbox" value={inbox.length} />
        <StatCard label="Awaiting slot" value={awaitingSlot.length} />
        <StatCard label="Scheduled visits" value={visits.length} />
        <StatCard label="Meetings in progress" value={meetings.length} />
      </div>

      <Alert tone="info" title="Preferred date versus confirmed slot">
        Accepting a request does not book the citizen’s preferred date. Choose a working-day
        slot after review. The appointment ID stays the same if you transfer the case.
      </Alert>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Requests needing action</h2>
          <Link href={routes.officialRequests} className="text-sm font-semibold text-navy-700">
            View all
          </Link>
        </div>
        {inbox.length === 0 ? (
          <EmptyState
            icon="file"
            title="No requests waiting"
            description="Submitted, transferred, and accepted requests for this office desk appear here."
          />
        ) : (
          <ul className="grid gap-3">
            {inbox.slice(0, 4).map((item) => (
              <li key={item.id}>
                <OfficialAppointmentCard appointment={item} href={requestHref(item)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Upcoming visits</h2>
          <Link href={routes.officialAppointments} className="text-sm font-semibold text-navy-700">
            Calendar and list
          </Link>
        </div>
        {visits.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No scheduled visits"
            description="Assigned and confirmed visits appear after you schedule a working-day slot."
          />
        ) : (
          <ul className="grid gap-3">
            {visits.slice(0, 3).map((item) => (
              <li key={item.id}>
                <OfficialAppointmentCard appointment={item} href={visitHref(item)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Notifications</h2>
          <Link href={routes.officialNotifications} className="text-sm font-semibold text-navy-700">
            All alerts
          </Link>
        </div>
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="No notifications"
            description="Inbox items and citizen confirmations will appear here."
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
