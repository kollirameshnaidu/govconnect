import { StatusBadge } from "@/components/common/StatusBadge";
import { APPOINTMENT_STATUS_LABEL } from "@/constants/appointment-status";
import { cn } from "@/lib/cn";
import { getAppointmentHistory } from "@/lib/appointment-lifecycle";
import type { TrackedAppointment } from "@/types";

export function AppointmentTimeline({ appointment }: { appointment: TrackedAppointment }) {
  const events = getAppointmentHistory(appointment);
  return (
    <ol className="grid gap-0">
      {events.map((event, index) => {
        const current = index === events.length - 1;
        return (
          <li key={`${event.status}-${event.at}`} className="grid grid-cols-[1.25rem_1fr] gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 h-3 w-3 rounded-full border-2",
                  current ? "border-navy-800 bg-navy-800" : "border-navy-700 bg-white",
                )}
              />
              {index < events.length - 1 ? <span className="w-px flex-1 bg-line" /> : null}
            </div>
            <div className="pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={event.status} />
                {current ? (
                  <span className="text-xs font-semibold text-navy-700">Current</span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-muted">{event.at}</p>
              <p className="mt-1 text-sm leading-6 text-ink">{event.note}</p>
              {event.actor ? (
                <p className="mt-1 text-xs text-muted">
                  {APPOINTMENT_STATUS_LABEL[event.status]} by {event.actor}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
