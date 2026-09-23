"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { setCitizenSession } from "@/lib/auth-store";
import { routes } from "@/constants/routes";
import { confirmCitizenEmail } from "@/services/authService";

export function ConfirmEmailForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("token")) {
        url.searchParams.delete("token");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
    }
    if (!token) {
      setError("This confirmation link is invalid or has expired.");
      return;
    }
    let cancelled = false;
    confirmCitizenEmail(token)
      .then((session) => {
        if (cancelled) return;
        setCitizenSession(session);
        setSuccess("Email confirmed. Opening your citizen dashboard.");
        router.push(routes.citizenDashboard);
        router.refresh();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "This confirmation link is invalid or has expired.");
      });
    return () => {
      cancelled = true;
    };
  }, [router, token]);

  return (
    <div className="grid gap-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      {!error && !success ? <p className="text-sm text-muted">Confirming your email address…</p> : null}
      {error ? (
        <p className="text-sm text-muted">
          <Link href={routes.login} className="font-semibold text-navy-700">
            Back to login
          </Link>
        </p>
      ) : null}
    </div>
  );
}
