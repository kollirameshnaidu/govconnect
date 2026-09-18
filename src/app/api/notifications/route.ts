import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { jsonError, jsonOk, requireSession } from "@/server/http";
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
    if (isCitizenSession(session)) {
      return jsonOk({ notifications: getNotificationsForCitizen(session.id) });
    }
    if (isOfficialSession(session)) {
      return jsonOk({ notifications: getNotificationsForOfficial(session.id) });
    }
    if (isFrontDeskSession(session)) {
      return jsonOk({ notifications: getNotificationsForFrontDesk(session.staffId) });
    }
    if (isAdminSession(session)) {
      return jsonOk({ notifications: getNotificationsForAdmin(session) });
    }
    return jsonOk({ notifications: [] });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}
