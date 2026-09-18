import { AppointmentStatus } from "@/constants/appointment-status";
import type { AdminNotification, AuditLog, EscalationRecord, TrackedAppointment } from "@/types";

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "adm-n-1",
    staffId: "nanda-super",
    title: "Review SLA watch",
    body: "GC-2026-000077 has remained Submitted beyond the 48-hour review SLA. Escalate if the revenue desk does not take it up.",
    date: "17 September 2026",
    read: false,
    appointmentId: "GC-2026-000077",
  },
  {
    id: "adm-n-2",
    staffId: "nanda-super",
    title: "Holiday calendar",
    body: "Gandhi Jayanti (2 October 2026) and Christmas (25 December 2026) block confirmed slots. Add further notified holidays from Holidays.",
    date: "12 September 2026",
    read: true,
  },
  {
    id: "adm-n-3",
    staffId: "sen-revenue-admin",
    title: "Revenue inbox",
    body: "Department administrators can maintain categories and officials for Revenue. They cannot assign a confirmed appointment slot.",
    date: "16 September 2026",
    read: false,
  },
  {
    id: "adm-n-4",
    staffId: "iyer-central-admin",
    title: "Central district offices",
    body: "District Collectorate, Central is in your district. Front desk and officials at this office stay office-scoped.",
    date: "16 September 2026",
    read: false,
  },
];

export const ADMIN_AUDIT_SEED: AuditLog[] = [
  {
    id: "audit-1",
    at: "12 September 2026, 10:00 AM",
    actor: "R. Nanda, Super administrator",
    action: "Published holidays",
    detail: "Notified Gandhi Jayanti and Christmas for remaining 2026. Officials cannot confirm slots on these dates.",
  },
  {
    id: "audit-2",
    at: "05 September 2026, 3:15 PM",
    actor: "R. Nanda, Super administrator",
    action: "Updated review SLA",
    detail: "Citizen request review SLA remains 48 working hours.",
  },
];

export const ADMIN_ESCALATION_SEED: EscalationRecord[] = [
  {
    id: "esc-1",
    appointmentId: "GC-2026-000077",
    at: "17 September 2026, 9:00 AM",
    actor: "System",
    note: "Submitted request older than the 48-hour review SLA.",
    status: "open",
  },
];

export const ADMIN_WATCH_APPOINTMENTS: TrackedAppointment[] = [
  {
    id: "GC-2026-000077",
    officeName: "District Collectorate, Central",
    departmentName: "Revenue",
    officialName: "Pending assignment",
    purpose: "Income certificate pending desk take-up",
    status: AppointmentStatus.SUBMITTED,
    preferredDate: "30 September 2026",
    confirmedAt: null,
    citizenId: "citizen-watch",
    citizenName: "K. Pillai",
    citizenMobile: "9000011122",
    createdOn: "08 September 2026",
    notes: "Preferred date is not a confirmed slot. Review SLA has lapsed.",
    category: "Income certificate",
    officeId: "collectorate-central",
    departmentId: "revenue",
    history: [
      {
        status: AppointmentStatus.SUBMITTED,
        at: "08 September 2026, 10:05 AM",
        note: "Request submitted with preferred date 30 September 2026. Preferred date is not a confirmed slot.",
        actor: "K. Pillai",
      },
    ],
  },
];
