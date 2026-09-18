import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "article" | "div" | "section";
  padding?: "sm" | "md" | "lg";
};

const paddings = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
} as const;

export function Card({
  children,
  className,
  as: Tag = "div",
  padding = "md",
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg border border-line bg-white shadow-[var(--shadow-card)]",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
