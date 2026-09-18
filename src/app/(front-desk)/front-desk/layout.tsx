import type { ReactNode } from "react";
import { FrontDeskShell } from "@/components/layout/FrontDeskShell";

export default function FrontDeskLayout({ children }: { children: ReactNode }) {
  return <FrontDeskShell>{children}</FrontDeskShell>;
}
