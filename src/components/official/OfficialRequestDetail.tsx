"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppointmentTimeline } from "@/components/appointment/AppointmentTimeline";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/common/FormControls";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import {
  assignedSlotLabel,
  canAccept,
  canReject,
  canSchedule,
  canStartMeeting,
  canTakeUp,
  canTransfer,
} from "@/lib/appointment-lifecycle";
import { formatTimeLabel, toIsoDate } from "@/lib/dates";
import { listAvailableSlotTimes } from "@/services/adminService";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointment } from "@/lib/use-citizen-appointments";
import {
  acceptOfficialRequest,
  rejectOfficialRequest,
  scheduleOfficialAppointment,
  takeUpOfficialRequest,
} from "@/services/appointmentService";
import type { TrackedAppointment } from "@/types";

export function OfficialRequestDetail({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const { appointment, ready } = useOfficialAppointment(official, appointmentId);

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading request…</p>;
  }
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Request not on this desk"
        description="This appointment ID is not assigned to your office and department."
        action={
          <Button href={routes.officialRequests} variant="outline">
            Back to requests
          </Button>
        }
      />
    );
  }

  return <RequestBody appointment={appointment} />;
}

function RequestBody({ appointment }: { appointment: TrackedAppointment }) {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [documentsToCarry, setDocumentsToCarry] = useState(
    appointment.documentsToCarry?.join(", ") ?? "",
  );
  const [minDate] = useState(() => toIsoDate(new Date(Date.now() + 24 * 60 * 60 * 1000)));

  if (!official) return null;
  const desk = official;

  async function run(action: string, work: () => Promise<unknown>) {
    setPending(action);
    setError("");
    try {
      await work();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The action could not be completed.");
    } finally {
      setPending("");
    }
  }

  async function onReject(event: FormEvent) {
    event.preventDefault();
    await run("reject", () => rejectOfficialRequest(desk, appointment.id, rejectReason));
  }

  async function onSchedule(event: FormEvent) {
    event.preventDefault();
    await run("schedule", () =>
      scheduleOfficialAppointment(desk, appointment.id, {
        date: slotDate,
        time: slotTime,
        documentsToCarry,
      }),
    );
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-700">{appointment.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">{appointment.purpose}</h1>
          <p className="mt-2 text-sm text-muted">
            {appointment.citizenName ?? "Citizen"} · {appointment.officeName} ·{" "}
            {appointment.departmentName}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </header>

      <Alert tone="info" title="Preferred date is not a booking">
        {appointment.citizenName ?? "The citizen"} requested {appointment.preferredDate}. Assign a
        working-day slot after acceptance. Do not treat the preferred date as reserved.
      </Alert>

      {error ? <Alert tone="danger">{error}</Alert> : null}

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Request details</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <Row label="Citizen" value={appointment.citizenName ?? "Not recorded"} />
          <Row label="Official" value={appointment.officialName} />
          {appointment.category ? <Row label="Category" value={appointment.category} /> : null}
          <Row label="Preferred date" value={appointment.preferredDate} />
          <Row
            label={assignedSlotLabel(appointment.status)}
            value={appointment.confirmedAt ?? "Not assigned yet"}
          />
          <Row label="Submitted on" value={appointment.createdOn ?? "Not recorded"} />
          {appointment.documents?.length ? (
            <Row label="Uploaded documents" value={appointment.documents.join(", ")} />
          ) : null}
          {appointment.documentsToCarry?.length ? (
            <Row label="Documents to carry" value={appointment.documentsToCarry.join(", ")} />
          ) : null}
        </dl>
        {appointment.notes ? (
          <p className="mt-4 text-sm leading-6 text-ink">{appointment.notes}</p>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Desk actions</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Take up opens review. Accept before assigning a confirmed date and time. Transfer keeps
          this appointment ID.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {canTakeUp(appointment.status) ? (
            <Button
              onClick={() => run("take-up", () => takeUpOfficialRequest(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "take-up" ? "Taking up…" : "Take up"}
            </Button>
          ) : null}
          {canAccept(appointment.status) ? (
            <Button
              variant="secondary"
              onClick={() => run("accept", () => acceptOfficialRequest(desk, appointment.id))}
              disabled={Boolean(pending)}
            >
              {pending === "accept" ? "Accepting…" : "Accept"}
            </Button>
          ) : null}
          {canTransfer(appointment.status) ? (
            <Button href={routes.officialTransfer(appointment.id)} variant="outline">
              Transfer
            </Button>
          ) : null}
          {canStartMeeting(appointment.status) ? (
            <Button href={routes.officialMeeting(appointment.id)} variant="outline">
              Open meeting
            </Button>
          ) : null}
        </div>
      </Card>

      {canReject(appointment.status) ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Reject request</h2>
          <form className="mt-4 grid gap-4" onSubmit={onReject} noValidate>
            <Field id="reject-reason" label="Reason" required hint="At least 10 characters.">
              <Textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" variant="danger" disabled={Boolean(pending)}>
              {pending === "reject" ? "Rejecting…" : "Reject request"}
            </Button>
          </form>
        </Card>
      ) : null}

      {canSchedule(appointment.status) ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Assign confirmed slot</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Choose a future working day and office time. The field starts empty so the preferred
            date is not copied automatically.
          </p>
          <form className="mt-4 grid gap-4" onSubmit={onSchedule} noValidate>
            <Field id="slot-date" label="Assigned date" required>
              <Input
                id="slot-date"
                type="date"
                min={minDate}
                value={slotDate}
                onChange={(event) => setSlotDate(event.target.value)}
                required
              />
            </Field>
            <Field id="slot-time" label="Assigned time" required>
              <Select
                id="slot-time"
                value={slotTime}
                onChange={(event) => setSlotTime(event.target.value)}
                required
              >
                <option value="">Select a time</option>
                {listAvailableSlotTimes(appointment.officeId).map((time) => (
                  <option key={time} value={time}>
                    {formatTimeLabel(time)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field
              id="carry-docs"
              label="Documents to carry"
              hint="Optional. Comma-separated list shown on the citizen letter after confirmation."
            >
              <Input
                id="carry-docs"
                value={documentsToCarry}
                onChange={(event) => setDocumentsToCarry(event.target.value)}
              />
            </Field>
            <Button type="submit" disabled={Boolean(pending)}>
              {pending === "schedule" ? "Assigning…" : "Assign date and time"}
            </Button>
          </form>
        </Card>
      ) : null}

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
