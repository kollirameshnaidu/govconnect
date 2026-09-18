import Link from "next/link";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
  align?: "left" | "center";
  tone?: "default" | "invert";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  align = "left",
  tone = "default",
}: SectionHeadingProps) {
  const inverted = tone === "invert";
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-2 text-xs font-semibold uppercase tracking-[0.16em]",
              inverted ? "text-india-saffron" : "text-saffron-600",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-2xl font-bold md:text-[28px] md:leading-9",
            inverted ? "text-white" : "text-navy-900",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-2 text-sm leading-6 md:text-base",
              inverted ? "text-white/75" : "text-muted",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {href && actionLabel ? (
        <Link
          href={href}
          className={cn(
            "text-sm font-semibold hover:text-saffron-600",
            inverted ? "text-white" : "text-navy-700",
          )}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
