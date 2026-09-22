import { jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { trackAppointment } from "@/services/appointmentService";

export const dynamic = "force-dynamic";

type TrackBody = {
  appointmentId?: string;
  mobile?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<TrackBody>(request);
    const appointment = await withStore(
      () => trackAppointment(body.appointmentId ?? "", body.mobile ?? ""),
      { write: false },
    );
    return jsonOk({ appointment });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not track this appointment.");
  }
}
