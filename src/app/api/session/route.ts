import { getRequestSession, jsonOk } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getRequestSession();
  return jsonOk({ session });
}
