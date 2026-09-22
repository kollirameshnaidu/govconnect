import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { jsonError, jsonOk, requireSession } from "@/server/http";
import { withStore } from "@/server/persist";
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
      if (isCitizenSession(session)) return getNotificationsForCitizen(session.id);
      if (isOfficialSession(session)) return getNotificationsForOfficial(session.id);
      if (isFrontDeskSession(session)) return getNotificationsForFrontDesk(session.staffId);
      if (isAdminSession(session)) return getNotificationsForAdmin(session);
      return [];
    }, { write: false });
    return jsonOk({ notifications });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}
