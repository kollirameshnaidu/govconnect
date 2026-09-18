import type { ReactNode } from "react";
import { CitizenShell } from "@/components/layout/CitizenShell";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
