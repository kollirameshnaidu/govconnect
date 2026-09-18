import { cn } from "@/lib/cn";

const paths = {
  search:
    "M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z",
  calendar:
    "M8 3v3M16 3v3M4.5 8h15M6 5.5h12A1.5 1.5 0 0 1 19.5 7v12A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19V7A1.5 1.5 0 0 1 6 5.5z",
  building:
    "M4 20h16M6 20V8l6-4 6 4v12M10 20v-5h4v5M9 11h.01M15 11h.01M9 14.5h.01M15 14.5h.01",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 21v-2a4 4 0 0 0-3-3.87M16.5 3.13a4 4 0 0 1 0 7.75",
  file: "M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8zM13 3v6h6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  phone: "M6.5 4.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3A2 2 0 0 1 18.5 20 15.5 15.5 0 0 1 4 5.5 2 2 0 0 1 6.5 4.5z",
  mail: "M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5zM5 7l7 5 7-5",
  pin: "M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11zM12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  shield: "M12 3l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  info: "M12 11v6M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  alert: "M12 9v5M12 17h.01M10.3 4.7L2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0z",
  help: "M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1.4 1.1-1.4 2V14M12 17h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  login: "M10 17l5-5-5-5M15 12H3M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4",
  userPlus:
    "M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M16 11h6",
  landmark: "M4 20h16M6 10h12M5 10l7-6 7 6M8 10v7M12 10v7M16 10v7M4 17h16",
  stamp: "M8 14h8a3 3 0 0 1 3 3v3H5v-3a3 3 0 0 1 3-3zM12 4a4 4 0 0 1 2.5 7.1 6 6 0 0 0-5 0A4 4 0 0 1 12 4z",
  book: "M5 5.5A1.5 1.5 0 0 1 6.5 4H20v15H6.5A1.5 1.5 0 0 0 5 20.5 1.5 1.5 0 0 1 6.5 22H20M5 5.5V20.5",
  heart:
    "M12 19s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 2.8C19 14.6 12 19 12 19z",
  contrast: "M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18",
  qr: "M6 6h5v5H6zM13 6h5v5h-5zM6 13h5v5H6zM15 13h1v1h-1zM17 15h1v1h-1zM13 17h3v3h-3z",
  track: "M4 6h10M4 12h16M4 18h8",
  bell: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0",
  logout: "M14 8l5 4-5 4M19 12H9M11 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4",
  home: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z",
} as const;

export type IconName = keyof typeof paths;

type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={cn("h-5 w-5 shrink-0", className)}
    >
      {title ? <title>{title}</title> : null}
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
