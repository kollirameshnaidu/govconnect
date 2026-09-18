import { routes } from "@/constants/routes";

export const ABOUT_ROLES = [
  {
    id: "citizen",
    title: "Citizen",
    detail: "Browse public information, request appointments, track status, and give feedback.",
  },
  {
    id: "official",
    title: "Official",
    detail: "Review requests, accept, reject, transfer, schedule confirmed date and time, and close meetings.",
  },
  {
    id: "frontdesk",
    title: "Front desk",
    detail: "Verify visitors, check in, manage the waiting queue, and record no-show.",
  },
  {
    id: "admin",
    title: "Administration",
    detail: "Department, district, and super administrators maintain offices, slots, holidays, SLA, and audit.",
  },
] as const;

export const GUIDELINE_GROUPS = [
  {
    id: "before-request",
    title: "Before you submit a request",
    items: [
      "Identify the correct office and department. If unsure, submit to the nearest office; officials can transfer the request.",
      "A preferred date is only a request. Do not travel until a confirmed date and time are assigned.",
      "Keep PDF or JPEG copies ready. Each file may be up to 10 MB.",
    ],
  },
  {
    id: "after-schedule",
    title: "After the official schedules a slot",
    items: [
      "Confirm the appointment in the citizen portal.",
      "Carry originals listed in the appointment letter.",
      "Reach the office before the confirmed time and check in at the front desk.",
    ],
  },
  {
    id: "at-office",
    title: "At the office",
    items: [
      "Show the appointment ID or QR. Front desk can also search by registered mobile number.",
      "Wait until you are called. Tracking may show Waiting or Meeting in progress.",
      "If you cannot attend, cancel or request a reschedule instead of becoming a no-show.",
    ],
  },
] as const;

export const HELP_TOPICS = [
  {
    id: "book",
    title: "Book an appointment",
    detail: "Login is required. Select office, department, category, official, purpose, documents, and a preferred date.",
    href: routes.bookAppointment,
  },
  {
    id: "track",
    title: "Track a request",
    detail: "Use the appointment ID and registered mobile number. Login is not required for basic status.",
    href: routes.track,
  },
  {
    id: "dates",
    title: "Preferred date vs confirmed slot",
    detail: "Citizens propose a date. Officials assign the actual appointment date and time.",
    href: routes.howItWorks,
  },
  {
    id: "documents",
    title: "Documents and identity",
    detail: "Upload only relevant files. Do not expose complete identity numbers in file names or screenshots.",
    href: routes.guidelines,
  },
  {
    id: "visit",
    title: "Office visit and queue",
    detail: "Front desk verifies identity, allows entry, checks in, and calls citizens from the waiting queue.",
    href: routes.guidelines,
  },
  {
    id: "grievance",
    title: "Service complaint",
    detail: "Use the grievance form for delays or process issues. It does not create an appointment.",
    href: routes.grievance,
  },
] as const;

export const ACCESSIBILITY_MEASURES = [
  "Skip to main content is the first focusable control on every public page.",
  "Text size and high contrast controls are available in the utility bar.",
  "Form errors are announced in text, not only by a red border.",
  "Dialogs use the native dialog element with a labelled heading and a close action.",
  "Primary navigation can be used with a keyboard. The mobile menu exposes the same destinations.",
  "Status badges use text labels in addition to colour.",
] as const;
