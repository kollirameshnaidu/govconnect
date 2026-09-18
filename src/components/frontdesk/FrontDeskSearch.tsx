"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/common/Alert";
import { EmptyState } from "@/components/common/EmptyState";
import { FrontDeskSearchForm } from "@/components/frontdesk/FrontDeskSearchForm";
import { FrontDeskVisitCard } from "@/components/frontdesk/FrontDeskVisitCard";
import { useSession } from "@/components/auth/AuthProvider";
import { isFrontDeskSession } from "@/lib/session";
import { useFrontDeskAppointments } from "@/lib/use-citizen-appointments";
import { searchFrontDeskVisits } from "@/services/appointmentService";

export function FrontDeskSearch() {
  const session = useSession();
  const staff = isFrontDeskSession(session) ? session : null;
  const params = useSearchParams();
  const appointmentId = params.get("id") ?? "";
  const mobile = params.get("mobile") ?? "";
  const { appointments, ready } = useFrontDeskAppointments(staff);
  const results = useMemo(
    () =>
      staff && (appointmentId || mobile)
        ? searchFrontDeskVisits(staff, { appointmentId, mobile }, appointments)
        : [],
    [appointmentId, appointments, mobile, staff],
  );
  const searched = Boolean(appointmentId || mobile);

  if (!staff) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading visits…</p>;
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Search visitor</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Enter the appointment ID from the letter or visit token. If the token cannot be scanned,
          type the ID. Registered mobile lists visits at this office only.
        </p>
      </header>
      <FrontDeskSearchForm initialId={appointmentId} initialMobile={mobile} />
      <Alert tone="info">
        Front desk cannot confirm a preferred date as a slot. Check-in is only for citizens who
        already confirmed the assigned time.
      </Alert>
      {!searched ? (
        <EmptyState
          icon="search"
          title="Search to verify a visitor"
          description="Demo: GC-2026-000198 with mobile 9012345678, or GC-2026-000199."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No visit at this office"
          description="Check the appointment ID and registered mobile. Requests for other offices do not appear here."
        />
      ) : (
        <ul className="grid gap-3">
          {results.map((item) => (
            <li key={item.id}>
              <FrontDeskVisitCard appointment={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
