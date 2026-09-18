"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { DEMO_CITIZEN_MOBILE, MOCK_OTP } from "@/constants/auth";
import { routes } from "@/constants/routes";
import { setCitizenSession } from "@/lib/auth-store";
import { postLoginPath } from "@/lib/session";
import { sendCitizenOtp, verifyCitizenOtp } from "@/services/authService";

type CitizenLoginFormProps = {
  heading?: string;
  compact?: boolean;
  intent?: string;
  nextPath?: string;
};

export function CitizenLoginForm({
  heading = "Citizen Access",
  compact = false,
  intent,
  nextPath,
}: CitizenLoginFormProps) {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);

  function validateMobile(value: string) {
    if (!/^\d{10}$/.test(value)) return "Enter a 10-digit mobile number.";
    return "";
  }

  async function sendOtp(event: FormEvent) {
    event.preventDefault();
    const nextError = validateMobile(mobile);
    setError(nextError);
    setSuccess("");
    if (nextError) return;
    setPending(true);
    try {
      await sendCitizenOtp(mobile);
      setOtpSent(true);
      setSuccess(`OTP sent to XXXXXX${mobile.slice(-4)}. Use ${MOCK_OTP} in this demo.`);
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
      const session = await verifyCitizenOtp(mobile, otp);
      setCitizenSession(session);
      setSuccess("Login verified. Opening your citizen dashboard.");
      const destination = postLoginPath(intent, nextPath);
      router.push(destination);
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
          Use your registered mobile number. Public pages do not require login.
          Demo profile: {DEMO_CITIZEN_MOBILE}, OTP {MOCK_OTP}.
        </p>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Field
        id="citizen-mobile"
        label="Mobile number"
        required
        error={error && !otpSent ? error : undefined}
      >
        <Input
          id="citizen-mobile"
          name="mobile"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={10}
          placeholder="10-digit mobile number"
          value={mobile}
          onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
          required
        />
      </Field>
      {otpSent ? (
        <Field id="citizen-otp" label="One-time password" required>
          <Input
            id="citizen-otp"
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
        {pending ? "Please wait…" : otpSent ? "Login" : "Send OTP"}
      </Button>
      {!compact ? (
        <p className="text-sm text-muted">
          New citizen?{" "}
          <Link href={routes.register} className="font-semibold text-navy-700">
            Register
          </Link>
          . Officers use{" "}
          <Link href={routes.officialLogin} className="font-semibold text-navy-700">
            official sign-in
          </Link>
          . Front desk staff use{" "}
          <Link href={routes.frontDeskLogin} className="font-semibold text-navy-700">
            front desk sign-in
          </Link>
          . Administrators use{" "}
          <Link href={routes.adminLogin} className="font-semibold text-navy-700">
            admin sign-in
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}
