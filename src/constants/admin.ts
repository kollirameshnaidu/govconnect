import { routes } from "@/constants/routes";
import type { AdminKind, AdminPermission, AdminSession } from "@/types";

export const ADMIN_KIND_LABEL: Record<AdminKind, string> = {
  super: "Super administrator",
  district: "District administrator",
  department: "Department administrator",
};

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] = [
  "offices",
  "departments",
  "categories",
  "officials",
  "users",
  "roles",
  "appointments",
  "slots",
  "holidays",
  "sla",
  "escalation",
  "notifications",
  "reports",
  "audit",
  "settings",
];

export const ADMIN_PERMISSION_LABEL: Record<AdminPermission, string> = {
  offices: "Offices",
  departments: "Departments",
  categories: "Categories",
  officials: "Officials",
  users: "Users",
  roles: "Roles",
  appointments: "Appointments",
  slots: "Slots",
  holidays: "Holidays",
  sla: "SLA",
  escalation: "Escalation",
  notifications: "Notifications",
  reports: "Reports",
  audit: "Audit",
  settings: "Settings",
};

const SUPER = ALL_ADMIN_PERMISSIONS;

const DISTRICT: AdminPermission[] = [
  "offices",
  "officials",
  "users",
  "appointments",
  "slots",
  "holidays",
  "escalation",
  "notifications",
  "reports",
  "audit",
];

const DEPARTMENT: AdminPermission[] = [
  "categories",
  "officials",
  "appointments",
  "slots",
  "sla",
  "notifications",
  "reports",
];

export const ADMIN_PERMISSIONS: Record<AdminKind, AdminPermission[]> = {
  super: SUPER,
  district: DISTRICT,
  department: DEPARTMENT,
};

export function canAdmin(
  session: AdminSession | null | undefined,
  permission: AdminPermission,
): boolean {
  if (!session) return false;
  return ADMIN_PERMISSIONS[session.kind].includes(permission);
}

export const ADMIN_NAV_ITEMS: { href: string; label: string; permission?: AdminPermission }[] = [
  { href: routes.adminDashboard, label: "Dashboard" },
  { href: routes.adminOffices, label: "Offices", permission: "offices" },
  { href: routes.adminDepartments, label: "Departments", permission: "departments" },
  { href: routes.adminCategories, label: "Categories", permission: "categories" },
  { href: routes.adminOfficials, label: "Officials", permission: "officials" },
  { href: routes.adminUsers, label: "Users", permission: "users" },
  { href: routes.adminRoles, label: "Roles", permission: "roles" },
  { href: routes.adminAppointments, label: "Appointments", permission: "appointments" },
  { href: routes.adminSlots, label: "Slots", permission: "slots" },
  { href: routes.adminHolidays, label: "Holidays", permission: "holidays" },
  { href: routes.adminSla, label: "SLA", permission: "sla" },
  { href: routes.adminEscalation, label: "Escalation", permission: "escalation" },
  { href: routes.adminNotifications, label: "Notifications", permission: "notifications" },
  { href: routes.adminReports, label: "Reports", permission: "reports" },
  { href: routes.adminAudit, label: "Audit", permission: "audit" },
  { href: routes.adminSettings, label: "Settings", permission: "settings" },
];
