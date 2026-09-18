"use client";

import { AppointmentLetter } from "@/components/appointment/AppointmentLetter";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isLetterAvailable } from "@/lib/appointment-lifecycle";
import { useCitizenAppointment } from "@/lib/use-citizen-appointments";

export function CitizenAppointmentLetter({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const { appointment, ready } = useCitizenAppointment(session?.id, appointmentId);
  if (!session) return null;
  if (!ready) return <p className="text-sm text-muted">Loading letter…</p>;
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
  if (!isLetterAvailable(appointment.status)) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Alert tone="warning" title="Letter not issued yet">
          Confirm the assigned slot after an official schedules the visit. Front
          desk can still search by appointment ID {appointment.id}.
        </Alert>
        <div className="flex flex-wrap gap-2">
          <Button href={routes.citizenAppointment(appointment.id)} variant="outline">
            Back to appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button href={routes.citizenAppointment(appointment.id)} variant="outline">
          Back to appointment
        </Button>
        <Button href={routes.citizenAppointmentQr(appointment.id)} variant="outline">
          Visit QR
        </Button>
      </div>
      <AppointmentLetter appointment={appointment} citizenName={session.name} />
    </div>
  );
}
