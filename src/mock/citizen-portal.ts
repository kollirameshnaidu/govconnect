import { AppointmentStatus } from "@/constants/appointment-status";
import type { CitizenNotification } from "@/types";

export const CITIZEN_NOTIFICATIONS: CitizenNotification[] = [
  {
    id: "n-184-confirm",
    citizenId: "citizen-priya",
    title: "Confirmed slot assigned",
    body: "Appointment GC-2026-000184 is confirmed for 24 September 2026, 11:30 AM at District Collectorate, Central. The appointment letter and QR are available on the appointment page.",
    date: "19 September 2026",
    read: false,
    appointmentId: "GC-2026-000184",
  },
  {
    id: "n-256-schedule",
    citizenId: "citizen-priya",
    title: "Slot assigned — confirmation needed",
    body: "Appointment GC-2026-000256 is scheduled for 26 September 2026, 10:00 AM. Confirm the visit to generate the letter and QR. The preferred date remains a request until you confirm.",
    date: "17 September 2026",
    read: false,
    appointmentId: "GC-2026-000256",
  },
  {
    id: "n-201-review",
    citizenId: "citizen-priya",
    title: "Request under review",
    body: "Appointment GC-2026-000201 is with the Revenue official. Your preferred date is still a request, not a confirmed slot.",
    date: "17 September 2026",
    read: true,
    appointmentId: "GC-2026-000201",
  },
  {
    id: "n-088-reject",
    citizenId: "citizen-priya",
    title: "Request not accepted",
    body: "Appointment GC-2026-000088 was rejected. The appointment ID remains available if an official transfers the matter later.",
    date: "08 September 2026",
    read: true,
    appointmentId: "GC-2026-000088",
  },
];

export const BOOKING_STEPS = [
  {
    id: "office",
    title: "Select office",
    detail: "Choose the government office you need to visit.",
  },
  {
    id: "department",
    title: "Select department and official",
    detail: "Pick the department, category, and concerned official.",
  },
  {
    id: "purpose",
    title: "Describe purpose",
    detail: "Enter visit details and upload supporting documents.",
  },
  {
    id: "date",
    title: "Preferred date",
    detail: "Share a date that works for you. This does not book a slot.",
  },
  {
    id: "review",
    title: "Official review",
    detail: "An official assigns the confirmed date and time after checking availability.",
  },
] as const;

export const ACTIVE_STATUSES = [
  AppointmentStatus.SUBMITTED,
  AppointmentStatus.UNDER_REVIEW,
  AppointmentStatus.TRANSFERRED,
  AppointmentStatus.ACCEPTED,
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.RESCHEDULE_REQUESTED,
  AppointmentStatus.RESCHEDULED,
  AppointmentStatus.CHECKED_IN,
  AppointmentStatus.WAITING,
  AppointmentStatus.MEETING_IN_PROGRESS,
] as const;
