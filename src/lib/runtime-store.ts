import type { AdminConfig } from "@/lib/admin-config";
import { TRACKED_APPOINTMENTS } from "@/mock/homepage";
import type {
  AuditLog,
  AuthAccount,
  Department,
  EscalationRecord,
  GovernmentOffice,
  Grievance,
  NotifiedHoliday,
  Official,
  TrackedAppointment,
} from "@/types";

export type RuntimeStore = {
  appointments: TrackedAppointment[];
  admin: AdminConfig;
  accounts: AuthAccount[];
  grievances: Grievance[];
};

function emptyAdmin(): AdminConfig {
  return {
    holidays: [] as NotifiedHoliday[],
    offices: [] as GovernmentOffice[],
    departments: [] as Department[],
    officials: [] as Official[],
    categories: [],
    disabledSlots: [],
    reviewHours: 48,
    departmentHours: {},
    audit: [] as AuditLog[],
    escalations: [] as EscalationRecord[],
    helpdeskEmail: "support@govconnect.gov.in",
  };
}

export function createRuntimeStore(): RuntimeStore {
  return {
    appointments: TRACKED_APPOINTMENTS.map((item) => ({ ...item })),
    admin: emptyAdmin(),
    accounts: [],
    grievances: [],
  };
}

type GlobalStore = typeof globalThis & { __gcRuntimeStore?: RuntimeStore };

export function getRuntimeStore(): RuntimeStore {
  const globalStore = globalThis as GlobalStore;
  if (!globalStore.__gcRuntimeStore) {
    globalStore.__gcRuntimeStore = createRuntimeStore();
  }
  return globalStore.__gcRuntimeStore;
}

export function replaceRuntimeStore(next: RuntimeStore) {
  (globalThis as GlobalStore).__gcRuntimeStore = next;
}
