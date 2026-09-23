import { getRequestSession, jsonOk } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getRequestSession();
  if (!session) return jsonOk({ session: null });
  try {
    const live = await withStore(() => assertLiveSession(session), { write: false });
    return jsonOk({ session: live });
  } catch {
    return jsonOk({ session: null });
  }
}
