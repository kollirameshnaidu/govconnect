import { isInfrastructureError, jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { clientKey, enforceRateLimit } from "@/server/rate-limit";
import { registerCitizenAccount } from "@/server/auth-actions";
import { sendRegistrationConfirmEmail } from "@/server/mail";

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
    const { confirm } = await withStore(() =>
      registerCitizenAccount({
        name: body.name ?? "",
        email: body.email ?? "",
        password: body.password ?? "",
        confirmPassword: body.confirmPassword,
        mobile: body.mobile,
      }),
    );
    await sendRegistrationConfirmEmail(confirm.email, confirm.name, confirm.token);
    return jsonOk({
      email: confirm.email,
      message: "Check your email and confirm your address to finish registration.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    if (message.toLowerCase().includes("too many")) return jsonError(message, 429);
    if (isInfrastructureError(error)) {
      console.error("[auth] register failed", message);
      const mailFailed =
        message.toLowerCase().includes("email") || message.toLowerCase().includes("could not send");
      return jsonError(
        mailFailed
          ? "Could not send the confirmation email. Try again later."
          : "Could not create this account right now. Try again later.",
        503,
      );
    }
    return jsonError(message, 400);
  }
}
