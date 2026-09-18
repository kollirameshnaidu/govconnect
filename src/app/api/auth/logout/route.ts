import { clearSessionCookie, jsonOk } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return jsonOk({ ok: true });
}
