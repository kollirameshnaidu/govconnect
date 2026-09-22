import { GENERIC_LOGIN_ERROR } from "@/lib/auth-rules";
import { isInfrastructureError, jsonError, jsonOk, readJson, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import { clientKey, enforceRateLimit } from "@/server/rate-limit";
import { loginWithPassword } from "@/server/auth-actions";
import type { UserRole } from "@/types";

export const dynamic = "force-dynamic";

type LoginBody = {
  role?: UserRole;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<LoginBody>(request);
    enforceRateLimit(`login:${clientKey(request)}:${(body.email ?? "").toLowerCase()}`);
    const session = await withStore(
      () => loginWithPassword(body.role ?? "citizen", body.email ?? "", body.password ?? ""),
      { write: false },
    );
    await setSessionCookie(session);
    return jsonOk({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    if (message.toLowerCase().includes("too many")) return jsonError(message, 429);
    if (isInfrastructureError(error)) {
      console.error("[auth] login failed", message);
      return jsonError("Could not sign in right now. Try again later.", 503);
    }
    const status = message === GENERIC_LOGIN_ERROR ? 401 : 400;
    return jsonError(message, status);
  }
}
