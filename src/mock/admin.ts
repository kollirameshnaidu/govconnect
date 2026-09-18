import type { AdminStaff } from "@/types";

export const ADMIN_STAFF: AdminStaff[] = [
  {
    id: "nanda-super",
    name: "R. Nanda",
    designation: "Super administrator",
    staffId: "ADM-1101",
    kind: "super",
  },
  {
    id: "sen-revenue-admin",
    name: "P. Sen",
    designation: "Department administrator",
    staffId: "ADM-2101",
    kind: "department",
    departmentId: "revenue",
  },
  {
    id: "iyer-central-admin",
    name: "G. Iyer",
    designation: "District administrator",
    staffId: "ADM-3101",
    kind: "district",
    district: "Central district",
  },
];
