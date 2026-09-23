import {
  AppointmentStatus,
  APPOINTMENT_STATUS_LABEL,
  type AppointmentStatus as Status,
} from "@/constants/appointment-status";
import { JOURNEY_STEPS } from "@/mock/homepage";
import type { AppointmentHistoryEvent, TrackedAppointment } from "@/types";

const LETTER_STATUSES = new Set<Status>([
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.RESCHEDULE_REQUESTED,
  AppointmentStatus.CHECKED_IN,
  AppointmentStatus.WAITING,
  AppointmentStatus.MEETING_IN_PROGRESS,
  AppointmentStatus.MEETING_COMPLETED,
  AppointmentStatus.CLOSED,
]);

const CONFIRM_STATUSES = new Set<Status>([
  AppointmentStatus.SCHEDULED,
  AppointmentStatus.RESCHEDULED,
]);

const JOURNEY_STATUS_INDEX: Record<Status, number> = {
  [AppointmentStatus.DRAFT]: 0,
  [AppointmentStatus.SUBMITTED]: 0,
  [AppointmentStatus.UNDER_REVIEW]: 1,
  [AppointmentStatus.TRANSFERRED]: 1,
  [AppointmentStatus.ACCEPTED]: 1,
  [AppointmentStatus.REJECTED]: 1,
  [AppointmentStatus.SCHEDULED]: 2,
  [AppointmentStatus.RESCHEDULE_REQUESTED]: 2,
  [AppointmentStatus.RESCHEDULED]: 2,
  [AppointmentStatus.CONFIRMED]: 3,
  [AppointmentStatus.CANCELLED]: 3,
  [AppointmentStatus.CHECKED_IN]: 4,
  [AppointmentStatus.WAITING]: 4,
  [AppointmentStatus.NO_SHOW]: 4,
  [AppointmentStatus.MEETING_IN_PROGRESS]: 5,
  [AppointmentStatus.MEETING_COMPLETED]: 5,
  [AppointmentStatus.CLOSED]: 6,
};

export function canConfirmVisit(status: Status) {
  return CONFIRM_STATUSES.has(status);
}

export function canCancelAppointment(status: Status) {
  return (
    status === AppointmentStatus.SUBMITTED ||
    status === AppointmentStatus.UNDER_REVIEW ||
    status === AppointmentStatus.TRANSFERRED ||
    status === AppointmentStatus.ACCEPTED ||
    status === AppointmentStatus.SCHEDULED ||
    status === AppointmentStatus.CONFIRMED ||
    status === AppointmentStatus.RESCHEDULED ||
    status === AppointmentStatus.RESCHEDULE_REQUESTED
  );
}

export function canRequestReschedule(status: Status) {
  return (
    status === AppointmentStatus.SCHEDULED ||
    status === AppointmentStatus.CONFIRMED ||
    status === AppointmentStatus.RESCHEDULED
  );
}

export function canTakeUp(status: Status) {
  return status === AppointmentStatus.SUBMITTED || status === AppointmentStatus.TRANSFERRED;
}

export function canAccept(status: Status) {
  return (
    status === AppointmentStatus.SUBMITTED ||
    status === AppointmentStatus.UNDER_REVIEW ||
    status === AppointmentStatus.TRANSFERRED
  );
}

export function canReject(status: Status) {
  return canAccept(status) || status === AppointmentStatus.ACCEPTED;
}

export function canTransfer(status: Status) {
  return canAccept(status) || status === AppointmentStatus.ACCEPTED;
}

export function canSchedule(status: Status) {
  return status === AppointmentStatus.ACCEPTED || status === AppointmentStatus.RESCHEDULE_REQUESTED;
}

export function canStartMeeting(status: Status) {
  return (
    status === AppointmentStatus.CONFIRMED ||
    status === AppointmentStatus.CHECKED_IN ||
    status === AppointmentStatus.WAITING
  );
}

export function canCheckIn(status: Status) {
  return status === AppointmentStatus.CONFIRMED;
}

export function canSendToWaiting(status: Status) {
  return status === AppointmentStatus.CHECKED_IN;
}

export function canMarkNoShow(status: Status) {
  return (
    status === AppointmentStatus.CONFIRMED ||
    status === AppointmentStatus.CHECKED_IN ||
    status === AppointmentStatus.WAITING
  );
}

export function canCallNext(status: Status) {
  return status === AppointmentStatus.WAITING;
}

export function canCompleteMeeting(status: Status) {
  return status === AppointmentStatus.MEETING_IN_PROGRESS;
}

export function canCloseAppointment(status: Status) {
  return status === AppointmentStatus.MEETING_COMPLETED;
}

export function isReviewQueue(status: Status) {
  return (
    status === AppointmentStatus.SUBMITTED ||
    status === AppointmentStatus.UNDER_REVIEW ||
    status === AppointmentStatus.TRANSFERRED ||
    status === AppointmentStatus.ACCEPTED
  );
}

export function isScheduledVisit(status: Status) {
  return (
    status === AppointmentStatus.SCHEDULED ||
    status === AppointmentStatus.CONFIRMED ||
    status === AppointmentStatus.RESCHEDULED ||
    status === AppointmentStatus.CHECKED_IN ||
    status === AppointmentStatus.WAITING ||
    status === AppointmentStatus.MEETING_IN_PROGRESS ||
    status === AppointmentStatus.MEETING_COMPLETED
  );
}

export function isLetterAvailable(status: Status) {
  return LETTER_STATUSES.has(status);
}

export function assignedSlotLabel(status: Status) {
  return canConfirmVisit(status) ? "Assigned date/time" : "Confirmed date/time";
}

export function getJourneyIndex(status: Status) {
  return JOURNEY_STATUS_INDEX[status];
}

export function getJourneySteps() {
  return JOURNEY_STEPS;
}

export function getAppointmentHistory(
  appointment: TrackedAppointment,
): AppointmentHistoryEvent[] {
  if (appointment.history?.length) return appointment.history;
  return [
    {
      status: appointment.status,
      at: appointment.createdOn ?? "Date not recorded",
      note: appointment.notes ?? APPOINTMENT_STATUS_LABEL[appointment.status],
    },
  ];
}

export function isTerminalStatus(status: Status) {
  return (
    status === AppointmentStatus.REJECTED ||
    status === AppointmentStatus.CANCELLED ||
    status === AppointmentStatus.CLOSED ||
    status === AppointmentStatus.NO_SHOW
  );
}
