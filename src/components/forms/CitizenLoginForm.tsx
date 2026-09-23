"use client";

import { CredentialsLoginForm } from "@/components/forms/CredentialsLoginForm";
import { routes } from "@/constants/routes";
import Link from "next/link";

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
  return (
    <CredentialsLoginForm
      role="citizen"
      heading={heading}
      description="Use your registered email and password. Public pages do not require login."
      submitLabel="Login"
      intent={intent}
      nextPath={nextPath}
      footer={
        compact ? null : (
          <p className="text-sm text-muted">
            Officers use{" "}
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
        )
      }
    />
  );
}
