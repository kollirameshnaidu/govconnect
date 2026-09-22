import { jsonError, jsonOk, readJson, requireCitizen, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import { updateCitizenAccount } from "@/server/auth-actions";

export const dynamic = "force-dynamic";

type Body = {
  name?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const session = await requireCitizen();
    const body = await readJson<Body>(request);
    const next = await withStore(() =>
      updateCitizenAccount(session, { name: body.name ?? "", email: body.email ?? "" }),
    );
    await setSessionCookie(next);
    return jsonOk({ session: next });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save the profile.");
  }
}
