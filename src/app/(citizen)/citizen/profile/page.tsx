import { CitizenProfileForm } from "@/components/citizen/CitizenProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default function CitizenProfilePage() {
  return <CitizenProfileForm />;
}
