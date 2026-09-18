"use client";

import { createContext, useContext, type ReactNode } from "react";
import { ApiHydrator } from "@/components/auth/ApiHydrator";
import { useAppSession } from "@/lib/auth-store";
import type { AppSession } from "@/types";

const SessionContext = createContext<AppSession | null>(null);

export function AuthProvider({
  initialSession,
  children,
}: {
  initialSession: AppSession | null;
  children: ReactNode;
}) {
  const session = useAppSession(initialSession);
  return (
    <SessionContext.Provider value={session}>
      <ApiHydrator session={session}>{children}</ApiHydrator>
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
