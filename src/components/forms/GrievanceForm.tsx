"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input, Select, Textarea } from "@/components/common/FormControls";
import { submitGrievance } from "@/services/feedbackService";

export function GrievanceForm() {
  const [submittedId, setSubmittedId] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const mobile = String(data.get("mobile") ?? "");
    const type = String(data.get("type") ?? "other");
    const details = String(data.get("details") ?? "").trim();
    if (name.length < 3) {
      setError("Enter your full name.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    if (details.length < 20) {
      setError("Describe the issue in at least 20 characters.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const grievance = await submitGrievance({ name, mobile, type, details });
      setSubmittedId(grievance.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the grievance.");
    } finally {
      setPending(false);
    }
  }

  if (submittedId) {
    return (
      <Alert tone="success" title="Grievance recorded">
        Reference {submittedId} has been generated. This does not create or confirm an appointment.
      </Alert>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field id="grv-name" label="Full name" required>
        <Input id="grv-name" name="name" required />
      </Field>
      <Field id="grv-mobile" label="Mobile number" required>
        <Input id="grv-mobile" name="mobile" inputMode="numeric" maxLength={10} required />
      </Field>
      <Field id="grv-type" label="Grievance type">
        <Select id="grv-type" name="type" defaultValue="delay">
          <option value="delay">Delay in review</option>
          <option value="transfer">Incorrect transfer</option>
          <option value="front-desk">Front desk experience</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field id="grv-details" label="Details" required>
        <Textarea id="grv-details" name="details" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Please wait…" : "Submit grievance"}
      </Button>
    </form>
  );
}
