"use client";

import { useEffect, type ReactNode } from "react";
import { api } from "@/constants/api";
import { mergeAdminOverlay, type AdminConfig } from "@/lib/admin-config";
import { apiRequest } from "@/lib/api-client";
import { hydrateCreatedAppointments } from "@/lib/created-appointments";
import type { AppSession, TrackedAppointment } from "@/types";

type CatalogResponse = {
  overlay: Partial<AdminConfig>;
};

export function ApiHydrator({
  session,
  children,
}: {
  session: AppSession | null;
  children: ReactNode;
}) {
  const sessionKey = session ? `${session.role}:${session.id}` : "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const catalog = await apiRequest<CatalogResponse>(api.catalog);
        if (!cancelled) mergeAdminOverlay(catalog.overlay);
      } catch {
        /* keep the last local overlay if the catalog is unreachable */
      }

      if (!session) return;

      try {
        const data = await apiRequest<{ appointments: TrackedAppointment[] }>(api.appointments);
        if (!cancelled && Array.isArray(data.appointments)) {
          hydrateCreatedAppointments(data.appointments);
        }
      } catch {
        /* keep the last local appointment cache */
      }

      if (session.role !== "admin") return;

      try {
        const data = await apiRequest<{ config: AdminConfig }>(api.admin);
        if (!cancelled && data.config) mergeAdminOverlay(data.config);
      } catch {
        /* keep the last local administrator overlay */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [session, sessionKey]);

  return children;
}
