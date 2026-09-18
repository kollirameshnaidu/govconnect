"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { OfficialAppointmentCard, requestHref } from "@/components/official/OfficialAppointmentCard";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointments } from "@/lib/use-citizen-appointments";
import type { TrackedAppointment } from "@/types";

const FILTERS = [
  { id: "inbox", label: "Inbox" },
  { id: "accepted", label: "Accepted" },
  { id: "all", label: "All desk requests" },
] as const;

function matchesFilter(item: TrackedAppointment, filter: string) {
  if (filter === "inbox") {
    return (
      item.status === AppointmentStatus.SUBMITTED ||
      item.status === AppointmentStatus.UNDER_REVIEW ||
      item.status === AppointmentStatus.TRANSFERRED ||
      item.status === AppointmentStatus.ACCEPTED
    );
  }
  if (filter === "accepted") return item.status === AppointmentStatus.ACCEPTED;
  return true;
}

export function OfficialRequestList() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("inbox");
  const { appointments, ready } = useOfficialAppointments(official);
  const items = useMemo(
    () => appointments.filter((item) => matchesFilter(item, filter)),
    [appointments, filter],
  );

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading requests…</p>;
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Requests</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Desk inbox for {official.designation}. Take up, accept, reject, or transfer a
            request. Schedule a confirmed slot only after acceptance. The appointment ID
            does not change on transfer.
          </p>
        </div>
        <Button href={routes.officialCalendar} variant="outline">
          Open calendar
        </Button>
      </header>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter requests">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              filter === item.id
                ? "rounded-full border border-navy-800 bg-navy-800 px-3 py-1.5 text-sm font-medium text-white"
                : "rounded-full border border-line bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50"
            }
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon="file"
          title="No requests in this view"
          description="Submitted and transferred requests for this office and department appear in the inbox."
        />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <OfficialAppointmentCard appointment={item} href={requestHref(item)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
