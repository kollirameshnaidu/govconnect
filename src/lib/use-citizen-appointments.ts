"use client";

import { useEffect, useMemo, useState } from "react";
import { CREATED_APPOINTMENTS_EVENT, readCreatedAppointments } from "@/lib/created-appointments";
import {
  findCitizenAppointment,
  findFrontDeskAppointment,
  findOfficialAppointment,
  listCitizenAppointments,
  listFrontDeskAppointments,
  listOfficialAppointments,
} from "@/services/appointmentService";
import type { FrontDeskSession, Official, OfficialSession, TrackedAppointment } from "@/types";

const EMPTY: TrackedAppointment[] = [];

export function useCreatedAppointments() {
  const [items, setItems] = useState<TrackedAppointment[]>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function sync() {
      const next = readCreatedAppointments();
      setItems((current) => {
        if (
          current.length === next.length &&
          current.every(
            (item, index) =>
              item.id === next[index]?.id &&
              item.status === next[index]?.status &&
              item.confirmedAt === next[index]?.confirmedAt &&
              item.officialId === next[index]?.officialId &&
              item.queuePosition === next[index]?.queuePosition,
          )
        ) {
          return current;
        }
        return next;
      });
      setReady(true);
    }
    sync();
    window.addEventListener(CREATED_APPOINTMENTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CREATED_APPOINTMENTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { items, ready };
}

export function useCitizenAppointments(citizenId?: string) {
  const { items, ready } = useCreatedAppointments();
  const appointments = useMemo(
    () => (citizenId ? listCitizenAppointments(citizenId, items) : EMPTY),
    [citizenId, items],
  );
  return { appointments, ready };
}

export function useCitizenAppointment(citizenId: string | undefined, appointmentId: string) {
  const { items, ready } = useCreatedAppointments();
  const appointment = useMemo(
    () =>
      citizenId ? findCitizenAppointment(citizenId, appointmentId, items) : undefined,
    [appointmentId, citizenId, items],
  );
  return { appointment, ready };
}

export function useOfficialAppointments(official?: OfficialSession | Official | null) {
  const { items, ready } = useCreatedAppointments();
  const appointments = useMemo(
    () => (official ? listOfficialAppointments(official, items) : EMPTY),
    [items, official],
  );
  return { appointments, ready };
}

export function useOfficialAppointment(
  official: OfficialSession | Official | null | undefined,
  appointmentId: string,
) {
  const { items, ready } = useCreatedAppointments();
  const appointment = useMemo(
    () => (official ? findOfficialAppointment(official, appointmentId, items) : undefined),
    [appointmentId, items, official],
  );
  return { appointment, ready };
}

export function useFrontDeskAppointments(staff?: FrontDeskSession | null) {
  const { items, ready } = useCreatedAppointments();
  const appointments = useMemo(
    () => (staff ? listFrontDeskAppointments(staff, items) : EMPTY),
    [items, staff],
  );
  return { appointments, ready };
}

export function useFrontDeskAppointment(
  staff: FrontDeskSession | null | undefined,
  appointmentId: string,
) {
  const { items, ready } = useCreatedAppointments();
  const appointment = useMemo(
    () => (staff ? findFrontDeskAppointment(staff, appointmentId, items) : undefined),
    [appointmentId, items, staff],
  );
  return { appointment, ready };
}
