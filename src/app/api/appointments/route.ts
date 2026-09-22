import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { jsonError, jsonOk, readJson, requireCitizen, requireSession } from "@/server/http";
import { withStore } from "@/server/persist";
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
      if (isCitizenSession(session)) return listCitizenAppointments(session.id);
      if (isOfficialSession(session)) return listOfficialAppointments(session);
      if (isFrontDeskSession(session)) return listFrontDeskAppointments(session);
      if (isAdminSession(session)) return listAdminAppointments(session);
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
    const appointment = await withStore(() => submitAppointmentRequest(session, body.draft!));
    return jsonOk({ appointment }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not submit the request.");
  }
}
