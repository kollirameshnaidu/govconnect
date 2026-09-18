import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: IconName;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon = "info",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid justify-items-start gap-3 rounded-lg border border-dashed border-line bg-white px-5 py-8",
        className,
      )}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-navy-50 text-navy-800">
        <Icon name={icon} />
      </span>
      <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
      <p className="max-w-xl text-sm leading-6 text-muted">{description}</p>
      {action}
    </div>
  );
}
