import { jsonError, jsonOk, readJson, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import { registerCitizen } from "@/services/authService";

export const dynamic = "force-dynamic";

type RegisterBody = {
  name?: string;
  mobile?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<RegisterBody>(request);
    const session = await withStore(() =>
      registerCitizen({
        name: body.name ?? "",
        mobile: body.mobile ?? "",
        email: body.email,
      }),
    );
    await setSessionCookie(session);
    return jsonOk({ session });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Registration failed.");
  }
}
