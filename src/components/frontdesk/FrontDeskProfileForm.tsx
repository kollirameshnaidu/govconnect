"use client";

import { FormEvent, useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Field, Input } from "@/components/common/FormControls";
import { setFrontDeskSession } from "@/lib/auth-store";
import { isFrontDeskSession } from "@/lib/session";
import { updateStaffProfile } from "@/services/authService";
import { getOfficeById } from "@/services/officeService";

export function FrontDeskProfileForm() {
  const session = useSession();
  const staff = isFrontDeskSession(session) ? session : null;
  const [name, setName] = useState(staff?.name ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!staff) return null;
  const desk = staff;
  const office = getOfficeById(desk.officeId);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Enter the display name used on the visit history.");
      setSuccess("");
      return;
    }
    try {
      const data = await updateStaffProfile({ name: name.trim() });
      if (isFrontDeskSession(data.session)) setFrontDeskSession(data.session);
      setError("");
      setSuccess(data.message || "Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the profile.");
      setSuccess("");
    }
  }

  return (
    <div className="grid max-w-xl gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sign-in uses the office email derived from staff ID. This desk is tied to one office and
          cannot assign a confirmed appointment slot.
        </p>
      </header>
      <Card padding="lg">
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Field id="fd-name" label="Display name" required>
            <Input id="fd-name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field id="fd-staff" label="Staff ID" hint="Used to create the sign-in email. Cannot be changed here.">
            <Input id="fd-staff" value={desk.staffId} disabled />
          </Field>
          <Field id="fd-designation" label="Designation">
            <Input id="fd-designation" value={desk.designation} disabled />
          </Field>
          <Field id="fd-office" label="Office">
            <Input id="fd-office" value={office?.name ?? desk.officeId} disabled />
          </Field>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
