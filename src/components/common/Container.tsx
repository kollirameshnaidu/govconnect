import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
  wide?: boolean;
};

export function Container({
  children,
  className,
  as: Tag = "div",
  wide = false,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 md:px-6 xl:px-8",
        wide ? "max-w-[1320px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
