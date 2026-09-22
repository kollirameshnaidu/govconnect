"use client";

import { FormEvent, useState } from "react";
import { useSession } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Field, Input } from "@/components/common/FormControls";
import { setCitizenSession } from "@/lib/auth-store";
import { isCitizenSession, maskMobile } from "@/lib/session";
import { updateCitizenProfile } from "@/services/authService";

export function CitizenProfileForm() {
  const session = useSession();
  const citizen = isCitizenSession(session) ? session : null;
  const [name, setName] = useState(citizen?.name ?? "");
  const [email, setEmail] = useState(citizen?.email ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!citizen) return null;
  const current = citizen;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Enter your full name.");
      setSuccess("");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      setSuccess("");
      return;
    }
    try {
      const next = await updateCitizenProfile({ name: name.trim(), email: email.trim() });
      setCitizenSession(next);
      setError("");
      setSuccess("Profile saved.");
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
          Email is the login identity. Mobile number is used to track appointments.
        </p>
      </header>
      <Card padding="lg">
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          {success ? <Alert tone="success">{success}</Alert> : null}
          <Field id="profile-name" label="Full name" required>
            <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field id="profile-mobile" label="Mobile number" hint="Used to track appointments. Cannot be changed here.">
            <Input id="profile-mobile" value={maskMobile(current.mobile)} disabled />
          </Field>
          <Field id="profile-email" label="Email" required hint="Used to sign in.">
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
