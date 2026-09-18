"use client";

import { VisitToken } from "@/components/appointment/VisitToken";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isLetterAvailable } from "@/lib/appointment-lifecycle";
import { useCitizenAppointment } from "@/lib/use-citizen-appointments";

export function CitizenAppointmentQr({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const { appointment, ready } = useCitizenAppointment(session?.id, appointmentId);
  if (!session) return null;
  if (!ready) return <p className="text-sm text-muted">Loading visit token…</p>;
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
      <div className="grid max-w-xl gap-4">
        <Alert tone="warning" title="QR not issued yet">
          The visit token is created after you confirm a scheduled slot.
        </Alert>
        <Button href={routes.citizenAppointment(appointment.id)} variant="outline">
          Back to appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="grid max-w-xl gap-4">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Visit QR</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Show this token at the front desk. If it cannot be scanned, quote
          appointment ID {appointment.id}.
        </p>
      </header>
      <Card className="grid justify-items-center gap-3 text-center">
        <VisitToken value={appointment.id} size={220} />
        <p className="text-lg font-bold text-navy-900">{appointment.id}</p>
        <p className="text-sm text-muted">
          {appointment.officeName} · {appointment.confirmedAt}
        </p>
      </Card>
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button href={routes.citizenAppointmentLetter(appointment.id)}>Appointment letter</Button>
        <Button href={routes.citizenAppointment(appointment.id)} variant="outline">
          Back to appointment
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print
        </Button>
      </div>
    </div>
  );
}
