import type { ReactNode } from "react";
import { OfficialShell } from "@/components/layout/OfficialShell";

export default function OfficialLayout({ children }: { children: ReactNode }) {
  return <OfficialShell>{children}</OfficialShell>;
}
