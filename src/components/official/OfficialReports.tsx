"use client";

import { Card } from "@/components/common/Card";
import { useSession } from "@/components/auth/AuthProvider";
import { AppointmentStatus } from "@/constants/appointment-status";
import { isReviewQueue, isScheduledVisit } from "@/lib/appointment-lifecycle";
import { isOfficialSession } from "@/lib/session";
import { useOfficialAppointments } from "@/lib/use-citizen-appointments";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficeById } from "@/services/officeService";

export function OfficialReports() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const { appointments, ready } = useOfficialAppointments(official);

  if (!official) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading reports…</p>;
  }

  const office = getOfficeById(official.officeId);
  const department = getDepartmentById(official.departmentId);
  const counts = {
    total: appointments.length,
    inbox: appointments.filter((item) => isReviewQueue(item.status)).length,
    scheduled: appointments.filter((item) => isScheduledVisit(item.status)).length,
    confirmed: appointments.filter((item) => item.status === AppointmentStatus.CONFIRMED).length,
    closed: appointments.filter((item) => item.status === AppointmentStatus.CLOSED).length,
    rejected: appointments.filter((item) => item.status === AppointmentStatus.REJECTED).length,
  };

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Reports</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Desk summary for {office?.name} · {department?.name}. These counts use the live
          overlay of official actions. They are not a published government statistical return.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="All desk cases" value={counts.total} />
        <StatCard label="Inbox" value={counts.inbox} />
        <StatCard label="Scheduled or in visit" value={counts.scheduled} />
        <StatCard label="Citizen confirmed" value={counts.confirmed} />
        <StatCard label="Closed" value={counts.closed} />
        <StatCard label="Rejected" value={counts.rejected} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
    </Card>
  );
}
