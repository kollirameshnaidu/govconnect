"use client";

import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Textarea } from "@/components/common/FormControls";
import { Modal } from "@/components/common/Modal";
import { useSession } from "@/components/auth/AuthProvider";
import { canCancelAppointment, canRequestReschedule } from "@/lib/appointment-lifecycle";
import { isCitizenSession } from "@/lib/session";
import { cancelCitizenAppointment, requestCitizenReschedule } from "@/services/appointmentService";
import type { TrackedAppointment } from "@/types";

export function CitizenScheduleActions({ appointment }: { appointment: TrackedAppointment }) {
  const session = useSession();
  const [mode, setMode] = useState<"cancel" | "reschedule" | null>(null);
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!isCitizenSession(session)) return null;
  const citizen = session;
  const canCancel = canCancelAppointment(appointment.status);
  const canReschedule = canRequestReschedule(appointment.status);
  if (!canCancel && !canReschedule) return null;

  async function submit() {
    setPending(true);
    setError("");
    try {
      if (mode === "cancel") await cancelCitizenAppointment(citizen, appointment.id, reason);
      if (mode === "reschedule") await requestCitizenReschedule(citizen, appointment.id, reason);
      setMode(null);
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the appointment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {canCancel ? (
        <Button variant="outline" onClick={() => { setMode("cancel"); setError(""); }}>
          Cancel request
        </Button>
      ) : null}
      {canReschedule ? (
        <Button variant="outline" onClick={() => { setMode("reschedule"); setError(""); }}>
          Request reschedule
        </Button>
      ) : null}
      <Modal
        open={Boolean(mode)}
        title={mode === "cancel" ? "Cancel this request" : "Request a new confirmed slot"}
        onClose={() => {
          if (!pending) setMode(null);
        }}
      >
        <p className="text-sm leading-6 text-muted">
          {mode === "cancel"
            ? "The appointment ID stays on record. This does not delete history."
            : "An official will assign a new confirmed date and time. Your preferred date is still only a request."}
        </p>
        <div className="mt-4">
          <Field
            id="schedule-reason"
            label={mode === "cancel" ? "Reason (optional)" : "Reason"}
            required={mode === "reschedule"}
          >
            <Textarea id="schedule-reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          </Field>
        </div>
        {error ? (
          <Alert tone="danger" className="mt-3">
            {error}
          </Alert>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : mode === "cancel" ? "Cancel request" : "Send reschedule request"}
          </Button>
          <Button variant="outline" onClick={() => setMode(null)} disabled={pending}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
