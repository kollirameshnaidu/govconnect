"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input, PasswordInput } from "@/components/common/FormControls";
import {
  DEMO_ADMIN_STAFF_ID,
  DEMO_CITIZEN_EMAIL,
  DEMO_FRONT_DESK_STAFF_ID,
  DEMO_OFFICIAL_STAFF_ID,
} from "@/constants/auth";
import { routes } from "@/constants/routes";
import {
  setAdminSession,
  setCitizenSession,
  setFrontDeskSession,
  setOfficialSession,
} from "@/lib/auth-store";
import { isValidEmail, staffLoginEmail } from "@/lib/auth-rules";
import {
  postAdminLoginPath,
  postFrontDeskLoginPath,
  postLoginPath,
  postOfficialLoginPath,
} from "@/lib/session";
import { loginWithPassword } from "@/services/authService";
import type { UserRole } from "@/types";

type CredentialsLoginFormProps = {
  role: UserRole;
  heading: string;
  description: string;
  submitLabel: string;
  nextPath?: string;
  intent?: string;
  footer?: ReactNode;
};

function demoEmail(role: UserRole) {
  if (role === "official") return staffLoginEmail(DEMO_OFFICIAL_STAFF_ID);
  if (role === "frontdesk") return staffLoginEmail(DEMO_FRONT_DESK_STAFF_ID);
  if (role === "admin") return staffLoginEmail(DEMO_ADMIN_STAFF_ID);
  return DEMO_CITIZEN_EMAIL;
}

export function CredentialsLoginForm({
  role,
  heading,
  description,
  submitLabel,
  nextPath,
  intent,
  footer,
}: CredentialsLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!password) {
      setError("Enter your password.");
      setSuccess("");
      return;
    }
    setPending(true);
    setError("");
    try {
      const session = await loginWithPassword(role, email, password);
      if (session.role === "citizen") setCitizenSession(session);
      if (session.role === "official") setOfficialSession(session);
      if (session.role === "frontdesk") setFrontDeskSession(session);
      if (session.role === "admin") setAdminSession(session);
      setSuccess("Signed in. Opening your portal.");
      if (session.role === "official") router.push(postOfficialLoginPath(nextPath));
      else if (session.role === "frontdesk") router.push(postFrontDeskLoginPath(nextPath));
      else if (session.role === "admin") router.push(postAdminLoginPath(nextPath));
      else router.push(postLoginPath(intent, nextPath));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSuccess("");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div>
        <h2 className="text-lg font-bold text-navy-900">{heading}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field id={`${role}-email`} label="Email address" required>
        <Input
          id={`${role}-email`}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </Field>
      <Field id={`${role}-password`} label="Password" required>
        <PasswordInput
          id={`${role}-password`}
          name="password"
          value={password}
          onChange={setPassword}
        />
      </Field>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : submitLabel}
      </Button>
      <p className="text-sm text-muted">
        <Link href={routes.forgotPassword} className="font-semibold text-navy-700">
          Forgot password
        </Link>
        {role === "citizen" ? (
          <>
            {" "}
            · New citizen?{" "}
            <Link href={routes.register} className="font-semibold text-navy-700">
              Create an account
            </Link>
          </>
        ) : null}
      </p>
      {footer}
    </form>
  );
}
