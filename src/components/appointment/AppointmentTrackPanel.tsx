import { AppointmentStatus } from "@/constants/appointment-status";
import { Alert } from "@/components/common/Alert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AppointmentJourneyProgress } from "@/components/appointment/AppointmentJourneyProgress";
import { AppointmentTimeline } from "@/components/appointment/AppointmentTimeline";
import { assignedSlotLabel } from "@/lib/appointment-lifecycle";
import type { TrackedAppointment } from "@/types";

export function AppointmentTrackPanel({ appointment }: { appointment: TrackedAppointment }) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-navy-900">{appointment.id}</p>
          <p className="mt-1 text-sm text-muted">
            {appointment.officeName} · {appointment.departmentName}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <Alert tone="info" title="Preferred date is not a booking">
        The preferred date is the citizen request. The assigned or confirmed
        date and time come from official review.
      </Alert>

      {appointment.transfer ? (
        <Alert tone="warning" title="Request transferred">
          Moved from {appointment.transfer.fromDepartment} (
          {appointment.transfer.fromOfficial}) to {appointment.transfer.toDepartment} (
          {appointment.transfer.toOfficial}). Reason: {appointment.transfer.reason}. The
          appointment ID did not change.
        </Alert>
      ) : null}

      {appointment.status === AppointmentStatus.WAITING && appointment.queuePosition ? (
        <Alert tone="warning" title="Waiting queue">
          You are number {appointment.queuePosition} in the front-desk queue.
        </Alert>
      ) : null}

      {appointment.status === AppointmentStatus.MEETING_IN_PROGRESS ? (
        <Alert tone="info" title="Meeting in progress">
          The official has started the meeting. Remain at the desk until it is closed.
        </Alert>
      ) : null}

      <AppointmentJourneyProgress status={appointment.status} />

      <dl className="grid gap-2 text-sm">
        <Row label="Official" value={appointment.officialName} />
        {appointment.category ? <Row label="Category" value={appointment.category} /> : null}
        <Row label="Purpose" value={appointment.purpose} />
        <Row label="Preferred date" value={appointment.preferredDate} />
        <Row
          label={assignedSlotLabel(appointment.status)}
          value={appointment.confirmedAt ?? "Not assigned yet"}
        />
        {appointment.queuePosition ? (
          <Row label="Queue position" value={String(appointment.queuePosition)} />
        ) : null}
      </dl>

      {appointment.notes ? (
        <p className="text-sm leading-6 text-ink">{appointment.notes}</p>
      ) : null}

      <div>
        <h3 className="text-sm font-semibold text-navy-900">Status history</h3>
        <div className="mt-3">
          <AppointmentTimeline appointment={appointment} />
        </div>
      </div>
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
