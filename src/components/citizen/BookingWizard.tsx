"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/common/FormControls";
import { Icon } from "@/components/common/Icon";
import { PreferredDateHelp } from "@/components/home/PreferredDateHelp";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/cn";
import { formatDisplayDate, preferredDateIssue, toIsoDate } from "@/lib/dates";
import { isCitizenSession } from "@/lib/session";
import { DISTRICTS } from "@/mock/homepage";
import { submitAppointmentRequest } from "@/services/appointmentService";
import { getDepartmentById } from "@/services/departmentService";
import {
  getDepartmentsForOffice,
  getOfficeById,
  searchOffices,
} from "@/services/officeService";
import { getOfficialById, getOfficialsForDesk } from "@/services/officialService";
import type { AppointmentDraft } from "@/types";

const STEPS = [
  { id: "office", label: "Office" },
  { id: "department", label: "Department" },
  { id: "purpose", label: "Purpose" },
  { id: "date", label: "Preferred date" },
  { id: "review", label: "Review" },
] as const;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

type BookingWizardProps = {
  initialOfficeId?: string;
  initialDepartmentId?: string;
};

export function BookingWizard({
  initialOfficeId = "",
  initialDepartmentId = "",
}: BookingWizardProps) {
  const session = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [officeQuery, setOfficeQuery] = useState("");
  const [district, setDistrict] = useState<string>(DISTRICTS[0]);
  const [officeId, setOfficeId] = useState(initialOfficeId);
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const [category, setCategory] = useState("");
  const [officialId, setOfficialId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const [minDate] = useState(() => toIsoDate(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  const offices = useMemo(
    () => searchOffices(officeQuery, district),
    [district, officeQuery],
  );
  const office = getOfficeById(officeId);
  const departments = office ? getDepartmentsForOffice(office) : [];
  const department = getDepartmentById(departmentId);
  const officials = officeId && departmentId ? getOfficialsForDesk(officeId, departmentId) : [];
  const official = getOfficialById(officialId);
  const dateIssue = preferredDateIssue(preferredDate);

  if (!isCitizenSession(session)) return null;
  const citizen = session;

  function selectOffice(id: string) {
    setOfficeId(id);
    setDepartmentId("");
    setCategory("");
    setOfficialId("");
    setError("");
  }

  function selectDepartment(id: string) {
    setDepartmentId(id);
    setCategory("");
    setOfficialId("");
    setError("");
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        setError(`${file.name} is larger than 10 MB.`);
        return;
      }
      if (!/\.(pdf|jpe?g)$/i.test(file.name)) {
        setError("Upload PDF or JPEG files only.");
        return;
      }
      next.push(file.name);
    }
    setError("");
    setDocuments((current) => [...current, ...next]);
  }

  function validateStep(index: number) {
    if (index === 0 && !officeId) return "Select the office you need to visit.";
    if (index === 1) {
      if (!departmentId) return "Select a department.";
      if (!category) return "Select a service category.";
      if (!officialId) return "Select the concerned official.";
    }
    if (index === 2) {
      if (purpose.trim().length < 20) {
        return "Describe the purpose of visit in at least 20 characters.";
      }
    }
    if (index === 3) return dateIssue ?? "";
    return "";
  }

  function goNext() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }

  async function submit() {
    const message = [0, 1, 2, 3].map(validateStep).find(Boolean);
    if (message) {
      setError(message);
      return;
    }
    const draft: AppointmentDraft = {
      officeId,
      departmentId,
      category,
      officialId,
      purpose,
      documents,
      preferredDate,
    };
    setPending(true);
    try {
      const appointment = await submitAppointmentRequest(citizen, draft);
      router.push(routes.citizenAppointment(appointment.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the request.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">New appointment request</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Submit a request with a preferred date. An official reviews availability
          and assigns the confirmed date and time. This form does not reserve a slot.
        </p>
      </header>

      <ol className="grid gap-2 sm:grid-cols-5">
        {STEPS.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={cn(
                "w-full rounded-md border px-3 py-2 text-left text-sm",
                index === step
                  ? "border-navy-800 bg-navy-800 text-white"
                    : index < step
                      ? "border-navy-50 bg-navy-50 text-navy-800"
                    : "border-line bg-white text-muted",
              )}
              disabled={index > step}
              onClick={() => {
                setError("");
                setStep(index);
              }}
            >
              <span className="block text-xs font-semibold">Step {index + 1}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ol>

      {error ? <Alert tone="danger">{error}</Alert> : null}

      {step === 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Select office</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_16rem]">
            <Field id="book-office-query" label="Office or area">
              <Input
                id="book-office-query"
                value={officeQuery}
                onChange={(event) => setOfficeQuery(event.target.value)}
                placeholder="Collectorate, tehsil, municipal office"
              />
            </Field>
            <Field id="book-district" label="District">
              <Select
                id="book-district"
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
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {offices.length === 0 ? (
              <EmptyState
                className="md:col-span-2"
                title="No offices match this search"
                description="Try a different district or a shorter office name. Overlay offices added by an administrator also appear here."
              />
            ) : (
              offices.map((item) => (
              <ChoiceCard
                key={item.id}
                selected={officeId === item.id}
                title={item.name}
                onClick={() => selectOffice(item.id)}
              >
                <p>{item.district}</p>
                <p>{item.address}</p>
                <p>{item.hours}</p>
              </ChoiceCard>
              ))
            )}
          </div>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Department, category, and official</h2>
          <p className="mt-1 text-sm text-muted">{office?.name}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {departments.map((item) => (
              <ChoiceCard
                key={item.id}
                selected={departmentId === item.id}
                title={item.name}
                onClick={() => selectDepartment(item.id)}
              >
                <p>{item.summary}</p>
              </ChoiceCard>
            ))}
          </div>
          {department ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field id="book-category" label="Service category" required>
                <Select
                  id="book-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">Select category</option>
                  {department.categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="book-official" label="Concerned official" required>
                <Select
                  id="book-official"
                  value={officialId}
                  onChange={(event) => setOfficialId(event.target.value)}
                >
                  <option value="">Select official</option>
                  {officials.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}, {item.designation}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          ) : null}
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Purpose and documents</h2>
          <div className="mt-4 grid gap-4">
            <Field
              id="book-purpose"
              label="Purpose of visit"
              required
              hint="Explain why you need this appointment. Do not include unnecessary personal details."
            >
              <Textarea
                id="book-purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            </Field>
            <Field
              id="book-documents"
              label="Supporting documents"
              hint="PDF or JPEG names are recorded for the official. Files are not uploaded to the server yet. Each file should be 10 MB or smaller."
            >
              <input
                id="book-documents"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-navy-800 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                onChange={(event) => onFiles(event.target.files)}
              />
            </Field>
            {documents.length > 0 ? (
              <ul className="grid gap-2 text-sm">
                {documents.map((name) => (
                  <li key={name} className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2">
                    <span className="inline-flex items-center gap-2">
                      <Icon name="file" />
                      {name}
                    </span>
                    <button
                      type="button"
                      className="text-sm font-semibold text-danger"
                      onClick={() => setDocuments((current) => current.filter((item) => item !== name))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Preferred date</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Choose a future working day. This is a request only. The official
            assigns the confirmed date and time after review.
          </p>
          <div className="mt-3">
            <PreferredDateHelp />
          </div>
          <div className="mt-4 max-w-xs">
            <Field id="book-date" label="Preferred date" required error={preferredDate ? dateIssue ?? undefined : undefined}>
              <Input
                id="book-date"
                type="date"
                min={minDate}
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
              />
            </Field>
          </div>
          {preferredDate && !dateIssue ? (
            <Alert tone="warning" title="Not a confirmed slot" className="mt-4">
              You requested {formatDisplayDate(preferredDate)}. No time is reserved
              until an official confirms the appointment.
            </Alert>
          ) : null}
        </Card>
      ) : null}

      {step === 4 ? (
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Review request</h2>
          <Alert tone="info" title="What happens next" className="mt-4">
            Submitting creates an appointment ID and sends the request for official
            review. Confirmed date and time will appear later. The ID does not
            change if the request is transferred.
          </Alert>
          <dl className="mt-4 grid gap-3 text-sm">
            <ReviewRow label="Office" value={office?.name ?? ""} />
            <ReviewRow label="Department" value={department?.name ?? ""} />
            <ReviewRow label="Category" value={category} />
            <ReviewRow
              label="Official"
              value={official ? `${official.name}, ${official.designation}` : ""}
            />
            <ReviewRow label="Purpose" value={purpose} />
            <ReviewRow
              label="Documents"
              value={documents.length ? documents.join(", ") : "None attached"}
            />
            <ReviewRow
              label="Preferred date"
              value={preferredDate ? formatDisplayDate(preferredDate) : ""}
            />
            <ReviewRow label="Confirmed date/time" value="Not assigned yet" />
          </dl>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {step > 0 ? (
          <Button
            variant="outline"
            onClick={() => {
              setError("");
              setStep((value) => value - 1);
            }}
          >
            Back
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button onClick={goNext}>Continue</Button>
        ) : (
          <Button onClick={submit} disabled={pending}>
            {pending ? "Submitting…" : "Submit request"}
          </Button>
        )}
      </div>
    </div>
  );
}

function ChoiceCard({
  selected,
  title,
  onClick,
  children,
}: {
  selected: boolean;
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-lg border p-4 text-left transition-colors",
        selected
          ? "border-navy-800 bg-navy-50"
          : "border-line bg-white hover:border-navy-700",
      )}
    >
      <p className="font-semibold text-navy-900">{title}</p>
      <div className="mt-1 grid gap-0.5 text-sm text-muted">{children}</div>
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-line py-2 last:border-b-0 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
