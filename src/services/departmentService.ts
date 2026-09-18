import { DEPARTMENTS } from "@/mock/homepage";
import { readAdminConfig } from "@/lib/admin-config";
import type { Department } from "@/types";

function mergedDepartments(): Department[] {
  const config = readAdminConfig();
  const extra = config.departments;
  const extraIds = new Set(extra.map((item) => item.id));
  return [...extra, ...DEPARTMENTS.filter((item) => !extraIds.has(item.id))].map((department) => {
    const added = config.categories
      .filter((item) => item.departmentId === department.id)
      .map((item) => item.name);
    if (!added.length) return department;
    const categories = [...department.categories];
    for (const name of added) {
      if (!categories.includes(name)) categories.push(name);
    }
    return { ...department, categories };
  });
}

export function getDepartmentById(id: string): Department | undefined {
  return mergedDepartments().find((item) => item.id === id);
}

export function getDepartmentsByIds(ids: string[]): Department[] {
  return mergedDepartments().filter((item) => ids.includes(item.id));
}
