"use client";

import { CredentialsLoginForm } from "@/components/forms/CredentialsLoginForm";
import { routes } from "@/constants/routes";
import Link from "next/link";

type OfficialLoginFormProps = {
  heading?: string;
  nextPath?: string;
};

export function OfficialLoginForm({
  heading = "Official sign-in",
  nextPath,
}: OfficialLoginFormProps) {
  return (
    <CredentialsLoginForm
      role="official"
      heading={heading}
      description="Staff sign in with the office-issued email and password. Citizen accounts cannot open this desk."
      submitLabel="Open official portal"
      nextPath={nextPath}
      footer={
        <p className="text-sm text-muted">
          Citizen booking uses{" "}
          <Link href={routes.login} className="font-semibold text-navy-700">
            citizen login
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
      }
    />
  );
}
