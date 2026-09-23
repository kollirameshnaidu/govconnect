import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { jsonError, jsonOk, readJson, requireCitizen, requireSession } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";
import { listAdminAppointments } from "@/services/adminService";
import {
  listCitizenAppointments,
  listFrontDeskAppointments,
  listOfficialAppointments,
  submitAppointmentRequest,
} from "@/services/appointmentService";
import type { AppointmentDraft } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireSession();
    const appointments = await withStore(async () => {
      const live = assertLiveSession(session);
      if (isCitizenSession(live)) return listCitizenAppointments(live.id);
      if (isOfficialSession(live)) return listOfficialAppointments(live);
      if (isFrontDeskSession(live)) return listFrontDeskAppointments(live);
      if (isAdminSession(live)) return listAdminAppointments(live);
      return [];
    }, { write: false });
    return jsonOk({ appointments });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireCitizen();
    const body = await readJson<{ draft?: AppointmentDraft }>(request);
    if (!body.draft) throw new Error("Complete the appointment request before submitting.");
    const appointment = await withStore(() => {
      const live = assertLiveSession(session);
      if (!isCitizenSession(live)) throw new Error("This action is limited to the signed-in citizen.");
      return submitAppointmentRequest(live, body.draft!);
    });
    return jsonOk({ appointment }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not submit the request.");
  }
}
