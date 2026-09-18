import { OfficialProfileForm } from "@/components/official/OfficialProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Official profile" };

export default function OfficialProfilePage() {
  return <OfficialProfileForm />;
}
