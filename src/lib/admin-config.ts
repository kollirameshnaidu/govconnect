import { getRuntimeStore } from "@/lib/runtime-store";
import type {
  AdminSession,
  AuditLog,
  Department,
  EscalationRecord,
  GovernmentOffice,
  NotifiedHoliday,
  Official,
} from "@/types";

export const ADMIN_CONFIG_KEY = "gc.admin-config";
export const ADMIN_CONFIG_EVENT = "gc-admin-config";

export type AdminConfig = {
  holidays: NotifiedHoliday[];
  offices: GovernmentOffice[];
  departments: Department[];
  officials: Official[];
  categories: { departmentId: string; name: string }[];
  disabledSlots: string[];
  reviewHours: number;
  departmentHours: Record<string, number>;
  audit: AuditLog[];
  escalations: EscalationRecord[];
  helpdeskEmail: string;
};

export const EMPTY_ADMIN_CONFIG: AdminConfig = {
  holidays: [],
  offices: [],
  departments: [],
  officials: [],
  categories: [],
  disabledSlots: [],
  reviewHours: 48,
  departmentHours: {},
  audit: [],
  escalations: [],
  helpdeskEmail: "support@govconnect.gov.in",
};

let cachedRaw = "__unset__";
let cachedConfig: AdminConfig = EMPTY_ADMIN_CONFIG;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

export function normalizeAdminConfig(value: unknown): AdminConfig {
  const parsed = isRecord(value) ? value : {};
  return {
    holidays: Array.isArray(parsed.holidays) ? (parsed.holidays as NotifiedHoliday[]) : [],
    offices: Array.isArray(parsed.offices) ? (parsed.offices as GovernmentOffice[]) : [],
    departments: Array.isArray(parsed.departments) ? (parsed.departments as Department[]) : [],
    officials: Array.isArray(parsed.officials) ? (parsed.officials as Official[]) : [],
    categories: Array.isArray(parsed.categories)
      ? (parsed.categories as { departmentId: string; name: string }[])
      : [],
    disabledSlots: Array.isArray(parsed.disabledSlots) ? (parsed.disabledSlots as string[]) : [],
    reviewHours: typeof parsed.reviewHours === "number" ? parsed.reviewHours : 48,
    departmentHours: isRecord(parsed.departmentHours)
      ? (parsed.departmentHours as Record<string, number>)
      : {},
    audit: Array.isArray(parsed.audit) ? (parsed.audit as AuditLog[]) : [],
    escalations: Array.isArray(parsed.escalations)
      ? (parsed.escalations as EscalationRecord[])
      : [],
    helpdeskEmail:
      typeof parsed.helpdeskEmail === "string"
        ? parsed.helpdeskEmail
        : EMPTY_ADMIN_CONFIG.helpdeskEmail,
  };
}

export function readAdminConfig(): AdminConfig {
  if (typeof window === "undefined") return normalizeAdminConfig(getRuntimeStore().admin);
  const raw = window.localStorage.getItem(ADMIN_CONFIG_KEY) ?? "";
  if (raw === cachedRaw) return cachedConfig;
  if (!raw) {
    cachedRaw = "";
    cachedConfig = EMPTY_ADMIN_CONFIG;
    return cachedConfig;
  }
  try {
    cachedRaw = raw;
    cachedConfig = normalizeAdminConfig(JSON.parse(raw));
    return cachedConfig;
  } catch {
    cachedRaw = "";
    cachedConfig = EMPTY_ADMIN_CONFIG;
    return cachedConfig;
  }
}

export function writeAdminConfig(next: AdminConfig) {
  const normalized = normalizeAdminConfig(next);
  cachedConfig = normalized;
  cachedRaw = JSON.stringify(normalized);
  if (typeof window === "undefined") {
    getRuntimeStore().admin = normalized;
    return;
  }
  window.localStorage.setItem(ADMIN_CONFIG_KEY, cachedRaw);
  window.dispatchEvent(new Event(ADMIN_CONFIG_EVENT));
}

function mergeById<T extends { id: string }>(current: T[], extra: T[]) {
  const map = new Map(current.map((item) => [item.id, item]));
  for (const item of extra) map.set(item.id, item);
  return [...map.values()];
}

export function mergeAdminOverlay(overlay: Partial<AdminConfig>) {
  const current = readAdminConfig();
  writeAdminConfig({
    ...current,
    ...overlay,
    offices: overlay.offices ? mergeById(current.offices, overlay.offices) : current.offices,
    departments: overlay.departments
      ? mergeById(current.departments, overlay.departments)
      : current.departments,
    officials: overlay.officials ? mergeById(current.officials, overlay.officials) : current.officials,
    holidays: overlay.holidays
      ? [
          ...overlay.holidays,
          ...current.holidays.filter(
            (item) => !overlay.holidays?.some((holiday) => holiday.date === item.date),
          ),
        ]
      : current.holidays,
    categories: overlay.categories ?? current.categories,
    audit: overlay.audit ?? current.audit,
    escalations: overlay.escalations ?? current.escalations,
  });
}

function stamp() {
  return new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function adminActor(session: AdminSession) {
  return `${session.name}, ${session.designation}`;
}

export function withAdminAudit(
  session: AdminSession,
  action: string,
  detail: string,
  patch: Partial<AdminConfig>,
) {
  const current = readAdminConfig();
  const entry: AuditLog = {
    id: `audit-${Date.now()}`,
    at: stamp(),
    actor: adminActor(session),
    action,
    detail,
  };
  writeAdminConfig({
    ...current,
    ...patch,
    audit: [entry, ...current.audit],
  });
}
