import { formatDateTimeLabel } from "@/lib/dates";
import { getRuntimeStore } from "@/lib/runtime-store";
import { jsonError, jsonOk, readJson, requireAdmin } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";
import type { Grievance } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireAdmin();
    const grievances = await withStore(() => {
      assertLiveSession(session);
      return getRuntimeStore().grievances;
    }, { write: false });
    return jsonOk({ grievances });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}

type GrievanceBody = {
  name?: string;
  mobile?: string;
  type?: string;
  details?: string;
};

export async function POST(request: Request) {
  try {
    const body = await readJson<GrievanceBody>(request);
    const grievance = await withStore(() => {
      const name = (body.name ?? "").trim();
      const mobile = (body.mobile ?? "").replace(/\D/g, "");
      const details = (body.details ?? "").trim();
      if (name.length < 3) throw new Error("Enter your full name.");
      if (!/^\d{10}$/.test(mobile)) throw new Error("Enter a 10-digit mobile number.");
      if (details.length < 20) throw new Error("Describe the issue in at least 20 characters.");
      const store = getRuntimeStore();
      const numbers = store.grievances.map((item) => {
        const match = item.id.match(/GRV-2026-(\d+)/);
        return match ? Number(match[1]) : 10020;
      });
      const next = Math.max(10020, ...numbers) + 1;
      const record: Grievance = {
        id: `GRV-2026-${next}`,
        name,
        mobile,
        type: body.type?.trim() || "other",
        details,
        submittedAt: formatDateTimeLabel(new Date()),
      };
      store.grievances = [record, ...store.grievances];
      return record;
    });
    return jsonOk({ grievance }, 201);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not submit the grievance.");
  }
}
