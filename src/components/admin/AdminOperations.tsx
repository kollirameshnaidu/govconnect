"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Input, Select } from "@/components/common/FormControls";
import { StatusBadge } from "@/components/common/StatusBadge";
import { AdminGate, AdminHeader, useAdmin } from "@/components/admin/AdminUi";
import { formatDisplayDate, formatTimeLabel } from "@/lib/dates";
import { isReviewQueue } from "@/lib/appointment-lifecycle";
import { useAdminConfig } from "@/lib/use-admin-config";
import { useCreatedAppointments } from "@/lib/use-citizen-appointments";
import {
  addAdminHoliday,
  acknowledgeEscalation,
  listAdminAppointments,
  listEscalationRecords,
  listNotifiedHolidays,
  listOfficesForAdmin,
  listSlotBoard,
  raiseEscalation,
  removeAdminHoliday,
  reviewHoursForAdmin,
  saveAdminSla,
  toggleAdminSlot,
} from "@/services/adminService";

export function AdminAppointments() {
  const admin = useAdmin();
  const { items, ready } = useCreatedAppointments();
  useAdminConfig();
  if (!admin) return null;
  const appointments = listAdminAppointments(admin, items);
  return (
    <AdminGate permission="appointments">
      <div className="grid gap-6">
        <AdminHeader
          title="Appointments"
          description="Read-only case list for this administrator scope. Take-up, transfer, and confirmed slots remain with the official portal. Appointment IDs stay unchanged."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading appointments…</p>
        ) : appointments.length === 0 ? (
          <EmptyState
            icon="file"
            title="No appointments in scope"
            description="Requests for other offices or departments do not appear here."
          />
        ) : (
          <ul className="grid gap-3">
            {appointments.map((item) => (
              <li key={item.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-navy-900">{item.id}</p>
                      <p className="mt-1 text-sm text-muted">
                        {item.citizenName} · {item.departmentName} · {item.officeName}
                      </p>
                      <p className="mt-2 text-sm text-ink">{item.purpose}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted">Preferred date</dt>
                      <dd className="font-medium">{item.preferredDate}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Confirmed date/time</dt>
                      <dd className="font-medium">{item.confirmedAt ?? "Not assigned yet"}</dd>
                    </div>
                  </dl>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminSlots() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  const [officeId, setOfficeId] = useState("collectorate-central");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  if (!admin) return null;
  const offices = listOfficesForAdmin(admin);
  const selected = offices.some((item) => item.id === officeId) ? officeId : offices[0]?.id;
  const slots = selected
    ? listSlotBoard(admin).filter((item) => item.officeId === selected)
    : [];

  return (
    <AdminGate permission="slots">
      <div className="grid gap-6">
        <AdminHeader
          title="Slots"
          description="Office time templates used when an official assigns a confirmed date and time. Disabling a time does not book a citizen preferred date."
        />
        {!ready || !selected ? (
          <p className="text-sm text-muted">Loading slot templates…</p>
        ) : (
          <>
            {error ? <Alert tone="danger">{error}</Alert> : null}
            <Field id="slot-office" label="Office">
              <Select
                id="slot-office"
                value={selected}
                onChange={(event) => setOfficeId(event.target.value)}
              >
                {offices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {slots.map((slot) => (
                <Card key={`${slot.officeId}-${slot.time}`}>
                  <p className="font-semibold text-navy-900">{formatTimeLabel(slot.time)}</p>
                  <p className="mt-1 text-sm text-muted">{slot.enabled ? "Offered" : "Disabled"}</p>
                  <Button
                    className="mt-3"
                    size="sm"
                    variant={slot.enabled ? "outline" : "secondary"}
                    disabled={Boolean(pending)}
                    onClick={async () => {
                      setPending(slot.time);
                      setError("");
                      try {
                        await toggleAdminSlot(admin, slot.officeId, slot.time);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Could not update slot.");
                      } finally {
                        setPending("");
                      }
                    }}
                  >
                    {pending === slot.time ? "Saving…" : slot.enabled ? "Disable" : "Enable"}
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminHolidays() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  const [date, setDate] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  if (!admin) return null;
  const holidays = listNotifiedHolidays();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await addAdminHoliday(admin!, { date, label });
      setSuccess("Holiday added. Officials cannot confirm a slot on this date.");
      setDate("");
      setLabel("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add holiday.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminGate permission="holidays">
      <div className="grid gap-6">
        <AdminHeader
          title="Holidays"
          description="Notified holidays block confirmed appointment dates. A citizen may still enter a preferred date; the official must assign a working day."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading holidays…</p>
        ) : (
          <>
            <ul className="grid gap-3">
              {holidays.map((item) => (
                <li key={item.date}>
                  <Card>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy-900">{item.label}</p>
                        <p className="text-sm text-muted">
                          {formatDisplayDate(item.date)} · {item.scope}
                          {item.district ? ` · ${item.district}` : ""}
                        </p>
                      </div>
                      {item.scope !== "national" || !["2026-10-02", "2026-12-25"].includes(item.date) ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            setError("");
                            try {
                              await removeAdminHoliday(admin, item.date);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Could not remove.");
                            }
                          }}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">Notify a holiday</h2>
              <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
                {error ? <Alert tone="danger" className="md:col-span-2">{error}</Alert> : null}
                {success ? <Alert tone="success" className="md:col-span-2">{success}</Alert> : null}
                <Field id="hol-date" label="Date" required>
                  <Input id="hol-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
                </Field>
                <Field id="hol-label" label="Name" required>
                  <Input id="hol-label" value={label} onChange={(event) => setLabel(event.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save holiday"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminSla() {
  const admin = useAdmin();
  const { config, ready } = useAdminConfig();
  const [hours, setHours] = useState(String(config.reviewHours));
  const [deptHours, setDeptHours] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  if (!admin) return null;

  const current = reviewHoursForAdmin(admin);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await saveAdminSla(admin!, {
        reviewHours: Number(hours) || current,
        departmentHours: deptHours ? Number(deptHours) : undefined,
      });
      setSuccess("SLA updated for this demo overlay. Preferred date is still not a booking.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save SLA.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminGate permission="sla">
      <div className="grid gap-6">
        <AdminHeader
          title="SLA"
          description="Citizen request review target. Escalation uses this value. It does not auto-confirm a preferred date."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading SLA…</p>
        ) : (
          <Card>
            <p className="text-sm text-muted">Current review target: {current} hours.</p>
            <form className="mt-4 grid max-w-md gap-4" onSubmit={onSubmit} noValidate>
              {error ? <Alert tone="danger">{error}</Alert> : null}
              {success ? <Alert tone="success">{success}</Alert> : null}
              {admin.kind === "super" ? (
                <Field id="sla-hours" label="Review hours" required>
                  <Input
                    id="sla-hours"
                    inputMode="numeric"
                    value={hours}
                    onChange={(event) => setHours(event.target.value.replace(/\D/g, ""))}
                  />
                </Field>
              ) : (
                <Field id="sla-dept" label="Department review hours" required>
                  <Input
                    id="sla-dept"
                    inputMode="numeric"
                    value={deptHours}
                    onChange={(event) => setDeptHours(event.target.value.replace(/\D/g, ""))}
                    placeholder={String(current)}
                  />
                </Field>
              )}
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save SLA"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminEscalation() {
  const admin = useAdmin();
  const { items, ready } = useCreatedAppointments();
  const { ready: configReady } = useAdminConfig();
  const [note, setNote] = useState("");
  const [target, setTarget] = useState("GC-2026-000077");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  if (!admin) return null;
  const appointments = listAdminAppointments(admin, items);
  const records = listEscalationRecords(admin, appointments);
  const reviewQueue = appointments.filter((item) => isReviewQueue(item.status));

  return (
    <AdminGate permission="escalation">
      <div className="grid gap-6">
        <AdminHeader
          title="Escalation"
          description="Follow up requests that remain in review beyond SLA. Escalation does not change the appointment ID or assign a slot."
        />
        {!ready || !configReady ? (
          <p className="text-sm text-muted">Loading escalations…</p>
        ) : (
          <>
            {error ? <Alert tone="danger">{error}</Alert> : null}
            {records.length === 0 ? (
              <EmptyState
                icon="clock"
                title="No escalations"
                description="Open items appear when a submitted request misses the review SLA."
              />
            ) : (
              <ul className="grid gap-3">
                {records.map((item) => (
                  <li key={item.id}>
                    <Card>
                      <p className="font-semibold text-navy-900">{item.appointmentId}</p>
                      <p className="mt-1 text-sm text-muted">
                        {item.status} · {item.at} · {item.actor}
                      </p>
                      <p className="mt-2 text-sm">{item.note}</p>
                      {item.status === "open" ? (
                        <Button
                          className="mt-3"
                          size="sm"
                          disabled={Boolean(pending)}
                          onClick={async () => {
                            setPending(item.id);
                            setError("");
                            try {
                              await acknowledgeEscalation(admin, item.id);
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Could not update.");
                            } finally {
                              setPending("");
                            }
                          }}
                        >
                          {pending === item.id ? "Saving…" : "Acknowledge"}
                        </Button>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
            )}
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">Raise escalation</h2>
              <form
                className="mt-4 grid gap-4 md:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setPending("raise");
                  setError("");
                  try {
                    await raiseEscalation(admin, target, note);
                    setNote("");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not raise.");
                  } finally {
                    setPending("");
                  }
                }}
                noValidate
              >
                <Field id="esc-id" label="Appointment ID" required>
                  <Select id="esc-id" value={target} onChange={(event) => setTarget(event.target.value)}>
                    {reviewQueue.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.id} · {item.status}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field id="esc-note" label="Note">
                  <Input id="esc-note" value={note} onChange={(event) => setNote(event.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pending === "raise" || reviewQueue.length === 0}>
                    {pending === "raise" ? "Saving…" : "Raise"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </AdminGate>
  );
}
