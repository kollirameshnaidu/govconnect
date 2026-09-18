import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { TRACKED_APPOINTMENTS } from "@/mock/homepage";
import {
  createRuntimeStore,
  getRuntimeStore,
  replaceRuntimeStore,
  type RuntimeStore,
} from "@/lib/runtime-store";
import { normalizeAdminConfig } from "@/lib/admin-config";
import type { CitizenSession, Grievance, TrackedAppointment } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "govconnect.json");

let loaded = false;
let queue: Promise<unknown> = Promise.resolve();

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseStore(raw: string): RuntimeStore {
  const fallback = createRuntimeStore();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return fallback;
    const savedAppointments = asArray<TrackedAppointment>(parsed.appointments);
    const savedIds = new Set(savedAppointments.map((item) => item.id));
    const missingSeeds = TRACKED_APPOINTMENTS.filter((item) => !savedIds.has(item.id)).map(
      (item) => ({ ...item }),
    );
    return {
      appointments: [...savedAppointments, ...missingSeeds],
      admin: normalizeAdminConfig(parsed.admin),
      citizens: asArray<CitizenSession>(parsed.citizens),
      grievances: asArray<Grievance>(parsed.grievances),
    };
  } catch {
    return fallback;
  }
}

async function loadStore() {
  if (loaded) return;
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    replaceRuntimeStore(parseStore(raw));
  } catch {
    replaceRuntimeStore(createRuntimeStore());
  }
  loaded = true;
}

async function saveStore() {
  await mkdir(DATA_DIR, { recursive: true });
  const store = getRuntimeStore();
  await writeFile(DATA_FILE, JSON.stringify(store), "utf8");
}

export function withStore<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    await loadStore();
    const result = await fn();
    await saveStore();
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
