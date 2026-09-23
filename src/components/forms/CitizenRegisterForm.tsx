"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input, PasswordInput } from "@/components/common/FormControls";
import { routes } from "@/constants/routes";
import { isValidEmail, passwordIssue } from "@/lib/auth-rules";
import { registerCitizen } from "@/services/authService";

export function CitizenRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Enter your full name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    const passwordError = passwordIssue(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = await registerCitizen({ name, email, mobile, password, confirmPassword });
      setSuccess(result.message || "Check your email and confirm your address to finish registration.");
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
        <Input id="reg-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
      </Field>
      <Field id="reg-email" label="Email" required>
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </Field>
      <Field id="reg-mobile" label="Mobile number" required hint="Used to track appointments. This is not used for login.">
        <Input
          id="reg-mobile"
          inputMode="numeric"
          maxLength={10}
          value={mobile}
          onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
      </Field>
      <Field id="reg-password" label="Password" required hint="At least 8 characters, with letters, numbers, and a symbol.">
        <PasswordInput
          id="reg-password"
          name="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />
      </Field>
      <Field id="reg-confirm" label="Confirm password" required>
        <PasswordInput
          id="reg-confirm"
          name="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : "Create account"}
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
