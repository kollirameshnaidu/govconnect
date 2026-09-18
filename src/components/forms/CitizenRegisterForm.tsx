"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { routes } from "@/constants/routes";
import { setCitizenSession } from "@/lib/auth-store";
import { registerCitizen } from "@/services/authService";

export function CitizenRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const session = await registerCitizen({ name, mobile, email });
      setCitizenSession(session);
      setSuccess("Registration complete. Opening your citizen dashboard.");
      router.push(routes.citizenDashboard);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      setSuccess("");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field id="reg-name" label="Full name" required>
        <Input
          id="reg-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
        />
      </Field>
      <Field id="reg-mobile" label="Mobile number" required>
        <Input
          id="reg-mobile"
          inputMode="numeric"
          maxLength={10}
          value={mobile}
          onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
      </Field>
      <Field id="reg-email" label="Email" hint="Optional. Used for appointment letters.">
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : "Register"}
      </Button>
      <p className="text-sm text-muted">
        Already registered?{" "}
        <Link href={routes.login} className="font-semibold text-navy-700">
          Login
        </Link>
      </p>
    </form>
  );
}
