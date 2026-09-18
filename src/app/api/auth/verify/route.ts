import { jsonError, jsonOk, readJson, setSessionCookie } from "@/server/http";
import { withStore } from "@/server/persist";
import {
  verifyAdminOtp,
  verifyCitizenOtp,
  verifyFrontDeskOtp,
  verifyOfficialOtp,
} from "@/services/authService";
import type { AppSession } from "@/types";

export const dynamic = "force-dynamic";

type VerifyBody = {
  role?: string;
  otp?: string;
  mobile?: string;
  staffId?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<VerifyBody>(request);
    const session = await withStore(async (): Promise<AppSession> => {
      if (body.role === "official") return verifyOfficialOtp(body.staffId ?? "", body.otp ?? "");
      if (body.role === "frontdesk") return verifyFrontDeskOtp(body.staffId ?? "", body.otp ?? "");
      if (body.role === "admin") return verifyAdminOtp(body.staffId ?? "", body.otp ?? "");
      return verifyCitizenOtp(body.mobile ?? "", body.otp ?? "");
    });
    await setSessionCookie(session);
    return jsonOk({ session });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Login failed.");
  }
}
