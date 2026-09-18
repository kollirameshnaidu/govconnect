"use client";

import Link from "next/link";
import { Card } from "@/components/common/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { routes } from "@/constants/routes";
import type { TrackedAppointment } from "@/types";

export function FrontDeskVisitCard({
  appointment,
}: {
  appointment: TrackedAppointment;
}) {
  return (
    <Link href={routes.frontDeskVisit(appointment.id)}>
      <Card className="hover:border-navy-700">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-navy-900">{appointment.id}</p>
            <p className="mt-1 text-sm text-muted">
              {appointment.citizenName ?? "Citizen"} · {appointment.departmentName}
            </p>
            <p className="mt-2 text-sm text-ink">{appointment.purpose}</p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Preferred date</dt>
            <dd className="font-medium">{appointment.preferredDate}</dd>
          </div>
          <div>
            <dt className="text-muted">Confirmed date/time</dt>
            <dd className="font-medium">{appointment.confirmedAt ?? "Not assigned yet"}</dd>
          </div>
          {appointment.queuePosition ? (
            <div>
              <dt className="text-muted">Queue position</dt>
              <dd className="font-medium">{appointment.queuePosition}</dd>
            </div>
          ) : null}
        </dl>
      </Card>
    </Link>
  );
}
