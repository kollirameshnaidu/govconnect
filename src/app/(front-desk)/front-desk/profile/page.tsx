import { FrontDeskProfileForm } from "@/components/frontdesk/FrontDeskProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Front desk profile" };

export default function FrontDeskProfilePage() {
  return <FrontDeskProfileForm />;
}
