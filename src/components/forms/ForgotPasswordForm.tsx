"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { routes } from "@/constants/routes";
import { GENERIC_RESET_SENT, isValidEmail } from "@/lib/auth-rules";
import { requestPasswordReset } from "@/services/authService";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setSuccess("");
      return;
    }
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await requestPasswordReset(email);
      setSuccess(GENERIC_RESET_SENT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the reset email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field id="forgot-email" label="Email address" required>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : "Send reset link"}
      </Button>
      <p className="text-sm text-muted">
        Remembered your password?{" "}
        <Link href={routes.login} className="font-semibold text-navy-700">
          Login
        </Link>
      </p>
    </form>
  );
}
