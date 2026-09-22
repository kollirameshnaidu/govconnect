import { isInfrastructureError, jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { clientKey, enforceRateLimit } from "@/server/rate-limit";
import { registerCitizenAccount } from "@/server/auth-actions";

export const dynamic = "force-dynamic";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<RegisterBody>(request);
    enforceRateLimit(`register:${clientKey(request)}`);
    const session = await withStore(() =>
      registerCitizenAccount({
        name: body.name ?? "",
        email: body.email ?? "",
        password: body.password ?? "",
        confirmPassword: body.confirmPassword,
        mobile: body.mobile,
      }),
    );
    return jsonOk({
      email: session.email,
      message: "Check your email and confirm your address to finish registration.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    if (message.toLowerCase().includes("too many")) return jsonError(message, 429);
    if (isInfrastructureError(error)) {
      console.error("[auth] register failed", message);
      return jsonError("Could not send the confirmation email. Try again later.", 503);
    }
    return jsonError(message, 400);
  }
}
