import { mutateAppointment } from "@/server/appointment-actions";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return mutateAppointment(request, context);
}
