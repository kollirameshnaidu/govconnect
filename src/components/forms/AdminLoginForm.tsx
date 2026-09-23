"use client";

import { CredentialsLoginForm } from "@/components/forms/CredentialsLoginForm";
import { routes } from "@/constants/routes";
import Link from "next/link";

type AdminLoginFormProps = {
  heading?: string;
  nextPath?: string;
};

export function AdminLoginForm({ heading = "Admin sign-in", nextPath }: AdminLoginFormProps) {
  return (
    <CredentialsLoginForm
      role="admin"
      heading={heading}
      description="Super, district, and department administrators share this portal with a permission map. Administrators do not assign a confirmed appointment slot."
      submitLabel="Open admin portal"
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
          . Front desk staff use{" "}
          <Link href={routes.frontDeskLogin} className="font-semibold text-navy-700">
            front desk sign-in
          </Link>
          .
        </p>
      }
    />
  );
}
