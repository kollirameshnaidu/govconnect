import { OFFICES, QUICK_SERVICES } from "@/mock/homepage";
import { getDepartmentsByIds } from "@/services/departmentService";
import { readAdminConfig } from "@/lib/admin-config";
import type { Department, GovernmentOffice, QuickService } from "@/types";

function mergedOffices(): GovernmentOffice[] {
  const extra = readAdminConfig().offices;
  const extraIds = new Set(extra.map((item) => item.id));
  return [...extra, ...OFFICES.filter((item) => !extraIds.has(item.id))];
}

export function searchOffices(
  query: string,
  district: string,
): GovernmentOffice[] {
  const q = query.trim().toLowerCase();
  return mergedOffices().filter((office) => {
    const districtMatch =
      !district || district === "All districts" || office.district === district;
    const textMatch =
      !q ||
      office.name.toLowerCase().includes(q) ||
      office.address.toLowerCase().includes(q) ||
      office.district.toLowerCase().includes(q);
    return districtMatch && textMatch;
  });
}

export function getOfficeById(id: string): GovernmentOffice | undefined {
  return mergedOffices().find((item) => item.id === id);
}

export function getOfficesByIds(ids: string[]): GovernmentOffice[] {
  return mergedOffices().filter((item) => ids.includes(item.id));
}

export function getServicesForDepartment(departmentId: string): QuickService[] {
  return QUICK_SERVICES.filter((item) => item.departmentId === departmentId);
}

export function getDepartmentsForOffice(office: GovernmentOffice): Department[] {
  return getDepartmentsByIds(office.departmentIds);
}

