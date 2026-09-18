import type { TrackedAppointment } from "@/types";
import { getRuntimeStore } from "@/lib/runtime-store";

export const CREATED_APPOINTMENTS_EVENT = "gc-appointments";
export const CREATED_APPOINTMENTS_KEY = "gc.created-appointments";

let cachedRaw = "__unset__";
let cachedItems: TrackedAppointment[] = [];

export function readCreatedAppointments(): TrackedAppointment[] {
  if (typeof window === "undefined") {
    return getRuntimeStore().appointments;
  }
  const raw = window.localStorage.getItem(CREATED_APPOINTMENTS_KEY) ?? "[]";
  if (raw === cachedRaw) return cachedItems;
  try {
    const parsed = JSON.parse(raw) as TrackedAppointment[];
    cachedRaw = raw;
    cachedItems = Array.isArray(parsed) ? parsed : [];
    return cachedItems;
  } catch {
    cachedRaw = "[]";
    cachedItems = [];
    return cachedItems;
  }
}

export function saveCreatedAppointment(appointment: TrackedAppointment) {
  if (typeof window === "undefined") {
    const store = getRuntimeStore();
    store.appointments = [
      appointment,
      ...store.appointments.filter((item) => item.id !== appointment.id),
    ];
    return;
  }
  const next = [appointment, ...readCreatedAppointments().filter((item) => item.id !== appointment.id)];
  hydrateCreatedAppointments(next);
}

export function hydrateCreatedAppointments(items: TrackedAppointment[]) {
  const next = Array.isArray(items) ? items : [];
  cachedItems = next;
  cachedRaw = JSON.stringify(next);
  if (typeof window === "undefined") {
    getRuntimeStore().appointments = next;
    return;
  }
  window.localStorage.setItem(CREATED_APPOINTMENTS_KEY, cachedRaw);
  window.dispatchEvent(new Event(CREATED_APPOINTMENTS_EVENT));
}
