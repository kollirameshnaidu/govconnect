"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { OfficialAppointmentCard, visitHref } from "@/components/official/OfficialAppointmentCard";
import { useSession } from "@/components/auth/AuthProvider";
import { isScheduledVisit } from "@/lib/appointment-lifecycle";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointments } from "@/lib/use-citizen-appointments";
import type { TrackedAppointment } from "@/types";

const FILTERS = [
  { id: "visits", label: "Scheduled visits" },
  { id: "meetings", label: "Meetings" },
  { id: "closed", label: "Closed" },
  { id: "all", label: "All" },
] as const;

function matchesFilter(item: TrackedAppointment, filter: string) {
  if (filter === "visits") return isScheduledVisit(item.status);
  if (filter === "meetings") {
    return item.status === "MEETING_IN_PROGRESS" || item.status === "MEETING_COMPLETED";
  }
  if (filter === "closed") return item.status === "CLOSED" || item.status === "NO_SHOW";
  return true;
}

export function OfficialAppointmentList() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("visits");
  const { appointments, ready } = useOfficialAppointments(official);
  const items = useMemo(
    () => appointments.filter((item) => matchesFilter(item, filter)),
    [appointments, filter],
  );

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading appointments…</p>;
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Appointments</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Confirmed visits are ready for a meeting. Scheduled visits still wait for the citizen
          to confirm. Preferred date remains a request.
        </p>
      </header>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter appointments">
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
          icon="calendar"
          title="No appointments in this view"
          description="Assign a confirmed slot from an accepted request to see visits here."
        />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <OfficialAppointmentCard appointment={item} href={visitHref(item)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
