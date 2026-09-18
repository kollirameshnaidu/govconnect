import { FRONT_DESK_STAFF } from "@/mock/front-desk";
import type { FrontDeskStaff } from "@/types";

export function getFrontDeskStaffByStaffId(staffId: string): FrontDeskStaff | undefined {
  const key = staffId.trim().toUpperCase();
  return FRONT_DESK_STAFF.find((item) => item.staffId === key);
}

export function getFrontDeskStaffById(id: string): FrontDeskStaff | undefined {
  return FRONT_DESK_STAFF.find((item) => item.id === id);
}
