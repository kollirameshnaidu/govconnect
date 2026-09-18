import { CitizenNotificationList } from "@/components/citizen/CitizenNotificationList";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications" };

export default function CitizenNotificationsPage() {
  return <CitizenNotificationList />;
}
