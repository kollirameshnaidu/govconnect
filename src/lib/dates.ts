import { readAdminConfig } from "@/lib/admin-config";

export const CLOSED_WEEKDAYS = [0] as const;

export const HOLIDAYS_2026 = [
  { date: "2026-10-02", label: "Gandhi Jayanti" },
  { date: "2026-12-25", label: "Christmas" },
] as const;

export function listHolidays() {
  const extra = readAdminConfig().holidays;
  const map = new Map<string, { date: string; label: string }>();
  for (const item of HOLIDAYS_2026) map.set(item.date, item);
  for (const item of extra) map.set(item.date, { date: item.date, label: item.label });
  return [...map.values()];
}

export function parseIsoDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function formatDisplayDate(value: string): string {
  return parseIsoDate(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateTimeLabel(date: Date): string {
  const time = date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatDisplayDate(toIsoDate(date))}, ${time}`;
}

export function formatTimeLabel(hhmm: string): string {
  const [hourText, minuteText] = hhmm.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return hhmm;
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function workingDateIssue(value: string): string | null {
  const issue = preferredDateIssue(value);
  if (!issue) return null;
  return issue
    .replace("Preferred date", "Assigned date")
    .replace("Select a preferred date.", "Select an assigned date.");
}

export const OFFICE_SLOT_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

export function preferredDateIssue(value: string): string | null {
  if (!value) return "Select a preferred date.";
  const date = parseIsoDate(value);
  if (Number.isNaN(date.getTime())) return "Enter a valid date.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = parseIsoDate(value);
  compare.setHours(0, 0, 0, 0);
  if (compare <= today) return "Preferred date must be a future working day.";
  if (date.getDay() === 0) return "Offices are closed on Sundays. Choose a working day.";
  const holiday = listHolidays().find((item) => item.date === value);
  if (holiday) {
    return `${holiday.label} is a notified holiday. An official cannot confirm a slot on this date.`;
  }
  return null;
}
