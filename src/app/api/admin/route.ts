import { canAdmin } from "@/constants/admin";
import { jsonError, jsonOk, readJson, requireAdmin } from "@/server/http";
import { withStore } from "@/server/persist";
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
  toggleAdminSlot,
} from "@/services/adminService";
import { readAdminConfig } from "@/lib/admin-config";
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
    const config = await withStore(() => readAdminConfig());
    return jsonOk({ config, kind: session.kind });
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
      if (action === "addHoliday") {
        if (!canAdmin(session, "holidays")) deny("holidays");
        await addAdminHoliday(session, { date: body.date ?? "", label: body.label ?? "" });
      } else if (action === "removeHoliday") {
        if (!canAdmin(session, "holidays")) deny("holidays");
        await removeAdminHoliday(session, body.date ?? "");
      } else if (action === "toggleSlot") {
        if (!canAdmin(session, "slots")) deny("slots");
        await toggleAdminSlot(session, body.officeId ?? "", body.time ?? "");
      } else if (action === "saveSla") {
        if (!canAdmin(session, "sla")) deny("sla");
        await saveAdminSla(session, {
          reviewHours: Number(body.reviewHours),
          departmentHours: body.departmentHours,
        });
      } else if (action === "addOffice") {
        if (!canAdmin(session, "offices")) deny("offices");
        await addAdminOffice(session, {
          name: body.name ?? "",
          district: body.district ?? "",
          address: body.address ?? "",
          hours: body.hours ?? "",
          phone: body.phone ?? "",
          email: body.email ?? "",
        });
      } else if (action === "addOfficial") {
        if (!canAdmin(session, "officials")) deny("officials");
        await addAdminOfficial(session, {
          name: body.name ?? "",
          designation: body.designation ?? "",
          staffId: body.staffId ?? "",
          officeId: body.officeId ?? "",
          departmentId: body.departmentId ?? "",
        });
      } else if (action === "addCategory") {
        if (!canAdmin(session, "categories")) deny("categories");
        await addAdminCategoryForDepartment(session, body.departmentId ?? "", body.category ?? "");
      } else if (action === "acknowledgeEscalation") {
        if (!canAdmin(session, "escalation")) deny("escalation");
        await acknowledgeEscalation(session, body.id ?? "");
      } else if (action === "raiseEscalation") {
        if (!canAdmin(session, "escalation")) deny("escalation");
        await raiseEscalation(session, body.appointmentId ?? "", body.note ?? "");
      } else if (action === "saveSettings") {
        if (!canAdmin(session, "settings")) deny("settings");
        await saveAdminSettings(session, {
          name: body.name ?? session.name,
          helpdeskEmail: body.helpdeskEmail ?? "",
          reviewHours: Number(body.reviewHours),
        });
      } else {
        throw new Error("This administrator action is not supported.");
      }
      return readAdminConfig();
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
