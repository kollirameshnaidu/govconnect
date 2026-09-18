import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-saffron-500 text-white hover:bg-saffron-600 focus-visible:outline-saffron-500",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-900 focus-visible:outline-navy-700",
  outline:
    "border border-navy-800 bg-white text-navy-800 hover:bg-navy-50",
  inverse:
    "border border-white bg-transparent text-white hover:bg-white/10",
  ghost: "text-navy-800 hover:bg-navy-50",
  danger: "bg-danger text-white hover:bg-[#931c13]",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  icon?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {icon}
      {children}
    </button>
  );
}
