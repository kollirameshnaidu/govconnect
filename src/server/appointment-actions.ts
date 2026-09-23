import { isAdminSession } from "@/lib/session";
import {
  errorResponse,
  jsonError,
  jsonOk,
  readJson,
  requireCitizen,
  requireFrontDesk,
  requireOfficial,
  requireSession,
} from "@/server/http";
import { withStore } from "@/server/persist";
import {
  acceptOfficialRequest,
  addOfficialMeetingNotes,
  callNextFrontDeskVisitor,
  cancelCitizenAppointment,
  checkInFrontDeskVisit,
  closeOfficialAppointment,
  completeOfficialMeeting,
  confirmCitizenVisit,
  markFrontDeskNoShow,
  rejectOfficialRequest,
  requestCitizenReschedule,
  scheduleOfficialAppointment,
  sendFrontDeskVisitToQueue,
  startOfficialMeeting,
  takeUpOfficialRequest,
  transferOfficialRequest,
} from "@/services/appointmentService";
import { assertLiveSession } from "@/server/accounts";
import type { TrackedAppointment } from "@/types";

type ActionBody = {
  action?: string;
  reason?: string;
  notes?: string;
  actionTaken?: string;
  date?: string;
  time?: string;
  documentsToCarry?: string;
  officialId?: string;
  category?: string;
};

export async function mutateAppointment(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();
    const { id } = await context.params;
    const body = await readJson<ActionBody>(request);
    const action = body.action ?? "";

    if (isAdminSession(session)) {
      return jsonError("Administrators cannot change appointment workflow or assign a confirmed slot.", 403);
    }

    const appointment = await withStore(async (): Promise<TrackedAppointment> => {
      assertLiveSession(session);
      if (action === "confirm") {
        const citizen = await requireCitizen();
        return confirmCitizenVisit(citizen, id);
      }
      if (action === "cancel") {
        const citizen = await requireCitizen();
        return cancelCitizenAppointment(citizen, id, body.reason ?? "");
      }
      if (action === "reschedule") {
        const citizen = await requireCitizen();
        return requestCitizenReschedule(citizen, id, body.reason ?? "");
      }
      if (action === "takeUp") {
        const official = await requireOfficial();
        return takeUpOfficialRequest(official, id);
      }
      if (action === "accept") {
        const official = await requireOfficial();
        return acceptOfficialRequest(official, id);
      }
      if (action === "reject") {
        const official = await requireOfficial();
        return rejectOfficialRequest(official, id, body.reason ?? "");
      }
      if (action === "schedule") {
        const official = await requireOfficial();
        return scheduleOfficialAppointment(official, id, {
          date: body.date ?? "",
          time: body.time ?? "",
          documentsToCarry: body.documentsToCarry ?? "",
        });
      }
      if (action === "transfer") {
        const official = await requireOfficial();
        return transferOfficialRequest(official, id, {
          officialId: body.officialId ?? "",
          category: body.category,
          reason: body.reason ?? "",
        });
      }
      if (action === "startMeeting") {
        const official = await requireOfficial();
        return startOfficialMeeting(official, id);
      }
      if (action === "addNotes") {
        const official = await requireOfficial();
        return addOfficialMeetingNotes(official, id, body.notes ?? "");
      }
      if (action === "completeMeeting") {
        const official = await requireOfficial();
        return completeOfficialMeeting(official, id);
      }
      if (action === "close") {
        const official = await requireOfficial();
        return closeOfficialAppointment(official, id, body.actionTaken ?? "");
      }
      if (action === "checkIn") {
        const staff = await requireFrontDesk();
        return checkInFrontDeskVisit(staff, id);
      }
      if (action === "queue") {
        const staff = await requireFrontDesk();
        return sendFrontDeskVisitToQueue(staff, id);
      }
      if (action === "call") {
        const staff = await requireFrontDesk();
        return callNextFrontDeskVisitor(staff, id);
      }
      if (action === "noShow") {
        const staff = await requireFrontDesk();
        return markFrontDeskNoShow(staff, id);
      }
      throw new Error("This appointment action is not supported.");
    });

    return jsonOk({ appointment });
  } catch (error) {
    return errorResponse(error);
  }
}
