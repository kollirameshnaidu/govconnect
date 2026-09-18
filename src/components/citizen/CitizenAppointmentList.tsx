"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import { useCitizenAppointments } from "@/lib/use-citizen-appointments";
import type { TrackedAppointment } from "@/types";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "review", label: "Under review" },
  { id: "confirmed", label: "Confirmed" },
  { id: "closed", label: "Closed or rejected" },
] as const;

function matchesFilter(item: TrackedAppointment, filter: string) {
  if (filter === "review") {
    return (
      item.status === AppointmentStatus.UNDER_REVIEW ||
      item.status === AppointmentStatus.SUBMITTED
    );
  }
  if (filter === "confirmed") return item.status === AppointmentStatus.CONFIRMED;
  if (filter === "closed") {
    return (
      item.status === AppointmentStatus.CLOSED ||
      item.status === AppointmentStatus.REJECTED ||
      item.status === AppointmentStatus.CANCELLED ||
      item.status === AppointmentStatus.NO_SHOW
    );
  }
  return true;
}

export function CitizenAppointmentList() {
  const session = useSession();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const { appointments, ready } = useCitizenAppointments(session?.id);
  const items = useMemo(
    () => appointments.filter((item) => matchesFilter(item, filter)),
    [appointments, filter],
  );

  if (!session) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading appointments…</p>;
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My appointments</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Each request keeps one appointment ID, including transfers. Preferred
            date and confirmed slot are shown separately.
          </p>
        </div>
        <Button href={routes.citizenBook}>Book appointment</Button>
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
          description="Start a request after choosing an office and department. A preferred date will not reserve a slot."
          action={<Button href={routes.citizenBook}>Book appointment</Button>}
        />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
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
                  <p className="mt-3 text-sm text-muted">
                    Preferred {item.preferredDate} · Confirmed{" "}
                    {item.confirmedAt ?? "not assigned yet"}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
