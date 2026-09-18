import { jsonError, jsonOk, readJson } from "@/server/http";
import { withStore } from "@/server/persist";
import { sendAdminOtp, sendCitizenOtp, sendFrontDeskOtp, sendOfficialOtp } from "@/services/authService";

export const dynamic = "force-dynamic";

type OtpBody = {
  role?: string;
  mobile?: string;
  staffId?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<OtpBody>(request);
    const otp = await withStore(async () => {
      if (body.role === "official") return sendOfficialOtp(body.staffId ?? "");
      if (body.role === "frontdesk") return sendFrontDeskOtp(body.staffId ?? "");
      if (body.role === "admin") return sendAdminOtp(body.staffId ?? "");
      return sendCitizenOtp(body.mobile ?? "");
    });
    return jsonOk({ otp });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not send OTP.");
  }
}
