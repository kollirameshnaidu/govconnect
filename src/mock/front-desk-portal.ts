import type { FrontDeskNotification } from "@/types";

export const FRONT_DESK_NOTIFICATIONS: FrontDeskNotification[] = [
  {
    id: "fd-n-1",
    staffId: "rao-frontdesk",
    title: "Confirmed visit ready for check-in",
    body: "Meera Joshi confirmed GC-2026-000198 for 24 September 2026, 10:00 AM. Search by appointment ID if the visit token cannot be scanned.",
    date: "19 September 2026",
    read: false,
    appointmentId: "GC-2026-000198",
  },
  {
    id: "fd-n-2",
    staffId: "rao-frontdesk",
    title: "Citizen waiting",
    body: "Amit Bose is number 1 in the collectorate waiting queue for GC-2026-000199. Call the next visitor when the meeting desk is free.",
    date: "17 September 2026",
    read: false,
    appointmentId: "GC-2026-000199",
  },
];
