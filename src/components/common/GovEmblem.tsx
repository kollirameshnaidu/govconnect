import { cn } from "@/lib/cn";

type GovEmblemProps = {
  className?: string;
};

export function GovEmblem({ className }: GovEmblemProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-14 w-14", className)}
      role="img"
      aria-label="GovConnect placeholder emblem"
    >
      <circle cx="32" cy="32" r="30" fill="#0B1F3A" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#E06C00" strokeWidth="2" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
      <path
        d="M18 40V28l14-10 14 10v12"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M25 40v-8h14v8" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="32" cy="24" r="2.2" fill="#E06C00" />
    </svg>
  );
}
