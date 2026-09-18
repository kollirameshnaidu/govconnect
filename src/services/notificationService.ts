import { ADMIN_STAFF } from "@/mock/admin";
import { ADMIN_NOTIFICATIONS } from "@/mock/admin-portal";
import { CITIZEN_NOTIFICATIONS } from "@/mock/citizen-portal";
import { FRONT_DESK_NOTIFICATIONS } from "@/mock/front-desk-portal";
import { OFFICIAL_NOTIFICATIONS } from "@/mock/official-portal";
import type {
  AdminNotification,
  AdminSession,
  CitizenNotification,
  FrontDeskNotification,
  OfficialNotification,
} from "@/types";

export function getNotificationsForCitizen(citizenId: string): CitizenNotification[] {
  return CITIZEN_NOTIFICATIONS.filter((item) => item.citizenId === citizenId);
}

export function getNotificationsForOfficial(officialId: string): OfficialNotification[] {
  return OFFICIAL_NOTIFICATIONS.filter((item) => item.officialId === officialId);
}

export function getNotificationsForFrontDesk(staffId: string): FrontDeskNotification[] {
  return FRONT_DESK_NOTIFICATIONS.filter((item) => item.staffId === staffId);
}

export function getNotificationsForAdmin(
  key: string | Pick<AdminSession, "id" | "staffId"> | null | undefined,
): AdminNotification[] {
  const list = Array.isArray(ADMIN_NOTIFICATIONS) ? ADMIN_NOTIFICATIONS : [];
  const aliases = new Set<string>();
  if (typeof key === "string" && key) aliases.add(key);
  if (key && typeof key === "object") {
    if (key.id) aliases.add(key.id);
    if (key.staffId) aliases.add(key.staffId);
  }
  const staff = ADMIN_STAFF.find((item) => aliases.has(item.id) || aliases.has(item.staffId));
  if (staff) {
    aliases.add(staff.id);
    aliases.add(staff.staffId);
  }
  if (!aliases.size) return [];
  return list.filter((item) => aliases.has(item.staffId));
}
