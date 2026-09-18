import { OFFICIALS } from "@/mock/officials";
import { readAdminConfig } from "@/lib/admin-config";
import type { Official } from "@/types";

function mergedOfficials(): Official[] {
  const extra = readAdminConfig().officials;
  const extraIds = new Set(extra.map((item) => item.id));
  return [...extra, ...OFFICIALS.filter((item) => !extraIds.has(item.id))];
}

export function getOfficialsForDesk(officeId: string, departmentId: string): Official[] {
  return mergedOfficials().filter(
    (item) => item.officeId === officeId && item.departmentId === departmentId,
  );
}

export function getOfficialById(id: string): Official | undefined {
  return mergedOfficials().find((item) => item.id === id);
}

export function getOfficialByStaffId(staffId: string): Official | undefined {
  const key = staffId.trim().toUpperCase();
  return mergedOfficials().find((item) => item.staffId === key);
}

export function getAllOfficials(): Official[] {
  return mergedOfficials();
}
