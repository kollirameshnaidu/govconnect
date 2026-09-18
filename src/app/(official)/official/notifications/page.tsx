import { OfficialNotificationList } from "@/components/official/OfficialNotificationList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Official notifications" };

export default function OfficialNotificationsPage() {
  return <OfficialNotificationList />;
}
