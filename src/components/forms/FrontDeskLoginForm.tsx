"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { DEMO_FRONT_DESK_STAFF_ID, MOCK_OTP } from "@/constants/auth";
import { routes } from "@/constants/routes";
import { setFrontDeskSession } from "@/lib/auth-store";
import { postFrontDeskLoginPath } from "@/lib/session";
import { sendFrontDeskOtp, verifyFrontDeskOtp } from "@/services/authService";

type FrontDeskLoginFormProps = {
  heading?: string;
  nextPath?: string;
};

export function FrontDeskLoginForm({
  heading = "Front desk sign-in",
  nextPath,
}: FrontDeskLoginFormProps) {
  const router = useRouter();
  const [staffId, setStaffId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  function validateStaffId(value: string) {
    if (value.trim().length < 6) return "Enter the front desk staff ID issued by your office.";
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
      await sendFrontDeskOtp(staffId);
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
      const session = await verifyFrontDeskOtp(staffId, otp);
      setFrontDeskSession(session);
      setSuccess("Login verified. Opening the front desk.");
      router.push(postFrontDeskLoginPath(nextPath));
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
          Front desk staff sign in with an office-issued ID. This desk verifies visitors and
          manages the queue. It cannot assign a confirmed appointment slot. Demo:{" "}
          {DEMO_FRONT_DESK_STAFF_ID}, OTP {MOCK_OTP}.
        </p>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field
        id="frontdesk-staff-id"
        label="Staff ID"
        required
        error={error && !otpSent ? error : undefined}
      >
        <Input
          id="frontdesk-staff-id"
          name="staffId"
          autoComplete="username"
          placeholder="e.g. FD-1101"
          value={staffId}
          onChange={(event) => setStaffId(event.target.value.toUpperCase())}
          required
        />
      </Field>
      {otpSent ? (
        <Field id="frontdesk-otp" label="One-time password" required>
          <Input
            id="frontdesk-otp"
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
        {pending ? "Please wait…" : otpSent ? "Open front desk" : "Send OTP"}
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
        . Administrators use{" "}
        <Link href={routes.adminLogin} className="font-semibold text-navy-700">
          admin sign-in
        </Link>
        .
      </p>
    </form>
  );
}
