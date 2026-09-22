import { jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { clientKey, enforceRateLimit } from "@/server/rate-limit";
import { resetPasswordWithToken } from "@/server/auth-actions";

export const dynamic = "force-dynamic";

type Body = {
  token?: string;
  password?: string;
  confirmPassword?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<Body>(request);
    enforceRateLimit(`reset:${clientKey(request)}`);
    await withStore(() =>
      resetPasswordWithToken(body.token ?? "", body.password ?? "", body.confirmPassword ?? ""),
    );
    return jsonOk({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not reset the password.";
    const status = message.toLowerCase().includes("too many")
      ? 429
      : message.toLowerCase().includes("expired") || message.toLowerCase().includes("invalid")
        ? 400
        : 400;
    return jsonError(message, status);
  }
}
