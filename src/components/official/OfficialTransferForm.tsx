"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Select, Textarea } from "@/components/common/FormControls";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { canTransfer } from "@/lib/appointment-lifecycle";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointment } from "@/lib/use-citizen-appointments";
import { transferOfficialRequest } from "@/services/appointmentService";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficeById } from "@/services/officeService";
import { getAllOfficials, getOfficialById } from "@/services/officialService";

export function OfficialTransferForm({ appointmentId }: { appointmentId: string }) {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const router = useRouter();
  const { appointment, ready } = useOfficialAppointment(official, appointmentId);
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const receivers = useMemo(
    () => getAllOfficials().filter((item) => item.id !== official?.id),
    [official?.id],
  );
  const selected = targetId ? getOfficialById(targetId) : undefined;
  const selectedOffice = selected ? getOfficeById(selected.officeId) : undefined;
  const selectedDepartment = selected ? getDepartmentById(selected.departmentId) : undefined;

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading request…</p>;
  }
  if (!appointment) {
    return (
      <EmptyState
        icon="search"
        title="Request not on this desk"
        description="Only requests on your office desk can be transferred."
        action={
          <Button href={routes.officialRequests} variant="outline">
            Back to requests
          </Button>
        }
      />
    );
  }
  if (!canTransfer(appointment.status)) {
    return (
      <EmptyState
        icon="info"
        title="Transfer is not available"
        description="This request cannot be transferred in its current status."
        action={
          <Button href={routes.officialRequest(appointment.id)} variant="outline">
            Back to request
          </Button>
        }
      />
    );
  }

  const desk = official;
  const current = appointment;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const next = await transferOfficialRequest(desk, current.id, {
        officialId: targetId,
        reason,
      });
      router.push(routes.officialRequest(next.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid max-w-xl gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Transfer request</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Appointment ID {appointment.id} stays the same. The receiving desk continues the review.
        </p>
      </header>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-navy-900">{appointment.id}</p>
            <p className="mt-1 text-sm text-muted">{appointment.purpose}</p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Current desk: {appointment.departmentName} · {appointment.officialName}
        </p>
      </Card>
      <Card padding="lg">
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <Alert tone="info">
            Transfer does not assign a confirmed slot. The preferred date remains a request.
          </Alert>
          <Field id="transfer-official" label="Receiving official" required>
            <Select
              id="transfer-official"
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
              required
            >
              <option value="">Select an official</option>
              {receivers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}, {item.designation} ({item.staffId})
                </option>
              ))}
            </Select>
          </Field>
          {selected ? (
            <p className="text-sm text-muted">
              Destination: {selectedOffice?.name} · {selectedDepartment?.name}
            </p>
          ) : null}
          <Field id="transfer-reason" label="Reason" required hint="At least 10 characters.">
            <Textarea
              id="transfer-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Transferring…" : "Transfer and keep ID"}
            </Button>
            <Button href={routes.officialRequest(appointment.id)} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
