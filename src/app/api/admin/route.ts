import { canAdmin } from "@/constants/admin";
import { jsonError, jsonOk, readJson, requireAdmin } from "@/server/http";
import { withStore } from "@/server/persist";
import { assertLiveSession } from "@/server/accounts";
import { isAdminSession } from "@/lib/session";
import {
  acknowledgeEscalation,
  addAdminCategoryForDepartment,
  addAdminHoliday,
  addAdminOffice,
  addAdminOfficial,
  raiseEscalation,
  removeAdminHoliday,
  saveAdminSettings,
  saveAdminSla,
  scopedAdminConfig,
  toggleAdminSlot,
} from "@/services/adminService";
import type { AdminPermission } from "@/types";

export const dynamic = "force-dynamic";

type AdminBody = {
  action?: string;
  date?: string;
  label?: string;
  officeId?: string;
  time?: string;
  reviewHours?: number;
  departmentHours?: number;
  name?: string;
  district?: string;
  address?: string;
  hours?: string;
  phone?: string;
  email?: string;
  designation?: string;
  staffId?: string;
  departmentId?: string;
  category?: string;
  id?: string;
  appointmentId?: string;
  note?: string;
  helpdeskEmail?: string;
};

function deny(permission: AdminPermission) {
  throw new Error(`This administrator cannot manage ${permission}.`);
}

export async function GET() {
  try {
    const session = await requireAdmin();
    const payload = await withStore(() => {
      const live = assertLiveSession(session);
      if (!isAdminSession(live)) throw new Error("This action is limited to administrators.");
      return { config: scopedAdminConfig(live), kind: live.kind };
    }, { write: false });
    return jsonOk(payload);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Sign in to continue.", 401);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await readJson<AdminBody>(request);
    const action = body.action ?? "";
    const config = await withStore(async () => {
      const live = assertLiveSession(session);
      if (!isAdminSession(live)) throw new Error("This action is limited to administrators.");
      if (action === "addHoliday") {
        if (!canAdmin(live, "holidays")) deny("holidays");
        await addAdminHoliday(live, { date: body.date ?? "", label: body.label ?? "" });
      } else if (action === "removeHoliday") {
        if (!canAdmin(live, "holidays")) deny("holidays");
        await removeAdminHoliday(live, body.date ?? "");
      } else if (action === "toggleSlot") {
        if (!canAdmin(live, "slots")) deny("slots");
        await toggleAdminSlot(live, body.officeId ?? "", body.time ?? "");
      } else if (action === "saveSla") {
        if (!canAdmin(live, "sla")) deny("sla");
        await saveAdminSla(live, {
          reviewHours: Number(body.reviewHours),
          departmentHours: body.departmentHours,
        });
      } else if (action === "addOffice") {
        if (!canAdmin(live, "offices")) deny("offices");
        await addAdminOffice(live, {
          name: body.name ?? "",
          district: body.district ?? "",
          address: body.address ?? "",
          hours: body.hours ?? "",
          phone: body.phone ?? "",
          email: body.email ?? "",
        });
      } else if (action === "addOfficial") {
        if (!canAdmin(live, "officials")) deny("officials");
        await addAdminOfficial(live, {
          name: body.name ?? "",
          designation: body.designation ?? "",
          staffId: body.staffId ?? "",
          officeId: body.officeId ?? "",
          departmentId: body.departmentId ?? "",
        });
      } else if (action === "addCategory") {
        if (!canAdmin(live, "categories")) deny("categories");
        await addAdminCategoryForDepartment(live, body.departmentId ?? "", body.category ?? "");
      } else if (action === "acknowledgeEscalation") {
        if (!canAdmin(live, "escalation")) deny("escalation");
        await acknowledgeEscalation(live, body.id ?? "");
      } else if (action === "raiseEscalation") {
        if (!canAdmin(live, "escalation")) deny("escalation");
        await raiseEscalation(live, body.appointmentId ?? "", body.note ?? "");
      } else if (action === "saveSettings") {
        if (!canAdmin(live, "settings")) deny("settings");
        await saveAdminSettings(live, {
          name: body.name ?? live.name,
          helpdeskEmail: body.helpdeskEmail ?? "",
          reviewHours: Number(body.reviewHours),
        });
      } else {
        throw new Error("This administrator action is not supported.");
      }
      return scopedAdminConfig(live);
    });
    return jsonOk({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save administrator changes.";
    const status = message.toLowerCase().includes("sign in")
      ? 401
      : message.toLowerCase().includes("cannot manage")
        ? 403
        : 400;
    return jsonError(message, status);
  }
}
