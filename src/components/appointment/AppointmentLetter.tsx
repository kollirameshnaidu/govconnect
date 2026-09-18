"use client";

import { Button } from "@/components/common/Button";
import { GovEmblem } from "@/components/common/GovEmblem";
import { VisitToken } from "@/components/appointment/VisitToken";
import { SITE } from "@/mock/homepage";
import type { TrackedAppointment } from "@/types";

export function AppointmentLetter({
  appointment,
  citizenName,
}: {
  appointment: TrackedAppointment;
  citizenName: string;
}) {
  const carry = appointment.documentsToCarry?.length
    ? appointment.documentsToCarry
    : appointment.notes
      ? [appointment.notes]
      : ["Identity proof", "Application copy"];

  return (
    <article className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-6 shadow-[var(--shadow-card)] print:shadow-none md:p-8">
      <header className="flex items-start gap-4 border-b border-line pb-4">
        <GovEmblem className="h-16 w-16" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-600">
            {SITE.jurisdiction}
          </p>
          <h1 className="mt-1 text-xl font-bold text-navy-900">Appointment letter</h1>
          <p className="mt-1 text-sm text-muted">
            {SITE.name} · {SITE.fullName}
          </p>
        </div>
      </header>

      <p className="mt-4 text-sm leading-6 text-ink">
        This letter confirms a scheduled office visit. Quote appointment ID{" "}
        <strong>{appointment.id}</strong> at the front desk if the visit token cannot
        be scanned. A preferred date is not a booking; only the confirmed date and
        time below are valid for this visit.
      </p>

      <dl className="mt-5 grid gap-2 text-sm">
        <Row label="Appointment ID" value={appointment.id} />
        <Row label="Citizen" value={appointment.citizenName ?? citizenName} />
        <Row label="Office" value={appointment.officeName} />
        <Row label="Department" value={appointment.departmentName} />
        <Row label="Official" value={appointment.officialName} />
        <Row label="Purpose" value={appointment.purpose} />
        <Row label="Preferred date (request)" value={appointment.preferredDate} />
        <Row
          label="Confirmed date/time"
          value={appointment.confirmedAt ?? "Not assigned"}
        />
      </dl>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 className="text-sm font-semibold text-navy-900">Documents to carry</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {carry.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-muted">
            Front desk may search by this appointment ID or the registered mobile
            number. Do not travel on the preferred date unless it matches the
            confirmed slot.
          </p>
        </div>
        <div className="justify-self-center text-center">
          <VisitToken value={appointment.id} size={148} />
          <p className="mt-2 text-xs font-semibold text-navy-800">{appointment.id}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 print:hidden">
        <Button onClick={() => window.print()}>Print letter</Button>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-2 last:border-b-0 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
