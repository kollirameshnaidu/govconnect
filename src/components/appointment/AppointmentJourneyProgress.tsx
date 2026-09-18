import { AppointmentStatus, type AppointmentStatus as Status } from "@/constants/appointment-status";
import { cn } from "@/lib/cn";
import { getJourneyIndex, getJourneySteps, isTerminalStatus } from "@/lib/appointment-lifecycle";

export function AppointmentJourneyProgress({ status }: { status: Status }) {
  const current = getJourneyIndex(status);
  const stopped = isTerminalStatus(status) && status !== AppointmentStatus.CLOSED;
  return (
    <ol className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {getJourneySteps().map((step, index) => {
        const reached = index <= current;
        const active = index === current;
        return (
          <li
            key={step.id}
            className={cn(
              "rounded-md border px-3 py-2 text-sm",
              active
                ? stopped
                  ? "border-danger bg-danger-50 text-danger"
                  : "border-navy-800 bg-navy-800 text-white"
                : reached
                  ? "border-navy-50 bg-navy-50 text-navy-800"
                  : "border-line bg-white text-muted",
            )}
          >
            <span className="block text-xs font-semibold">
              {index + 1}. {step.title}
            </span>
            <span className={cn("mt-1 block text-xs", active && !stopped ? "text-white/80" : "")}>
              {step.description}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
