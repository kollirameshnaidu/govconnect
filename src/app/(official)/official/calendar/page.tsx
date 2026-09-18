import { OfficialCalendar } from "@/components/official/OfficialCalendar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Calendar" };

export default function OfficialCalendarPage() {
  return <OfficialCalendar />;
}
