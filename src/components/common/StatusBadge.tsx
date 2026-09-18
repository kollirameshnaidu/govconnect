import {
  APPOINTMENT_STATUS_LABEL,
  type AppointmentStatus,
} from "@/constants/appointment-status";
import { cn } from "@/lib/cn";

const toneByStatus: Record<AppointmentStatus, string> = {
  DRAFT: "bg-surface text-muted",
  SUBMITTED: "bg-info-50 text-info",
  UNDER_REVIEW: "bg-saffron-50 text-saffron-600",
  TRANSFERRED: "bg-navy-50 text-navy-700",
  ACCEPTED: "bg-green-50 text-green-700",
  SCHEDULED: "bg-navy-50 text-navy-800",
  CONFIRMED: "bg-green-50 text-green-700",
  RESCHEDULE_REQUESTED: "bg-warning-50 text-warning",
  RESCHEDULED: "bg-navy-50 text-navy-700",
  CANCELLED: "bg-surface text-muted",
  REJECTED: "bg-danger-50 text-danger",
  CHECKED_IN: "bg-info-50 text-info",
  WAITING: "bg-saffron-50 text-saffron-600",
  MEETING_IN_PROGRESS: "bg-navy-50 text-navy-800",
  MEETING_COMPLETED: "bg-green-50 text-green-700",
  CLOSED: "bg-green-50 text-green-700",
  NO_SHOW: "bg-danger-50 text-danger",
};

type StatusBadgeProps = {
  status: AppointmentStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        toneByStatus[status],
        className,
      )}
    >
      {APPOINTMENT_STATUS_LABEL[status]}
    </span>
  );
}
