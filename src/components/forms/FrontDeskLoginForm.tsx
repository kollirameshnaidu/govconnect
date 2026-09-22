"use client";

import { CredentialsLoginForm } from "@/components/forms/CredentialsLoginForm";
import { DEMO_FRONT_DESK_STAFF_ID, DEMO_PASSWORD } from "@/constants/auth";
import { routes } from "@/constants/routes";
import { staffLoginEmail } from "@/lib/auth-rules";
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
      description={`Front desk staff sign in with email and password. This desk verifies visitors and manages the queue. It cannot assign a confirmed appointment slot. Demo: ${staffLoginEmail(DEMO_FRONT_DESK_STAFF_ID)}, password ${DEMO_PASSWORD}.`}
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
