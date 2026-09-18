"use client";

import { useMemo } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { OfficialAppointmentCard, visitHref } from "@/components/official/OfficialAppointmentCard";
import { useSession } from "@/components/auth/AuthProvider";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointments } from "@/lib/use-citizen-appointments";

function slotDay(value: string | null) {
  if (!value) return "Unassigned";
  return value.split(",")[0]?.trim() || value;
}

export function OfficialCalendar() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const { appointments, ready } = useOfficialAppointments(official);
  const groups = useMemo(() => {
    const scheduled = appointments.filter((item) => item.confirmedAt);
    const map = new Map<string, typeof scheduled>();
    for (const item of scheduled) {
      const day = slotDay(item.confirmedAt);
      const list = map.get(day) ?? [];
      list.push(item);
      map.set(day, list);
    }
    return [...map.entries()];
  }, [appointments]);

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading calendar…</p>;
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Calendar</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Visits appear on the assigned date and time, not on the citizen’s preferred date.
          Preferred dates stay visible on each card as a request only.
        </p>
      </header>
      {groups.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No assigned visits"
          description="After you accept a request and assign a working-day slot, it appears on this calendar."
        />
      ) : (
        groups.map(([day, items]) => (
          <section key={day} className="grid gap-3">
            <h2 className="text-lg font-semibold text-navy-900">{day}</h2>
            <ul className="grid gap-3">
              {items.map((item) => (
                <li key={item.id}>
                  <OfficialAppointmentCard appointment={item} href={visitHref(item)} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
