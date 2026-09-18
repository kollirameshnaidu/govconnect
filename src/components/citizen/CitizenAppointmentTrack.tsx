"use client";

import { AppointmentTrackPanel } from "@/components/appointment/AppointmentTrackPanel";
import { ConfirmVisitButton } from "@/components/appointment/ConfirmVisitButton";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isLetterAvailable } from "@/lib/appointment-lifecycle";
import { useCitizenAppointment } from "@/lib/use-citizen-appointments";

export function CitizenAppointmentTrack({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const { appointment, ready } = useCitizenAppointment(session?.id, appointmentId);
  if (!session) return null;
  if (!ready) return <p className="text-sm text-muted">Loading tracking…</p>;
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Appointment not found"
        description="This appointment ID is not linked to the signed-in citizen profile."
        action={<Button href={routes.citizenAppointments} variant="outline">Back to my appointments</Button>}
      />
    );
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Track {appointment.id}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Status history stays with this appointment ID, including transfers.
        </p>
      </header>
      <AppointmentTrackPanel appointment={appointment} />
      <div className="flex flex-wrap gap-2">
        <ConfirmVisitButton appointment={appointment} />
        {isLetterAvailable(appointment.status) ? (
          <>
            <Button href={routes.citizenAppointmentLetter(appointment.id)} variant="outline">
              Letter
            </Button>
            <Button href={routes.citizenAppointmentQr(appointment.id)} variant="outline">
              QR
            </Button>
          </>
        ) : null}
        <Button href={routes.citizenAppointment(appointment.id)} variant="outline">
          Appointment details
        </Button>
        <Button href={routes.publicTrack(appointment.id)} variant="outline">
          Public tracking
        </Button>
      </div>
    </div>
  );
}
