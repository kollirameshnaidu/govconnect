import { isInfrastructureError, jsonError, jsonOk, readJson, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import { confirmCitizenEmail } from "@/server/auth-actions";

export const dynamic = "force-dynamic";

type Body = {
  token?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<Body>(request);
    const session = await withStore(() => confirmCitizenEmail(body.token ?? ""));
    await setSessionCookie(session);
    return jsonOk({ session });
  } catch (error) {
    if (isInfrastructureError(error)) {
      console.error("[auth] confirm-email failed", error instanceof Error ? error.message : error);
      return jsonError("Could not complete confirmation right now. Try signing in.", 503);
    }
    return jsonError(
      error instanceof Error ? error.message : "This confirmation link is invalid or has expired.",
    );
  }
}
