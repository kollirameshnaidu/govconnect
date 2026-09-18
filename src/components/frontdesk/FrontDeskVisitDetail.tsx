"use client";

import { useState } from "react";
import { AppointmentTimeline } from "@/components/appointment/AppointmentTimeline";
import { VisitToken } from "@/components/appointment/VisitToken";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { routes } from "@/constants/routes";
import {
  assignedSlotLabel,
  canCallNext,
  canCheckIn,
  canMarkNoShow,
  canSendToWaiting,
} from "@/lib/appointment-lifecycle";
import { isFrontDeskSession, maskMobile } from "@/lib/session";
import { useFrontDeskAppointment } from "@/lib/use-citizen-appointments";
import {
  callNextFrontDeskVisitor,
  checkInFrontDeskVisit,
  markFrontDeskNoShow,
  sendFrontDeskVisitToQueue,
} from "@/services/appointmentService";
import type { FrontDeskSession, TrackedAppointment } from "@/types";

export function FrontDeskVisitDetail({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const staff = isFrontDeskSession(session) ? session : null;
  const { appointment, ready } = useFrontDeskAppointment(staff, appointmentId);

  if (!staff) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading visit…</p>;
  }
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Visit not at this office"
        description="This appointment ID is not booked at your office."
        action={
          <Button href={routes.frontDeskSearch} variant="outline">
            Back to search
          </Button>
        }
      />
    );
  }

  return <VisitBody appointment={appointment} staff={staff} />;
}

function VisitBody({
  appointment,
  staff,
}: {
  appointment: TrackedAppointment;
  staff: FrontDeskSession;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const desk = staff;

  async function run(action: string, work: () => Promise<unknown>) {
    setPending(action);
    setError("");
    try {
      await work();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The action could not be completed.");
    } finally {
      setPending("");
    }
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-700">{appointment.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">Visitor verification</h1>
          <p className="mt-2 text-sm text-muted">
            {appointment.citizenName ?? "Citizen"} · {appointment.officeName}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </header>

      <Alert tone="info" title="Preferred date is not a booking">
        Check-in uses the confirmed date and time. The preferred date {appointment.preferredDate}{" "}
        remains the original request.
      </Alert>
      {appointment.status === AppointmentStatus.SCHEDULED ? (
        <Alert tone="warning" title="Citizen confirmation required">
          This visit is scheduled but not confirmed. Front desk cannot check the visitor in until
          the citizen confirms the assigned slot.
        </Alert>
      ) : null}
      {error ? <Alert tone="danger">{error}</Alert> : null}

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Identity and visit</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <Row label="Citizen" value={appointment.citizenName ?? "Not recorded"} />
          <Row
            label="Mobile"
            value={appointment.citizenMobile ? maskMobile(appointment.citizenMobile) : "Not recorded"}
          />
          <Row label="Official" value={appointment.officialName} />
          <Row label="Purpose" value={appointment.purpose} />
          <Row label="Preferred date" value={appointment.preferredDate} />
          <Row
            label={assignedSlotLabel(appointment.status)}
            value={appointment.confirmedAt ?? "Not assigned yet"}
          />
          {appointment.documentsToCarry?.length ? (
            <Row label="Documents to carry" value={appointment.documentsToCarry.join(", ")} />
          ) : null}
          {appointment.queuePosition ? (
            <Row label="Queue position" value={String(appointment.queuePosition)} />
          ) : null}
        </dl>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Visit token</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Match this pattern to the citizen’s letter. If it cannot be scanned, the appointment ID
          is enough.
        </p>
        <div className="mt-4">
          <VisitToken value={appointment.id} size={148} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Desk actions</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Confirm the citizen’s identity before check-in. Then add them to the waiting queue.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canCheckIn(appointment.status) ? (
            <Button
              onClick={() => run("check-in", () => checkInFrontDeskVisit(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "check-in" ? "Checking in…" : "Check in"}
            </Button>
          ) : null}
          {canSendToWaiting(appointment.status) ? (
            <Button
              variant="secondary"
              onClick={() => run("queue", () => sendFrontDeskVisitToQueue(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "queue" ? "Adding…" : "Add to waiting queue"}
            </Button>
          ) : null}
          {canCallNext(appointment.status) ? (
            <Button
              variant="outline"
              onClick={() => run("call", () => callNextFrontDeskVisitor(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "call" ? "Calling…" : "Call visitor"}
            </Button>
          ) : null}
          {canMarkNoShow(appointment.status) ? (
            <Button
              variant="danger"
              onClick={() => run("no-show", () => markFrontDeskNoShow(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "no-show" ? "Saving…" : "Mark no-show"}
            </Button>
          ) : null}
        </div>
        {!canCheckIn(appointment.status) &&
        !canSendToWaiting(appointment.status) &&
        !canCallNext(appointment.status) &&
        !canMarkNoShow(appointment.status) ? (
          <p className="mt-3 text-sm text-muted">No front desk action is available on this status.</p>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Status history</h2>
        <div className="mt-4">
          <AppointmentTimeline appointment={appointment} />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-2 last:border-b-0 sm:grid-cols-[10rem_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
