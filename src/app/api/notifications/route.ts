import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { jsonError, jsonOk, requireSession } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";
import {
  getNotificationsForAdmin,
  getNotificationsForCitizen,
  getNotificationsForFrontDesk,
  getNotificationsForOfficial,
} from "@/services/notificationService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireSession();
    const notifications = await withStore(() => {
      const live = assertLiveSession(session);
      if (isCitizenSession(live)) return getNotificationsForCitizen(live.id);
      if (isOfficialSession(live)) return getNotificationsForOfficial(live);
      if (isFrontDeskSession(live)) return getNotificationsForFrontDesk(live);
      if (isAdminSession(live)) return getNotificationsForAdmin(live);
      return [];
    }, { write: false });
    return jsonOk({ notifications });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}
