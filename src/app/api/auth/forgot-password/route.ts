import { GENERIC_RESET_SENT } from "@/lib/auth-rules";
import { jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { clientKey, enforceRateLimit } from "@/server/rate-limit";
import { issuePasswordReset } from "@/server/auth-actions";
import { sendPasswordResetEmail } from "@/server/mail";

export const dynamic = "force-dynamic";

type Body = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<Body>(request);
    enforceRateLimit(`forgot:${clientKey(request)}`);
    const pending = await withStore(() => issuePasswordReset(body.email ?? ""));
    if (pending) {
      await sendPasswordResetEmail(pending.email, pending.token);
      console.info("[auth] password reset email sent");
    }
    return jsonOk({ message: GENERIC_RESET_SENT });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send the reset email.";
    if (message.toLowerCase().includes("too many")) return jsonError(message, 429);
    console.error("[auth] forgot-password failed", message);
    return jsonError("Could not send the reset email. Try again later.", 503);
  }
}
