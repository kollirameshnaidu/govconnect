import { ADMIN_STAFF } from "@/mock/admin";
import { ADMIN_AUDIT_SEED, ADMIN_ESCALATION_SEED, ADMIN_WATCH_APPOINTMENTS } from "@/mock/admin-portal";
import { FRONT_DESK_STAFF } from "@/mock/front-desk";
import { DEPARTMENTS, OFFICES } from "@/mock/homepage";
import { OFFICIALS } from "@/mock/officials";
import { api } from "@/constants/api";
import { apiRequest, isBrowser } from "@/lib/api-client";
import { adminActor, mergeAdminOverlay, readAdminConfig, withAdminAudit, type AdminConfig } from "@/lib/admin-config";
import { HOLIDAYS_2026, OFFICE_SLOT_TIMES } from "@/lib/dates";
import { listAllAppointments } from "@/services/appointmentService";
import { getOfficeById } from "@/services/officeService";
import type {
  AdminSession,
  AdminStaff,
  AppointmentSlot,
  Department,
  EscalationRecord,
  GovernmentOffice,
  NotifiedHoliday,
  Official,
  TrackedAppointment,
} from "@/types";

function wait(ms = 280) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mutateAdminConfig(body: Record<string, unknown>) {
  const data = await apiRequest<{ config: AdminConfig }>(api.admin, {
    method: "POST",
    body: JSON.stringify(body),
  });
  mergeAdminOverlay(data.config);
  return data.config;
}

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAdminStaffByStaffId(staffId: string): AdminStaff | undefined {
  const key = staffId.trim().toUpperCase();
  return ADMIN_STAFF.find((item) => item.staffId === key);
}

export function getAdminStaffById(id: string): AdminStaff | undefined {
  return ADMIN_STAFF.find((item) => item.id === id);
}

export function officeInAdminScope(office: GovernmentOffice, admin: AdminSession) {
  if (admin.kind === "super") return true;
  if (admin.kind === "district") return office.district === admin.district;
  if (admin.kind === "department") {
    return Boolean(admin.departmentId && office.departmentIds.includes(admin.departmentId));
  }
  return false;
}

export function appointmentInAdminScope(appointment: TrackedAppointment, admin: AdminSession) {
  if (admin.kind === "super") return true;
  if (admin.kind === "department") return appointment.departmentId === admin.departmentId;
  if (admin.kind === "district") {
    const office = listOfficesForAdmin(admin).find((item) => item.id === appointment.officeId);
    return Boolean(office);
  }
  return false;
}

export function listOfficesForAdmin(admin: AdminSession): GovernmentOffice[] {
  const extra = readAdminConfig().offices;
  const extraIds = new Set(extra.map((item) => item.id));
  return [...extra, ...OFFICES.filter((item) => !extraIds.has(item.id))].filter((item) =>
    officeInAdminScope(item, admin),
  );
}

export function listDepartmentsForAdmin(admin: AdminSession): Department[] {
  const config = readAdminConfig();
  const extra = config.departments;
  const extraIds = new Set(extra.map((item) => item.id));
  const merged = [...extra, ...DEPARTMENTS.filter((item) => !extraIds.has(item.id))].map(
    (department) => {
      const added = config.categories
        .filter((item) => item.departmentId === department.id)
        .map((item) => item.name);
      const categories = [...department.categories];
      for (const name of added) {
        if (!categories.includes(name)) categories.push(name);
      }
      return { ...department, categories };
    },
  );
  if (admin.kind === "department") {
    return merged.filter((item) => item.id === admin.departmentId);
  }
  return merged;
}

export function listOfficialsForAdmin(admin: AdminSession): Official[] {
  const extra = readAdminConfig().officials;
  const extraIds = new Set(extra.map((item) => item.id));
  const merged = [...extra, ...OFFICIALS.filter((item) => !extraIds.has(item.id))];
  const offices = listOfficesForAdmin(admin);
  const officeIds = new Set(offices.map((item) => item.id));
  return merged.filter((item) => {
    if (!officeIds.has(item.officeId)) return false;
    if (admin.kind === "department") return item.departmentId === admin.departmentId;
    return true;
  });
}

export function listAdminAppointments(
  admin: AdminSession,
  created: TrackedAppointment[] = [],
): TrackedAppointment[] {
  const live = listAllAppointments(Array.isArray(created) ? created : []);
  const liveIds = new Set(live.map((item) => item.id));
  const watch = ADMIN_WATCH_APPOINTMENTS.filter((item) => !liveIds.has(item.id));
  return [...live, ...watch].filter((item) => appointmentInAdminScope(item, admin));
}

export function listNotifiedHolidays(): NotifiedHoliday[] {
  const extra = readAdminConfig().holidays;
  const seed: NotifiedHoliday[] = HOLIDAYS_2026.map((item) => ({
    date: item.date,
    label: item.label,
    scope: "national",
  }));
  const dates = new Set(extra.map((item) => item.date));
  return [...extra, ...seed.filter((item) => !dates.has(item.date))].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

export function listSlotBoard(admin: AdminSession): AppointmentSlot[] {
  const disabled = new Set(readAdminConfig().disabledSlots);
  const offices = listOfficesForAdmin(admin);
  return offices.flatMap((office) =>
    OFFICE_SLOT_TIMES.map((time) => ({
      officeId: office.id,
      time,
      enabled: !disabled.has(`${office.id}:${time}`) && !disabled.has(time),
    })),
  );
}

export function listAvailableSlotTimes(officeId?: string): string[] {
  const disabled = new Set(readAdminConfig().disabledSlots);
  return OFFICE_SLOT_TIMES.filter(
    (time) => !disabled.has(time) && (!officeId || !disabled.has(`${officeId}:${time}`)),
  );
}

export type AdminUserRow = {
  id: string;
  name: string;
  designation: string;
  staffId: string;
  portal: string;
  scope: string;
};

export function listAuditLogs() {
  const extra = readAdminConfig().audit;
  const extraIds = new Set(extra.map((item) => item.id));
  return [...extra, ...ADMIN_AUDIT_SEED.filter((item) => !extraIds.has(item.id))];
}

export function listEscalationRecords(admin: AdminSession, appointments: TrackedAppointment[]) {
  const extra = readAdminConfig().escalations;
  const extraIds = new Set(extra.map((item) => item.id));
  const merged = [
    ...extra,
    ...ADMIN_ESCALATION_SEED.filter((item) => !extraIds.has(item.id)),
  ];
  const ids = new Set(appointments.map((item) => item.id));
  return merged.filter((item) => ids.has(item.appointmentId));
}

export function reviewHoursForAdmin(admin: AdminSession) {
  const config = readAdminConfig();
  if (admin.kind === "department" && admin.departmentId && config.departmentHours[admin.departmentId]) {
    return config.departmentHours[admin.departmentId];
  }
  return config.reviewHours;
}

export function listUsersForAdmin(admin: AdminSession): AdminUserRow[] {
  const officials = listOfficialsForAdmin(admin).map((item) => ({
    id: item.id,
    name: item.name,
    designation: item.designation,
    staffId: item.staffId,
    portal: "Official",
    scope: `${item.officeId} · ${item.departmentId}`,
  }));
  const offices = new Set(listOfficesForAdmin(admin).map((item) => item.id));
  const desk = FRONT_DESK_STAFF.filter((item) => offices.has(item.officeId)).map((item) => ({
    id: item.id,
    name: item.name,
    designation: item.designation,
    staffId: item.staffId,
    portal: "Front desk",
    scope: item.officeId,
  }));
  const admins =
    admin.kind === "super"
      ? ADMIN_STAFF.map((item) => ({
          id: item.id,
          name: item.name,
          designation: item.designation,
          staffId: item.staffId,
          portal: "Admin",
          scope: item.kind,
        }))
      : [];
  return [...admins, ...officials, ...desk];
}

export async function addAdminHoliday(session: AdminSession, input: { date: string; label: string }) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "addHoliday", ...input });
    return;
  }
  await wait();
  const date = input.date.trim();
  const label = input.label.trim();
  if (!date || !label) throw new Error("Enter the holiday date and name.");
  const current = readAdminConfig();
  if (listNotifiedHolidays().some((item) => item.date === date)) {
    throw new Error("That date is already a notified holiday.");
  }
  const holiday: NotifiedHoliday = {
    date,
    label,
    scope: session.kind === "district" ? "district" : "national",
    district: session.district,
  };
  withAdminAudit(session, "Added holiday", `${label} on ${date}. Confirmed slots cannot use this date.`, {
    holidays: [holiday, ...current.holidays],
  });
}

export async function removeAdminHoliday(session: AdminSession, date: string) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "removeHoliday", date });
    return;
  }
  await wait();
  if (HOLIDAYS_2026.some((item) => item.date === date)) {
    throw new Error("Seeded national holidays stay published in this demo.");
  }
  const current = readAdminConfig();
  withAdminAudit(session, "Removed holiday", `Removed overlay holiday ${date}.`, {
    holidays: current.holidays.filter((item) => item.date !== date),
  });
}

export async function toggleAdminSlot(
  session: AdminSession,
  officeId: string,
  time: string,
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "toggleSlot", officeId, time });
    return;
  }
  await wait();
  const office = getOfficeById(officeId);
  if (!office || !officeInAdminScope(office, session)) {
    throw new Error("This office is outside your administration scope.");
  }
  const key = `${officeId}:${time}`;
  const current = readAdminConfig();
  const disabled = current.disabledSlots.includes(key)
    ? current.disabledSlots.filter((item) => item !== key)
    : [...current.disabledSlots, key];
  withAdminAudit(
    session,
    "Updated slot template",
    `${disabled.includes(key) ? "Disabled" : "Enabled"} ${time} at ${officeId}. This does not confirm a citizen preferred date.`,
    { disabledSlots: disabled },
  );
}

export async function saveAdminSla(
  session: AdminSession,
  input: { reviewHours: number; departmentHours?: number },
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "saveSla", ...input });
    return;
  }
  await wait();
  if (input.reviewHours < 8 || input.reviewHours > 120) {
    throw new Error("Review SLA must be between 8 and 120 hours.");
  }
  const current = readAdminConfig();
  const departmentHours = { ...current.departmentHours };
  if (session.kind === "department" && session.departmentId && input.departmentHours) {
    departmentHours[session.departmentId] = input.departmentHours;
  }
  withAdminAudit(
    session,
    "Updated SLA",
    `Review SLA set to ${input.reviewHours} hours. Preferred date remains a request, not a slot.`,
    {
      reviewHours: session.kind === "super" ? input.reviewHours : current.reviewHours,
      departmentHours,
    },
  );
}

export async function addAdminOffice(
  session: AdminSession,
  input: { name: string; district: string; address: string; hours: string; phone: string; email: string },
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "addOffice", ...input });
    return;
  }
  await wait();
  const name = input.name.trim();
  if (name.length < 4) throw new Error("Enter the office name.");
  const id = slug(name) || `office-${Date.now()}`;
  const office: GovernmentOffice = {
    id,
    name,
    district: input.district.trim() || session.district || "Central district",
    address: input.address.trim() || "Address to be notified",
    hours: input.hours.trim() || "9:00 AM – 5:00 PM",
    phone: input.phone.trim() || "011-0000-0000",
    email: input.email.trim() || `${id}@govconnect.gov.in`,
    departmentIds: session.departmentId ? [session.departmentId] : ["revenue"],
  };
  if (session.kind === "district" && session.district) {
    office.district = session.district;
  }
  if (!officeInAdminScope(office, session)) {
    throw new Error("This office is outside your administration scope.");
  }
  const current = readAdminConfig();
  withAdminAudit(session, "Added office", `${office.name} (${office.district}).`, {
    offices: [office, ...current.offices],
  });
}

export async function addAdminOfficial(
  session: AdminSession,
  input: { name: string; designation: string; staffId: string; officeId: string; departmentId: string },
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "addOfficial", ...input });
    return;
  }
  await wait();
  const name = input.name.trim();
  const staffId = input.staffId.trim().toUpperCase();
  if (name.length < 3) throw new Error("Enter the official’s name.");
  if (staffId.length < 6) throw new Error("Enter a staff ID.");
  const current = readAdminConfig();
  const office = getOfficeById(input.officeId) ?? current.offices.find((item) => item.id === input.officeId);
  if (!office || !officeInAdminScope(office, session)) {
    throw new Error("This office is outside your administration scope.");
  }
  const departmentId =
    session.kind === "department" && session.departmentId ? session.departmentId : input.departmentId;
  if (session.kind === "department" && departmentId !== session.departmentId) {
    throw new Error("This department is outside your administration scope.");
  }
  const exists = [...OFFICIALS, ...current.officials].some((item) => item.staffId === staffId);
  if (exists) throw new Error("That staff ID is already issued.");
  const official: Official = {
    id: slug(`${name}-${staffId}`),
    name,
    designation: input.designation.trim() || "Officer",
    officeId: input.officeId,
    departmentId,
    staffId,
  };
  withAdminAudit(session, "Added official", `${official.name} (${official.staffId}).`, {
    officials: [official, ...current.officials],
  });
  const { hashPassword } = await import("@/server/password");
  const { provisionStaffAccount } = await import("@/server/accounts");
  const seededPassword = process.env.DEMO_AUTH_PASSWORD?.trim();
  if (!seededPassword) throw new Error("DEMO_AUTH_PASSWORD is not configured.");
  provisionStaffAccount({
    id: official.id,
    role: "official",
    name: official.name,
    staffId: official.staffId,
    designation: official.designation,
    officeId: official.officeId,
    departmentId: official.departmentId,
    passwordHash: await hashPassword(seededPassword),
  });
}

export async function addAdminCategoryForDepartment(
  session: AdminSession,
  departmentId: string,
  name: string,
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "addCategory", departmentId, category: name });
    return;
  }
  await wait();
  const label = name.trim();
  if (label.length < 3) throw new Error("Enter a category name.");
  const dept =
    session.kind === "department" && session.departmentId ? session.departmentId : departmentId;
  const current = readAdminConfig();
  withAdminAudit(session, "Added category", `${label} on department ${dept}.`, {
    categories: [{ departmentId: dept, name: label }, ...current.categories],
  });
}

export async function acknowledgeEscalation(session: AdminSession, id: string) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "acknowledgeEscalation", id });
    return;
  }
  await wait();
  const current = readAdminConfig();
  const seed = ADMIN_ESCALATION_SEED.filter(
    (item) => !current.escalations.some((entry) => entry.id === item.id),
  );
  const merged = [...current.escalations, ...seed];
  const next = merged.map((item) =>
    item.id === id ? { ...item, status: "acknowledged" as const } : item,
  );
  withAdminAudit(session, "Acknowledged escalation", `Escalation ${id} marked acknowledged.`, {
    escalations: next,
  });
}

export async function raiseEscalation(session: AdminSession, appointmentId: string, note: string) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "raiseEscalation", appointmentId, note });
    return;
  }
  await wait();
  const appointment = listAllAppointments().find((item) => item.id === appointmentId);
  if (!appointment || !appointmentInAdminScope(appointment, session)) {
    throw new Error("This appointment is outside your administration scope.");
  }
  const current = readAdminConfig();
  const record: EscalationRecord = {
    id: `esc-${Date.now()}`,
    appointmentId,
    at: new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
    actor: `${session.name}, ${session.designation}`,
    note: note.trim() || "Escalated for SLA follow-up. Appointment ID unchanged.",
    status: "open",
  };
  withAdminAudit(session, "Raised escalation", `${appointmentId}: ${record.note}`, {
    escalations: [record, ...current.escalations],
  });
}

export async function saveAdminSettings(
  session: AdminSession,
  input: { name: string; helpdeskEmail: string; reviewHours: number },
) {
  if (isBrowser()) {
    await mutateAdminConfig({ action: "saveSettings", ...input });
    return;
  }
  await wait();
  if (input.name.trim().length < 3) throw new Error("Enter the display name.");
  if (input.reviewHours < 8 || input.reviewHours > 120) {
    throw new Error("Review SLA must be between 8 and 120 hours.");
  }
  withAdminAudit(
    session,
    "Updated settings",
    `Helpdesk ${input.helpdeskEmail}. Review SLA ${input.reviewHours} hours. Display name is session-only.`,
    {
      helpdeskEmail: input.helpdeskEmail.trim() || "support@govconnect.gov.in",
      reviewHours: input.reviewHours,
    },
  );
}

export function scopedAdminConfig(admin: AdminSession): AdminConfig {
  const full = readAdminConfig();
  if (admin.kind === "super") return full;
  const offices = listOfficesForAdmin(admin);
  const officeIds = new Set(offices.map((item) => item.id));
  const officials = listOfficialsForAdmin(admin);
  const departments = listDepartmentsForAdmin(admin);
  const departmentIds = new Set(departments.map((item) => item.id));
  const scopedAppointments = new Set(listAdminAppointments(admin).map((item) => item.id));
  const departmentHours =
    admin.kind === "department" && admin.departmentId
      ? { [admin.departmentId]: full.departmentHours[admin.departmentId] ?? full.reviewHours }
      : full.departmentHours;
  return {
    ...full,
    offices: full.offices.filter((item) => officeIds.has(item.id)),
    officials: full.officials.filter((item) => officials.some((official) => official.id === item.id)),
    departments: full.departments.filter((item) => departmentIds.has(item.id)),
    categories: full.categories.filter((item) => departmentIds.has(item.departmentId)),
    disabledSlots: full.disabledSlots.filter((item) => officeIds.has(item.split(":")[0] ?? "")),
    departmentHours,
    escalations: full.escalations.filter((item) => scopedAppointments.has(item.appointmentId)),
    audit: full.audit.filter((item) => item.actor === adminActor(admin)),
  };
}
