"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Input } from "@/components/common/FormControls";
import { AdminGate, AdminHeader, StatCard, useAdmin } from "@/components/admin/AdminUi";
import { AppointmentStatus } from "@/constants/appointment-status";
import { setAdminSession } from "@/lib/auth-store";
import { isReviewQueue, isScheduledVisit } from "@/lib/appointment-lifecycle";
import { useAdminConfig } from "@/lib/use-admin-config";
import { useCreatedAppointments } from "@/lib/use-citizen-appointments";
import {
  listAdminAppointments,
  listAuditLogs,
  saveAdminSettings,
} from "@/services/adminService";
import { getNotificationsForAdmin } from "@/services/notificationService";

export function AdminNotifications() {
  const admin = useAdmin();
  if (!admin) return null;
  const items = getNotificationsForAdmin(admin);
  return (
    <AdminGate permission="notifications">
      <div className="grid gap-6">
        <AdminHeader
          title="Notifications"
          description="Administrator alerts for SLA, holidays, and office scope. These are not citizen messages."
        />
        {items.length === 0 ? (
          <EmptyState icon="bell" title="No alerts" description="SLA and holiday notices appear here." />
        ) : (
          <ul className="grid gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <Card>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                  <p className="mt-2 text-xs text-muted">{item.date}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminReports() {
  const admin = useAdmin();
  const { items, ready } = useCreatedAppointments();
  useAdminConfig();
  if (!admin) return null;
  const appointments = listAdminAppointments(admin, items);
  const counts = {
    total: appointments.length,
    inbox: appointments.filter((item) => isReviewQueue(item.status)).length,
    scheduled: appointments.filter((item) => isScheduledVisit(item.status)).length,
    confirmed: appointments.filter((item) => item.status === AppointmentStatus.CONFIRMED).length,
    closed: appointments.filter((item) => item.status === AppointmentStatus.CLOSED).length,
    noShow: appointments.filter((item) => item.status === AppointmentStatus.NO_SHOW).length,
  };
  return (
    <AdminGate permission="reports">
      <div className="grid gap-6">
        <AdminHeader
          title="Reports"
          description="Scope counts from live overlay data. This is not a published statistical return. Preferred dates are not counted as confirmed slots."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading reports…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="All cases" value={counts.total} />
            <StatCard label="Review inbox" value={counts.inbox} />
            <StatCard label="Scheduled or in visit" value={counts.scheduled} />
            <StatCard label="Citizen confirmed" value={counts.confirmed} />
            <StatCard label="Closed" value={counts.closed} />
            <StatCard label="No-show" value={counts.noShow} />
          </div>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminAudit() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  if (!admin) return null;
  const logs = listAuditLogs();
  return (
    <AdminGate permission="audit">
      <div className="grid gap-6">
        <AdminHeader
          title="Audit"
          description="Administrator actions on master data, holidays, SLA, and escalation. Citizen and official case history stays on the appointment record."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading audit…</p>
        ) : logs.length === 0 ? (
          <EmptyState icon="file" title="No audit rows" description="Saved administrator actions appear here." />
        ) : (
          <ul className="grid gap-3">
            {logs.map((item) => (
              <li key={item.id}>
                <Card>
                  <p className="font-semibold text-navy-900">{item.action}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.at} · {item.actor}
                  </p>
                  <p className="mt-2 text-sm leading-6">{item.detail}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminSettingsForm() {
  const admin = useAdmin();
  const { config, ready } = useAdminConfig();
  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(config.helpdeskEmail);
  const [hours, setHours] = useState(String(config.reviewHours));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  if (!admin) return null;
  const desk = admin;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await saveAdminSettings(desk, {
        name,
        helpdeskEmail: email,
        reviewHours: Number(hours) || config.reviewHours,
      });
      setAdminSession({ ...desk, name: name.trim() });
      setSuccess("Settings saved for this demo overlay.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminGate permission="settings">
      <div className="grid max-w-xl gap-6">
        <AdminHeader
          title="Settings"
          description="Helpdesk contact and review SLA for this demo. Display name is stored on the session cookie. Administrators still cannot assign a confirmed slot."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading settings…</p>
        ) : (
          <Card padding="lg">
            <form className="grid gap-4" onSubmit={onSubmit} noValidate>
              {error ? <Alert tone="danger">{error}</Alert> : null}
              {success ? <Alert tone="success">{success}</Alert> : null}
              <Field id="set-name" label="Display name" required>
                <Input id="set-name" value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Field id="set-email" label="Helpdesk email">
                <Input id="set-email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Field>
              <Field id="set-sla" label="Review SLA (hours)" required>
                <Input
                  id="set-sla"
                  inputMode="numeric"
                  value={hours}
                  onChange={(event) => setHours(event.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field id="set-staff" label="Staff ID" hint="Login identity. Cannot be changed in this demo.">
                <Input id="set-staff" value={desk.staffId} disabled />
              </Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save settings"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </AdminGate>
  );
}
