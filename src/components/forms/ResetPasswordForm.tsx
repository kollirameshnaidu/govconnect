"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, PasswordInput } from "@/components/common/FormControls";
import { routes } from "@/constants/routes";
import { passwordIssue } from "@/lib/auth-rules";
import { resetPasswordWithToken } from "@/services/authService";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) {
      setError("This reset link is invalid or has expired.");
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
      await resetPasswordWithToken(token, password, confirmPassword);
      setSuccess("Password updated. You can sign in with the new password.");
      router.push(routes.login);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset the password.");
      setSuccess("");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field id="reset-password" label="New password" required hint="At least 8 characters, with letters and numbers.">
        <PasswordInput
          id="reset-password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />
      </Field>
      <Field id="reset-confirm" label="Confirm password" required>
        <PasswordInput
          id="reset-confirm"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          required
        />
      </Field>
      <Button type="submit" className="w-full" disabled={pending || !token}>
        {pending ? "Please wait…" : "Reset password"}
      </Button>
      <p className="text-sm text-muted">
        <Link href={routes.login} className="font-semibold text-navy-700">
          Back to login
        </Link>
      </p>
    </form>
  );
}
