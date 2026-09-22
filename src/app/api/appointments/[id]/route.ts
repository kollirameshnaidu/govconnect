import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
} from "@/lib/session";
import { mutateAppointment } from "@/server/appointment-actions";
import { jsonError, jsonOk, requireSession } from "@/server/http";
import { withStore } from "@/server/persist";
import { listAdminAppointments } from "@/services/adminService";
import {
  findCitizenAppointment,
  findFrontDeskAppointment,
  findOfficialAppointment,
} from "@/services/appointmentService";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { id } = await context.params;
    const appointment = await withStore(async () => {
      if (isCitizenSession(session)) return findCitizenAppointment(session.id, id);
      if (isOfficialSession(session)) return findOfficialAppointment(session, id);
      if (isFrontDeskSession(session)) return findFrontDeskAppointment(session, id);
      if (isAdminSession(session)) {
        return listAdminAppointments(session).find(
          (item) => item.id === id.trim().toUpperCase(),
        );
      }
      return undefined;
    }, { write: false });
    if (!appointment) return jsonError("Appointment not found for this signed-in profile.", 404);
    return jsonOk({ appointment });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return mutateAppointment(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return mutateAppointment(request, context);
}

export async function DELETE() {
  return jsonError(
    "Appointment IDs are never hard-deleted. Use reject, no-show, or close so the record stays in MongoDB with the same ID.",
    405,
  );
}
