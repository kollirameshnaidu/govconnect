"use client";

import { FormEvent, useState } from "react";
import { AppointmentTimeline } from "@/components/appointment/AppointmentTimeline";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Textarea } from "@/components/common/FormControls";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import {
  canCloseAppointment,
  canCompleteMeeting,
  canStartMeeting,
} from "@/lib/appointment-lifecycle";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointment } from "@/lib/use-citizen-appointments";
import {
  addOfficialMeetingNotes,
  closeOfficialAppointment,
  completeOfficialMeeting,
  startOfficialMeeting,
} from "@/services/appointmentService";
import type { TrackedAppointment } from "@/types";

export function OfficialMeeting({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const { appointment, ready } = useOfficialAppointment(official, appointmentId);

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading meeting…</p>;
  }
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Meeting not on this desk"
        description="This appointment is not assigned to your office and department."
        action={
          <Button href={routes.officialAppointments} variant="outline">
            Back to appointments
          </Button>
        }
      />
    );
  }

  return <MeetingBody appointment={appointment} />;
}

function MeetingBody({ appointment }: { appointment: TrackedAppointment }) {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [notes, setNotes] = useState("");
  const [actionTaken, setActionTaken] = useState(appointment.actionTaken ?? "");

  if (!official) return null;
  const desk = official;

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

  async function onNotes(event: FormEvent) {
    event.preventDefault();
    await run("notes", async () => {
      await addOfficialMeetingNotes(desk, appointment.id, notes);
      setNotes("");
    });
  }

  async function onClose(event: FormEvent) {
    event.preventDefault();
    await run("close", () => closeOfficialAppointment(desk, appointment.id, actionTaken));
  }

  const meetingReady =
    canStartMeeting(appointment.status) ||
    canCompleteMeeting(appointment.status) ||
    canCloseAppointment(appointment.status) ||
    appointment.status === "CLOSED";

  if (!meetingReady) {
    return (
      <EmptyState
        icon="clock"
        title="Visit is not ready for a meeting"
        description="Start a meeting after the citizen confirms the assigned slot. Scheduled visits still wait for confirmation."
        action={
          <Button href={routes.officialRequest(appointment.id)} variant="outline">
            Open request
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-700">{appointment.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">Meeting</h1>
          <p className="mt-2 text-sm text-muted">
            {appointment.citizenName ?? "Citizen"} · {appointment.purpose}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </header>

      <Alert tone="info">
        Confirmed slot: {appointment.confirmedAt ?? "Not assigned"}. The preferred date{" "}
        {appointment.preferredDate} remains the original request.
      </Alert>
      {error ? <Alert tone="danger">{error}</Alert> : null}

      <Card>
        <dl className="grid gap-3 text-sm">
          <Row label="Citizen" value={appointment.citizenName ?? "Not recorded"} />
          <Row label="Office" value={appointment.officeName} />
          <Row label="Purpose" value={appointment.purpose} />
          <Row label="Assigned slot" value={appointment.confirmedAt ?? "Not assigned yet"} />
        </dl>
        {appointment.meetingNotes ? (
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-navy-900">Recorded notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">
              {appointment.meetingNotes}
            </p>
          </div>
        ) : null}
        {appointment.actionTaken ? (
          <p className="mt-4 text-sm leading-6 text-ink">
            Action taken: {appointment.actionTaken}
          </p>
        ) : null}
      </Card>

      {canStartMeeting(appointment.status) ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Start meeting</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Record that the citizen is with you before adding notes.
          </p>
          <Button
            className="mt-4"
            onClick={() => run("start", () => startOfficialMeeting(desk, appointment.id))}
            disabled={Boolean(pending)}
          >
            {pending === "start" ? "Starting…" : "Start meeting"}
          </Button>
        </Card>
      ) : null}

      {appointment.status === "MEETING_IN_PROGRESS" ||
      appointment.status === "MEETING_COMPLETED" ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Meeting notes</h2>
          <form className="mt-4 grid gap-4" onSubmit={onNotes} noValidate>
            <Field id="meeting-notes" label="Add a note" required hint="At least 8 characters.">
              <Textarea
                id="meeting-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" variant="outline" disabled={Boolean(pending)}>
              {pending === "notes" ? "Saving…" : "Save note"}
            </Button>
          </form>
        </Card>
      ) : null}

      {canCompleteMeeting(appointment.status) ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Complete meeting</h2>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() =>
              run("complete", () => completeOfficialMeeting(desk, appointment.id))
            }
            disabled={Boolean(pending)}
          >
            {pending === "complete" ? "Completing…" : "Mark meeting completed"}
          </Button>
        </Card>
      ) : null}

      {canCloseAppointment(appointment.status) ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Close appointment</h2>
          <form className="mt-4 grid gap-4" onSubmit={onClose} noValidate>
            <Field id="action-taken" label="Action taken" required hint="At least 10 characters.">
              <Textarea
                id="action-taken"
                value={actionTaken}
                onChange={(event) => setActionTaken(event.target.value)}
                required
              />
            </Field>
            <Button type="submit" disabled={Boolean(pending)}>
              {pending === "close" ? "Closing…" : "Close appointment"}
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
