"use client";

import { FormEvent, useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Field, Input } from "@/components/common/FormControls";
import { setOfficialSession } from "@/lib/auth-store";
import { isOfficialSession } from "@/lib/session";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficeById } from "@/services/officeService";

export function OfficialProfileForm() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const [name, setName] = useState(official?.name ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!official) return null;
  const desk = official;
  const office = getOfficeById(desk.officeId);
  const department = getDepartmentById(desk.departmentId);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Enter the display name used on appointment letters.");
      setSuccess("");
      return;
    }
    setOfficialSession({
      ...desk,
      name: name.trim(),
    });
    setError("");
    setSuccess("Profile updated for this demo session.");
  }

  return (
    <div className="grid max-w-xl gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Profile</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sign-in uses the office email derived from staff ID. Office and department come from
          the staff record and cannot be changed here.
        </p>
      </header>
      <Card padding="lg">
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Field id="official-name" label="Display name" required>
            <Input id="official-name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field id="official-staff" label="Staff ID" hint="Used to create the sign-in email. Cannot be changed here.">
            <Input id="official-staff" value={desk.staffId} disabled />
          </Field>
          <Field id="official-designation" label="Designation">
            <Input id="official-designation" value={desk.designation} disabled />
          </Field>
          <Field id="official-office" label="Office">
            <Input id="official-office" value={office?.name ?? desk.officeId} disabled />
          </Field>
          <Field id="official-department" label="Department">
            <Input id="official-department" value={department?.name ?? desk.departmentId} disabled />
          </Field>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
