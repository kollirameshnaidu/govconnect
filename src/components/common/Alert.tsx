import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/common/Icon";

const tones = {
  info: "border-info bg-info-50 text-navy-900",
  success: "border-green-600 bg-green-50 text-green-700",
  warning: "border-warning bg-warning-50 text-warning",
  danger: "border-danger bg-danger-50 text-danger",
} as const;

const icons: Record<keyof typeof tones, IconName> = {
  info: "info",
  success: "check",
  warning: "alert",
  danger: "alert",
};

type AlertProps = {
  tone?: keyof typeof tones;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  return (
    <div
      role="status"
      className={cn("flex gap-3 rounded-md border px-4 py-3 text-sm", tones[tone], className)}
    >
      <Icon name={icons[tone]} className="mt-0.5" />
      <div className="grid gap-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-[13px] leading-5">{children}</div>
      </div>
    </div>
  );
}
