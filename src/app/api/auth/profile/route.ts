import { isInfrastructureError, jsonError, jsonOk, readJson, requireSession, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";
import { updateCitizenAccount, updateStaffAccount } from "@/server/auth-actions";
import { sendRegistrationConfirmEmail } from "@/server/mail";
import { isCitizenSession } from "@/lib/session";
import type { AppSession } from "@/types";

export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await readJson<Body>(request);
    const result = await withStore(async (): Promise<{
      session: AppSession;
      confirm?: { email: string; name: string; token: string };
    }> => {
      const live = assertLiveSession(session);
      if (isCitizenSession(live)) {
        return updateCitizenAccount(live, {
          name: body.name ?? "",
          email: body.email ?? live.email ?? "",
        });
      }
      return { session: await updateStaffAccount(live, body.name ?? live.name) };
    });
    await setSessionCookie(result.session);
    if (result.confirm) {
      await sendRegistrationConfirmEmail(result.confirm.email, result.confirm.name, result.confirm.token);
      return jsonOk({
        session: result.session,
        message: "Confirm the new email address to keep using it for sign-in.",
      });
    }
    return jsonOk({ session: result.session, message: "Profile saved." });
  } catch (error) {
    if (isInfrastructureError(error)) {
      return jsonError("Could not save the profile right now. Try again later.", 503);
    }
    return jsonError(error instanceof Error ? error.message : "Could not save the profile.");
  }
}
