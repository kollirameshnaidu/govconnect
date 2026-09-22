import { ANNOUNCEMENTS } from "@/mock/homepage";
import { readAdminConfig } from "@/lib/admin-config";
import { jsonError, jsonOk } from "@/server/http";
import { withStore } from "@/server/persist";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return await withStore(async () => {
      const config = readAdminConfig();
      return jsonOk({
        overlay: {
          holidays: config.holidays,
          offices: config.offices,
          departments: config.departments,
          officials: config.officials,
          categories: config.categories,
          disabledSlots: config.disabledSlots,
          reviewHours: config.reviewHours,
          departmentHours: config.departmentHours,
          helpdeskEmail: config.helpdeskEmail,
        },
        announcements: ANNOUNCEMENTS,
      });
    }, { write: false });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not load the public catalog.", 503);
  }
}
