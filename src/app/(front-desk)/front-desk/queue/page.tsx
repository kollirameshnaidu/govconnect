import { FrontDeskQueue } from "@/components/frontdesk/FrontDeskQueue";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Waiting queue" };

export default function FrontDeskQueuePage() {
  return <FrontDeskQueue />;
}
