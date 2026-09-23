"use client";

import { AppointmentTimeline } from "@/components/appointment/AppointmentTimeline";
import { CitizenScheduleActions } from "@/components/appointment/CitizenScheduleActions";
import { ConfirmVisitButton } from "@/components/appointment/ConfirmVisitButton";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { assignedSlotLabel, canConfirmVisit, isLetterAvailable } from "@/lib/appointment-lifecycle";
import { useCitizenAppointment } from "@/lib/use-citizen-appointments";

export function CitizenAppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const { appointment, ready } = useCitizenAppointment(session?.id, appointmentId);
  if (!session) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading appointment…</p>;
  }
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Appointment not found"
        description="This appointment ID is not linked to the signed-in citizen profile."
        action={
          <Button href={routes.citizenAppointments} variant="outline">
            Back to my appointments
          </Button>
        }
      />
    );
  }

  const letterReady = isLetterAvailable(appointment.status);

  return (
    <div className="grid max-w-3xl gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-navy-700">{appointment.id}</p>
          <h1 className="mt-1 text-2xl font-bold text-navy-900">{appointment.purpose}</h1>
          <p className="mt-2 text-sm text-muted">
            {appointment.officeName} · {appointment.departmentName}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </header>

      {canConfirmVisit(appointment.status) ? (
        <Alert tone="warning" title="Confirmation needed">
          An official assigned {appointment.confirmedAt}. Confirm the visit to
          issue the appointment letter and QR. The preferred date remains a request.
        </Alert>
      ) : (
        <Alert tone="info" title="Preferred date is not a booking">
          The preferred date is what you requested. The confirmed date and time
          are assigned by the official after review.
        </Alert>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Visit details</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <Row label="Official" value={appointment.officialName} />
          {appointment.category ? <Row label="Category" value={appointment.category} /> : null}
          <Row label="Preferred date" value={appointment.preferredDate} />
          <Row
            label={assignedSlotLabel(appointment.status)}
            value={appointment.confirmedAt ?? "Not assigned yet"}
          />
          <Row label="Submitted on" value={appointment.createdOn ?? "Not recorded"} />
          {appointment.documents?.length ? (
            <Row label="Documents" value={appointment.documents.join(", ")} />
          ) : null}
        </dl>
        {appointment.notes ? (
          <p className="mt-4 text-sm leading-6 text-ink">{appointment.notes}</p>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Status history</h2>
        <p className="mt-1 text-sm text-muted">
          This appointment ID stays the same if the request is transferred.
        </p>
        <div className="mt-4">
          <AppointmentTimeline appointment={appointment} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-navy-900">Letter and QR</h2>
        {letterReady ? (
          <p className="mt-2 text-sm leading-6 text-muted">
            The appointment letter and visit token are ready. Front desk can also
            search by this appointment ID if the token cannot be scanned.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted">
            The appointment letter and QR become available after you confirm a
            scheduled slot. Front desk can still search by this appointment ID.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {letterReady ? (
            <>
              <Button href={routes.citizenAppointmentLetter(appointment.id)}>
                Appointment letter
              </Button>
              <Button href={routes.citizenAppointmentQr(appointment.id)} variant="outline">
                Visit QR
              </Button>
            </>
          ) : (
            <>
              <Button disabled>Appointment letter</Button>
              <Button variant="outline" disabled>
                Visit QR
              </Button>
            </>
          )}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <ConfirmVisitButton appointment={appointment} />
        <CitizenScheduleActions appointment={appointment} />
        <Button href={routes.citizenAppointmentTrack(appointment.id)} variant="outline">
          Full tracking
        </Button>
        <Button href={routes.publicTrack(appointment.id)} variant="outline">
          Public tracking
        </Button>
        <Button href={routes.citizenAppointments} variant="outline">
          Back to list
        </Button>
      </div>
    </div>
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
