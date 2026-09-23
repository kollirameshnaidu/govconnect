"use client";

import { FormEvent, useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Field, Input } from "@/components/common/FormControls";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AppointmentTrackPanel } from "@/components/appointment/AppointmentTrackPanel";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { isLetterAvailable } from "@/lib/appointment-lifecycle";
import { isCitizenSession } from "@/lib/session";
import { trackAppointment } from "@/services/appointmentService";
import type { TrackedAppointment } from "@/types";

type TrackAppointmentProps = {
  heading?: boolean;
  contained?: boolean;
  initialId?: string;
  initialMobile?: string;
};

export function TrackAppointment({
  heading = true,
  contained = true,
  initialId = "",
  initialMobile = "",
}: TrackAppointmentProps) {
  const session = useSession();
  const [appointmentId, setAppointmentId] = useState(initialId);
  const [mobile, setMobile] = useState(initialMobile);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<TrackedAppointment | null | undefined>(
    undefined,
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!appointmentId.trim()) {
      setError("Enter your appointment ID.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter the 10-digit mobile number used in the request.");
      return;
    }
    setError("");
    setPending(true);
    try {
      const next = await trackAppointment(appointmentId, mobile);
      setResult(next);
    } catch (err) {
      setResult(undefined);
      setError(err instanceof Error ? err.message : "Could not look up this appointment. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SectionFrame id="track" contained={contained}>
      {heading ? (
        <SectionHeading
          eyebrow="Appointment tracking"
          title="Track a request with your appointment ID"
          description="Demo IDs GC-2026-000184, GC-2026-000256, GC-2026-000201, and GC-2026-000088 need the mobile number recorded on that request."
        />
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <form className="grid gap-4" onSubmit={onSubmit} noValidate>
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <Field id="track-id" label="Appointment ID" required>
              <Input
                id="track-id"
                value={appointmentId}
                onChange={(event) => setAppointmentId(event.target.value)}
                placeholder="GC-2026-000184"
                required
              />
            </Field>
            <Field id="track-mobile" label="Registered mobile number" required>
              <Input
                id="track-mobile"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(event) =>
                  setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit mobile number"
                required
              />
            </Field>
            <Button type="submit" disabled={pending}>
              {pending ? "Searching…" : "Track appointment"}
            </Button>
          </form>
        </Card>
        <Card>
          {pending ? (
            <Alert tone="info">Looking up the appointment…</Alert>
          ) : result === undefined ? (
            <Alert tone="info">
              Tracking is public. Login is only required for personal actions
              such as confirmation or document download.
            </Alert>
          ) : result === null ? (
            <Alert tone="warning" title="No appointment found">
              Check the appointment ID and registered mobile number. If this
              request belongs to you, log in for the full history.
            </Alert>
          ) : (
            <div className="grid gap-4">
              <AppointmentTrackPanel appointment={result} />
              {isLetterAvailable(result.status) ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    href={
                      isCitizenSession(session)
                        ? routes.citizenAppointmentLetter(result.id)
                        : `${routes.login}?next=${routes.citizenAppointmentLetter(result.id)}`
                    }
                    size="sm"
                  >
                    Appointment letter
                  </Button>
                  <Button
                    href={
                      isCitizenSession(session)
                        ? routes.citizenAppointmentQr(result.id)
                        : `${routes.login}?next=${routes.citizenAppointmentQr(result.id)}`
                    }
                    variant="outline"
                    size="sm"
                  >
                    Visit QR
                  </Button>
                </div>
              ) : (
                <Alert tone="warning">
                  Letter and QR become available after the official assigns a slot
                  and the citizen confirms the visit.
                </Alert>
              )}
            </div>
          )}
        </Card>
      </div>
    </SectionFrame>
  );
}
