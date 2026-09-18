"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Field, Input } from "@/components/common/FormControls";
import { routes } from "@/constants/routes";

export function FrontDeskSearchForm({
  initialId = "",
  initialMobile = "",
}: {
  initialId?: string;
  initialMobile?: string;
}) {
  const router = useRouter();
  const [appointmentId, setAppointmentId] = useState(initialId);
  const [mobile, setMobile] = useState(initialMobile);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (appointmentId.trim()) params.set("id", appointmentId.trim().toUpperCase());
    if (mobile.trim()) params.set("mobile", mobile.replace(/\D/g, "").slice(0, 10));
    router.push(`${routes.frontDeskSearch}?${params.toString()}`);
  }

  return (
    <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={onSubmit} noValidate>
      <Field id="fd-search-id" label="Appointment ID or visit token">
        <Input
          id="fd-search-id"
          value={appointmentId}
          onChange={(event) => setAppointmentId(event.target.value.toUpperCase())}
          placeholder="GC-2026-000198"
        />
      </Field>
      <Field id="fd-search-mobile" label="Registered mobile">
        <Input
          id="fd-search-mobile"
          inputMode="numeric"
          maxLength={10}
          value={mobile}
          onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="10-digit mobile"
        />
      </Field>
      <Button type="submit">Search</Button>
    </form>
  );
}
