export const AppointmentStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  TRANSFERRED: "TRANSFERRED",
  ACCEPTED: "ACCEPTED",
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  RESCHEDULE_REQUESTED: "RESCHEDULE_REQUESTED",
  RESCHEDULED: "RESCHEDULED",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  CHECKED_IN: "CHECKED_IN",
  WAITING: "WAITING",
  MEETING_IN_PROGRESS: "MEETING_IN_PROGRESS",
  MEETING_COMPLETED: "MEETING_COMPLETED",
  CLOSED: "CLOSED",
  NO_SHOW: "NO_SHOW",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  TRANSFERRED: "Transferred",
  ACCEPTED: "Accepted",
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
  RESCHEDULE_REQUESTED: "Reschedule requested",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  CHECKED_IN: "Checked in",
  WAITING: "Waiting",
  MEETING_IN_PROGRESS: "Meeting in progress",
  MEETING_COMPLETED: "Meeting completed",
  CLOSED: "Closed",
  NO_SHOW: "No show",
};
