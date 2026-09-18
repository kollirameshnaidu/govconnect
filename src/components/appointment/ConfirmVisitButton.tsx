"use client";

import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useSession } from "@/components/auth/AuthProvider";
import { canConfirmVisit } from "@/lib/appointment-lifecycle";
import { isCitizenSession } from "@/lib/session";
import { confirmCitizenVisit } from "@/services/appointmentService";
import type { TrackedAppointment } from "@/types";

export function ConfirmVisitButton({ appointment }: { appointment: TrackedAppointment }) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!isCitizenSession(session) || !canConfirmVisit(appointment.status)) return null;
  const citizen = session;

  async function confirm() {
    setPending(true);
    setError("");
    try {
      await confirmCitizenVisit(citizen, appointment.id);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not confirm the visit.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Confirm visit</Button>
      <Modal
        open={open}
        title="Confirm the assigned slot"
        onClose={() => {
          if (!pending) setOpen(false);
        }}
      >
        <p className="text-sm leading-6 text-muted">
          Confirming records that you will attend on {appointment.confirmedAt}. This
          does not change the appointment ID. The letter and QR become available
          after confirmation.
        </p>
        {error ? (
          <Alert tone="danger" className="mt-3">
            {error}
          </Alert>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={confirm} disabled={pending}>
            {pending ? "Confirming…" : "Confirm assigned slot"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
