"use client";

import Link from "next/link";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { AdminHeader, StatCard, adminScopeLabel, useAdmin } from "@/components/admin/AdminUi";
import { ADMIN_KIND_LABEL } from "@/constants/admin";
import { routes } from "@/constants/routes";
import { isReviewQueue } from "@/lib/appointment-lifecycle";
import { useAdminConfig } from "@/lib/use-admin-config";
import { useCreatedAppointments } from "@/lib/use-citizen-appointments";
import {
  listAdminAppointments,
  listEscalationRecords,
  listNotifiedHolidays,
  listOfficesForAdmin,
  reviewHoursForAdmin,
} from "@/services/adminService";
import { getNotificationsForAdmin } from "@/services/notificationService";
import { getDepartmentById } from "@/services/departmentService";

export function AdminDashboard() {
  const admin = useAdmin();
  const { ready: configReady } = useAdminConfig();
  const { items, ready } = useCreatedAppointments();

  if (!admin) return null;
  if (!ready || !configReady) {
    return <p className="text-sm text-muted">Loading administration…</p>;
  }

  const appointments = listAdminAppointments(admin, items);
  const offices = listOfficesForAdmin(admin);
  const inbox = appointments.filter((item) => isReviewQueue(item.status));
  const holidays = listNotifiedHolidays();
  const slaHours = reviewHoursForAdmin(admin);
  const escalations = listEscalationRecords(admin, appointments).filter(
    (item) => item.status === "open",
  );
  const notifications = getNotificationsForAdmin(admin);
  const department = admin.departmentId ? getDepartmentById(admin.departmentId) : undefined;

  return (
    <div className="grid gap-6">
      <AdminHeader
        eyebrow="Administration"
        title={`Welcome, ${admin.name}`}
        description={`${ADMIN_KIND_LABEL[admin.kind]} · ${adminScopeLabel(admin)}${
          department ? ` · ${department.name}` : ""
        }. Maintain master data and SLA. Do not treat a preferred date as a confirmed slot.`}
        action={<Button href={routes.adminAppointments}>View appointments</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Offices in scope" value={offices.length} />
        <StatCard label="Appointments" value={appointments.length} />
        <StatCard label="Review inbox" value={inbox.length} />
        <StatCard label="Open escalations" value={escalations.length} />
      </div>
      <Alert tone="info" title="Confirmed slots stay with officials">
        Review SLA is {slaHours} hours. {holidays.length} notified holidays block confirmed
        dates. Administrators cannot assign date and time.
      </Alert>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Open escalations</h2>
          {escalations.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No open SLA escalations in this scope.</p>
          ) : (
            <ul className="mt-3 grid gap-2 text-sm">
              {escalations.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <Link href={routes.adminEscalation} className="font-semibold text-navy-800">
                    {item.appointmentId}
                  </Link>
                  <p className="text-muted">{item.note}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-navy-900">Alerts</h2>
          {notifications.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No administrator alerts.</p>
          ) : (
            <ul className="mt-3 grid gap-2 text-sm">
              {notifications.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <p className="font-semibold text-navy-900">{item.title}</p>
                  <p className="text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
