import type { OfficialNotification } from "@/types";

export const OFFICIAL_NOTIFICATIONS: OfficialNotification[] = [
  {
    id: "on-1",
    officialId: "narayan-tehsildar",
    title: "New request in the revenue inbox",
    body: "GC-2026-000142 from Rahul Verma is submitted for an income certificate. Take up the request and assign a confirmed slot later. The preferred date is not a reserved time.",
    date: "16 September 2026",
    read: false,
    appointmentId: "GC-2026-000142",
  },
  {
    id: "on-2",
    officialId: "narayan-tehsildar",
    title: "Accepted request awaiting a slot",
    body: "GC-2026-000167 for land records is accepted. Assign a working-day date and time. Do not copy the citizen’s preferred date as the confirmed slot.",
    date: "16 September 2026",
    read: false,
    appointmentId: "GC-2026-000167",
  },
  {
    id: "on-3",
    officialId: "narayan-tehsildar",
    title: "Citizen confirmed a visit",
    body: "Priya Sharma confirmed GC-2026-000184 for 24 September 2026, 11:30 AM. Start the meeting from the appointment after the citizen arrives.",
    date: "19 September 2026",
    read: true,
    appointmentId: "GC-2026-000184",
  },
];
