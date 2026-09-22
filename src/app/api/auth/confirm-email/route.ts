import { jsonError, jsonOk, readJson, setSessionCookie } from "@/server/http";
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
    return jsonError(
      error instanceof Error ? error.message : "This confirmation link is invalid or has expired.",
    );
  }
}
