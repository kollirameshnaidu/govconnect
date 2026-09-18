"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { DEMO_ADMIN_STAFF_ID, MOCK_OTP } from "@/constants/auth";
import { routes } from "@/constants/routes";
import { setAdminSession } from "@/lib/auth-store";
import { postAdminLoginPath } from "@/lib/session";
import { sendAdminOtp, verifyAdminOtp } from "@/services/authService";

type AdminLoginFormProps = {
  heading?: string;
  nextPath?: string;
};

export function AdminLoginForm({ heading = "Admin sign-in", nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  function validateStaffId(value: string) {
    if (value.trim().length < 6) return "Enter the administrator staff ID issued by your office.";
    return "";
  }

  async function sendOtp(event: FormEvent) {
    event.preventDefault();
    const nextError = validateStaffId(staffId);
    setError(nextError);
    setSuccess("");
    if (nextError) return;
    setPending(true);
    try {
      await sendAdminOtp(staffId);
      setOtpSent(true);
      setSuccess(`OTP sent to the registered staff contact. Use ${MOCK_OTP} in this demo.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setPending(false);
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const session = await verifyAdminOtp(staffId, otp);
      setAdminSession(session);
      setSuccess("Login verified. Opening the admin portal.");
      router.push(postAdminLoginPath(nextPath));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSuccess("");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={otpSent ? login : sendOtp} className="grid gap-4" noValidate>
      <div>
        <h2 className="text-lg font-bold text-navy-900">{heading}</h2>
        <p className="mt-1 text-sm text-muted">
          Super, district, and department administrators share this portal with a permission
          map. Administrators do not assign a confirmed appointment slot. Demo: {DEMO_ADMIN_STAFF_ID}{" "}
          (super), ADM-2101 (department), ADM-3101 (district). OTP {MOCK_OTP}.
        </p>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field id="admin-staff-id" label="Staff ID" required error={error && !otpSent ? error : undefined}>
        <Input
          id="admin-staff-id"
          name="staffId"
          autoComplete="username"
          placeholder="e.g. ADM-1101"
          value={staffId}
          onChange={(event) => setStaffId(event.target.value.toUpperCase())}
          required
        />
      </Field>
      {otpSent ? (
        <Field id="admin-otp" label="One-time password" required>
          <Input
            id="admin-otp"
            name="otp"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit OTP"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
            required
          />
        </Field>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Please wait…" : otpSent ? "Open admin portal" : "Send OTP"}
      </Button>
      <p className="text-sm text-muted">
        Citizens use{" "}
        <Link href={routes.login} className="font-semibold text-navy-700">
          citizen login
        </Link>
        . Officers use{" "}
        <Link href={routes.officialLogin} className="font-semibold text-navy-700">
          official sign-in
        </Link>
        . Front desk staff use{" "}
        <Link href={routes.frontDeskLogin} className="font-semibold text-navy-700">
          front desk sign-in
        </Link>
        .
      </p>
    </form>
  );
}
