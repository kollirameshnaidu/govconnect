"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Field, Input, Select } from "@/components/common/FormControls";
import { Icon } from "@/components/common/Icon";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { routes } from "@/constants/routes";
import { DISTRICTS } from "@/mock/homepage";
import { searchOffices } from "@/services/officeService";

type FindOfficeProps = {
  heading?: boolean;
  contained?: boolean;
};

export function FindOffice({ heading = true, contained = true }: FindOfficeProps) {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState<string>(DISTRICTS[0]);
  const [submitted, setSubmitted] = useState(false);

  const offices = useMemo(
    () => searchOffices(query, district),
    [query, district],
  );

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <SectionFrame id="find-office" contained={contained} className={contained ? "bg-white" : undefined}>
      {heading ? (
        <SectionHeading
          eyebrow="Find government office"
          title="Locate the office before you request an appointment"
          description="Search by office name or district. Booking still requires login."
          href={routes.offices}
          actionLabel="View all offices"
        />
      ) : null}
      <Card className="mb-6">
        <form
          className="grid gap-4 md:grid-cols-[1fr_16rem_auto] md:items-end"
          onSubmit={onSubmit}
        >
          <Field id="office-query" label="Office or area">
            <Input
              id="office-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Collectorate, tehsil, municipal office"
            />
          </Field>
          <Field id="office-district" label="District">
            <Select
              id="office-district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
            >
              {DISTRICTS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>
          <Button type="submit" icon={<Icon name="search" />}>
            Search
          </Button>
        </form>
      </Card>
      {submitted && offices.length === 0 ? (
        <Alert tone="warning">No offices match this search.</Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offices.map((office) => (
            <Link key={office.id} href={routes.office(office.id)}>
              <Card as="article" className="h-full hover:border-navy-700">
                <h3 className="text-base font-semibold text-navy-900">{office.name}</h3>
                <p className="mt-1 text-sm text-muted">{office.district}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{office.address}</p>
                <p className="mt-2 text-sm text-muted">
                  {office.hours} · {office.phone}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}
