"use client";

import { CredentialsLoginForm } from "@/components/forms/CredentialsLoginForm";
import { routes } from "@/constants/routes";
import Link from "next/link";

type FrontDeskLoginFormProps = {
  heading?: string;
  nextPath?: string;
};

export function FrontDeskLoginForm({
  heading = "Front desk sign-in",
  nextPath,
}: FrontDeskLoginFormProps) {
  return (
    <CredentialsLoginForm
      role="frontdesk"
      heading={heading}
      description="Front desk staff sign in with email and password. This desk verifies visitors and manages the queue. It cannot assign a confirmed appointment slot."
      submitLabel="Open front desk"
      nextPath={nextPath}
      footer={
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
      }
    />
  );
}
