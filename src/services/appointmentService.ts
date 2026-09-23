import { AppointmentStatus } from "@/constants/appointment-status";
import { api } from "@/constants/api";
import { apiRequest, isBrowser } from "@/lib/api-client";
import { formatDateTimeLabel, formatDisplayDate, formatTimeLabel, preferredDateIssue, toIsoDate, workingDateIssue } from "@/lib/dates";
import {
  readCreatedAppointments,
  saveCreatedAppointment,
} from "@/lib/created-appointments";
import {
  canAccept,
  canCancelAppointment,
  canCheckIn,
  canCloseAppointment,
  canCompleteMeeting,
  canConfirmVisit,
  canMarkNoShow,
  canReject,
  canRequestReschedule,
  canSchedule,
  canSendToWaiting,
  canStartMeeting,
  canTakeUp,
  canTransfer,
} from "@/lib/appointment-lifecycle";
import { TRACKED_APPOINTMENTS } from "@/mock/homepage";
import { CITIZENS } from "@/mock/citizens";
import { getDepartmentById } from "@/services/departmentService";
import { getOfficeById } from "@/services/officeService";
import { getOfficialById } from "@/services/officialService";
import type {
  AppointmentDraft,
  CitizenSession,
  FrontDeskSession,
  Official,
  OfficialSession,
  TrackedAppointment,
} from "@/types";

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mutateViaApi(appointmentId: string, body: Record<string, unknown>) {
  const data = await apiRequest<{ appointment: TrackedAppointment }>(
    api.appointmentAction(appointmentId),
    { method: "POST", body: JSON.stringify(body) },
  );
  saveCreatedAppointment(data.appointment);
  return data.appointment;
}

export function listCitizenAppointments(
  citizenId: string,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  const extra = created.filter((item) => item.citizenId === citizenId);
  const extraIds = new Set(extra.map((item) => item.id));
  const seed = TRACKED_APPOINTMENTS.filter(
    (item) => item.citizenId === citizenId && !extraIds.has(item.id),
  );
  return [...extra, ...seed];
}

export function findCitizenAppointment(
  citizenId: string,
  appointmentId: string,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment | undefined {
  const id = appointmentId.trim().toUpperCase();
  return listCitizenAppointments(citizenId, created).find((item) => item.id === id);
}

export function getAppointmentsForCitizen(citizenId: string): TrackedAppointment[] {
  return listCitizenAppointments(citizenId);
}

export function getCitizenAppointment(
  citizenId: string,
  appointmentId: string,
): TrackedAppointment | undefined {
  return findCitizenAppointment(citizenId, appointmentId);
}

function appointmentById(
  appointmentId: string,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment | undefined {
  const id = appointmentId.trim().toUpperCase();
  return created.find((item) => item.id === id) ?? TRACKED_APPOINTMENTS.find((item) => item.id === id);
}

function matchesRegisteredMobile(appointment: TrackedAppointment, mobile: string) {
  if (appointment.citizenMobile) return appointment.citizenMobile === mobile;
  const known = CITIZENS.find((item) => item.id === appointment.citizenId);
  if (known) return known.mobile === mobile;
  return appointment.citizenId === `citizen-${mobile}`;
}

export async function trackAppointment(
  appointmentId: string,
  mobile: string,
): Promise<TrackedAppointment | null> {
  if (isBrowser()) {
    const data = await apiRequest<{ appointment: TrackedAppointment | null }>(api.track, {
      method: "POST",
      body: JSON.stringify({ appointmentId, mobile }),
    });
    return data.appointment;
  }
  await wait();
  const normalizedId = appointmentId.trim().toUpperCase();
  const normalizedMobile = mobile.replace(/\s+/g, "");
  if (!/^\d{10}$/.test(normalizedMobile)) return null;
  const appointment = appointmentById(normalizedId);
  if (!appointment) return null;
  return matchesRegisteredMobile(appointment, normalizedMobile) ? appointment : null;
}

function nextAppointmentId(existing: TrackedAppointment[]): string {
  const numbers = existing.map((item) => {
    const match = item.id.match(/GC-2026-(\d+)/);
    return match ? Number(match[1]) : 0;
  });
  const next = Math.max(300, ...numbers) + 1;
  return `GC-2026-${String(next).padStart(6, "0")}`;
}

export async function submitAppointmentRequest(
  citizen: CitizenSession,
  draft: AppointmentDraft,
): Promise<TrackedAppointment> {
  if (isBrowser()) {
    const data = await apiRequest<{ appointment: TrackedAppointment }>(api.appointments, {
      method: "POST",
      body: JSON.stringify({ draft }),
    });
    saveCreatedAppointment(data.appointment);
    return data.appointment;
  }
  await wait(500);
  const dateIssue = preferredDateIssue(draft.preferredDate);
  if (dateIssue) throw new Error(dateIssue);
  if (draft.purpose.trim().length < 20) {
    throw new Error("Describe the purpose of visit in at least 20 characters.");
  }
  const office = getOfficeById(draft.officeId);
  const department = getDepartmentById(draft.departmentId);
  const official = getOfficialById(draft.officialId);
  if (!office || !department || !official) {
    throw new Error("Select office, department, and official before submitting.");
  }
  const existing = [...readCreatedAppointments(), ...TRACKED_APPOINTMENTS];
  const submittedAt = formatDateTimeLabel(new Date());
  const appointment: TrackedAppointment = {
    id: nextAppointmentId(existing),
    officeName: office.name,
    departmentName: department.name,
    officialName: `${official.name}, ${official.designation}`,
    purpose: draft.purpose.trim(),
    status: AppointmentStatus.SUBMITTED,
    preferredDate: formatDisplayDate(draft.preferredDate),
    confirmedAt: null,
    citizenId: citizen.id,
    citizenName: citizen.name,
    citizenMobile: citizen.mobile,
    createdOn: formatDisplayDate(toIsoDate(new Date())),
    notes:
      "Request submitted. Preferred date is not a confirmed slot. An official will review within 48 hours.",
    category: draft.category,
    documents: draft.documents,
    officeId: office.id,
    departmentId: department.id,
    officialId: official.id,
    history: [
      {
        status: AppointmentStatus.SUBMITTED,
        at: submittedAt,
        note: `Request submitted with preferred date ${formatDisplayDate(draft.preferredDate)}. This is not a confirmed slot.`,
        actor: citizen.name,
      },
    ],
  };
  saveCreatedAppointment(appointment);
  return appointment;
}

export async function confirmCitizenVisit(
  citizen: CitizenSession,
  appointmentId: string,
): Promise<TrackedAppointment> {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "confirm" });
  await wait(400);
  const current = findCitizenAppointment(citizen.id, appointmentId);
  if (!current) {
    throw new Error("This appointment is not linked to the signed-in citizen profile.");
  }
  if (!canConfirmVisit(current.status)) {
    throw new Error("This appointment is not waiting for citizen confirmation.");
  }
  if (!current.confirmedAt) {
    throw new Error("An official has not assigned a date and time yet.");
  }
  const confirmed: TrackedAppointment = {
    ...current,
    status: AppointmentStatus.CONFIRMED,
    notes: `Visit confirmed for ${current.confirmedAt}. Carry the appointment letter or quote this ID at the front desk.`,
    history: [
      ...(current.history ?? []),
      {
        status: AppointmentStatus.CONFIRMED,
        at: formatDateTimeLabel(new Date()),
        note: `Citizen confirmed the assigned slot ${current.confirmedAt}. Letter and QR are now available.`,
        actor: citizen.name,
      },
    ],
  };
  saveCreatedAppointment(confirmed);
  return confirmed;
}

export async function cancelCitizenAppointment(
  citizen: CitizenSession,
  appointmentId: string,
  reason: string,
): Promise<TrackedAppointment> {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "cancel", reason });
  await wait(400);
  const current = findCitizenAppointment(citizen.id, appointmentId);
  if (!current) {
    throw new Error("This appointment is not linked to the signed-in citizen profile.");
  }
  if (!canCancelAppointment(current.status)) {
    throw new Error("This appointment can no longer be cancelled.");
  }
  const note = reason.trim()
    ? `Citizen cancelled the request. Reason: ${reason.trim()}. Appointment ID ${current.id} is unchanged.`
    : `Citizen cancelled the request. Appointment ID ${current.id} is unchanged.`;
  const cancelled: TrackedAppointment = {
    ...current,
    status: AppointmentStatus.CANCELLED,
    notes: note,
    history: [
      ...(current.history ?? []),
      {
        status: AppointmentStatus.CANCELLED,
        at: formatDateTimeLabel(new Date()),
        note,
        actor: citizen.name,
      },
    ],
  };
  saveCreatedAppointment(cancelled);
  return cancelled;
}

export async function requestCitizenReschedule(
  citizen: CitizenSession,
  appointmentId: string,
  reason: string,
): Promise<TrackedAppointment> {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "reschedule", reason });
  await wait(400);
  const detail = reason.trim();
  if (detail.length < 10) {
    throw new Error("Explain why a new slot is needed in at least 10 characters.");
  }
  const current = findCitizenAppointment(citizen.id, appointmentId);
  if (!current) {
    throw new Error("This appointment is not linked to the signed-in citizen profile.");
  }
  if (!canRequestReschedule(current.status)) {
    throw new Error("A reschedule can only be requested after a slot is assigned.");
  }
  const note = `Citizen requested a new confirmed slot. Reason: ${detail}. Appointment ID ${current.id} is unchanged. Preferred date is still not a reserved slot.`;
  const next: TrackedAppointment = {
    ...current,
    status: AppointmentStatus.RESCHEDULE_REQUESTED,
    notes: note,
    history: [
      ...(current.history ?? []),
      {
        status: AppointmentStatus.RESCHEDULE_REQUESTED,
        at: formatDateTimeLabel(new Date()),
        note,
        actor: citizen.name,
      },
    ],
  };
  saveCreatedAppointment(next);
  return next;
}

export function listAllAppointments(
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  const overlay = Array.isArray(created) ? created : [];
  const extraIds = new Set(overlay.map((item) => item.id));
  return [...overlay, ...TRACKED_APPOINTMENTS.filter((item) => !extraIds.has(item.id))];
}

export function belongsToOfficialDesk(appointment: TrackedAppointment, official: Official | OfficialSession) {
  if (appointment.officialId === official.id) return true;
  return (
    appointment.officeId === official.officeId && appointment.departmentId === official.departmentId
  );
}

export function listOfficialAppointments(
  official: Official | OfficialSession,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  return listAllAppointments(created).filter((item) => belongsToOfficialDesk(item, official));
}

export function findOfficialAppointment(
  official: Official | OfficialSession,
  appointmentId: string,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment | undefined {
  const id = appointmentId.trim().toUpperCase();
  return listOfficialAppointments(official, created).find((item) => item.id === id);
}

function actorName(official: OfficialSession) {
  return `${official.name}, ${official.designation}`;
}

function deskAppointment(official: OfficialSession, appointmentId: string) {
  const current = findOfficialAppointment(official, appointmentId);
  if (!current) {
    throw new Error("This request is not on your office desk.");
  }
  return current;
}

function withHistory(
  current: TrackedAppointment,
  official: OfficialSession,
  status: TrackedAppointment["status"],
  note: string,
  extra: Partial<TrackedAppointment> = {},
): TrackedAppointment {
  const next: TrackedAppointment = {
    ...current,
    ...extra,
    status,
    notes: note,
    history: [
      ...(current.history ?? []),
      {
        status,
        at: formatDateTimeLabel(new Date()),
        note,
        actor: actorName(official),
      },
    ],
  };
  saveCreatedAppointment(next);
  return next;
}

export async function takeUpOfficialRequest(official: OfficialSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "takeUp" });
  await wait(350);
  const current = deskAppointment(official, appointmentId);
  if (!canTakeUp(current.status)) {
    throw new Error("This request is not waiting to be taken up.");
  }
  return withHistory(
    current,
    official,
    "UNDER_REVIEW",
    "Official opened the request for review. Preferred date is still a request, not a confirmed slot.",
    { officialId: official.id, officialName: actorName(official) },
  );
}

export async function acceptOfficialRequest(official: OfficialSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "accept" });
  await wait(350);
  const current = deskAppointment(official, appointmentId);
  if (!canAccept(current.status)) {
    throw new Error("This request cannot be accepted in its current status.");
  }
  return withHistory(
    current,
    official,
    "ACCEPTED",
    "Request accepted. Assign a confirmed date and time. Do not treat the preferred date as a reserved slot.",
    { officialId: official.id, officialName: actorName(official) },
  );
}

export async function rejectOfficialRequest(
  official: OfficialSession,
  appointmentId: string,
  reason: string,
) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "reject", reason });
  await wait(350);
  const detail = reason.trim();
  if (detail.length < 10) {
    throw new Error("Enter a rejection reason of at least 10 characters.");
  }
  const current = deskAppointment(official, appointmentId);
  if (!canReject(current.status)) {
    throw new Error("This request cannot be rejected in its current status.");
  }
  return withHistory(
    current,
    official,
    "REJECTED",
    `Rejected: ${detail}. The appointment ID remains unchanged if transferred later.`,
  );
}

export async function scheduleOfficialAppointment(
  official: OfficialSession,
  appointmentId: string,
  input: { date: string; time: string; documentsToCarry: string },
) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "schedule", ...input });
  await wait(400);
  const dateIssue = workingDateIssue(input.date);
  if (dateIssue) throw new Error(dateIssue);
  if (!input.time) throw new Error("Select an appointment time.");
  const current = deskAppointment(official, appointmentId);
  if (!canSchedule(current.status)) {
    throw new Error("Accept the request before assigning a confirmed date and time.");
  }
  const slot = `${formatDisplayDate(input.date)}, ${formatTimeLabel(input.time)}`;
  const carry = input.documentsToCarry
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return withHistory(
    current,
    official,
    "SCHEDULED",
    `Assigned slot ${slot}. This is not the citizen’s preferred date unless they happen to match. Citizen confirmation is required.`,
    {
      confirmedAt: slot,
      documentsToCarry: carry.length ? carry : current.documentsToCarry,
      officialId: official.id,
      officialName: actorName(official),
    },
  );
}

export async function transferOfficialRequest(
  official: OfficialSession,
  appointmentId: string,
  input: { officialId: string; category?: string; reason: string },
) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "transfer", ...input });
  await wait(400);
  const reason = input.reason.trim();
  if (reason.length < 10) {
    throw new Error("Enter a transfer reason of at least 10 characters.");
  }
  const current = deskAppointment(official, appointmentId);
  if (!canTransfer(current.status)) {
    throw new Error("This request cannot be transferred in its current status.");
  }
  const target = getOfficialById(input.officialId);
  if (!target) throw new Error("Select the receiving official.");
  if (target.id === official.id) {
    throw new Error("Transfer to a different official.");
  }
  const office = getOfficeById(target.officeId);
  const currentOffice = current.officeId ? getOfficeById(current.officeId) : undefined;
  if (
    target.officeId !== current.officeId &&
    office?.district !== currentOffice?.district
  ) {
    throw new Error("Transfer within the same office or district.");
  }
  const department = getDepartmentById(target.departmentId);
  if (!office || !department) {
    throw new Error("The receiving desk is not configured.");
  }
  const transfer = {
    fromDepartment: current.departmentName,
    fromCategory: current.category,
    fromOfficial: current.officialName,
    toDepartment: department.name,
    toCategory: input.category || current.category,
    toOfficial: `${target.name}, ${target.designation}`,
    reason,
    transferredBy: actorName(official),
    transferredAt: formatDateTimeLabel(new Date()),
  };
  return withHistory(
    current,
    official,
    "TRANSFERRED",
    `Transferred to ${department.name} (${target.name}, ${target.designation}). Reason: ${reason}. Appointment ID ${current.id} is unchanged.`,
    {
      officeId: office.id,
      officeName: office.name,
      departmentId: department.id,
      departmentName: department.name,
      officialId: target.id,
      officialName: `${target.name}, ${target.designation}`,
      category: input.category || current.category,
      transfer,
    },
  );
}

export async function startOfficialMeeting(official: OfficialSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "startMeeting" });
  await wait(350);
  const current = deskAppointment(official, appointmentId);
  if (!canStartMeeting(current.status)) {
    throw new Error("The citizen visit is not ready for a meeting.");
  }
  const next = withHistory(
    current,
    official,
    "MEETING_IN_PROGRESS",
    "Meeting started. Record notes, then complete and close the case.",
    { queuePosition: undefined },
  );
  if (current.officeId) recomputeWaitingQueue(current.officeId);
  return next;
}

export async function addOfficialMeetingNotes(
  official: OfficialSession,
  appointmentId: string,
  notes: string,
) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "addNotes", notes });
  await wait(300);
  const detail = notes.trim();
  if (detail.length < 8) throw new Error("Enter meeting notes of at least 8 characters.");
  const current = deskAppointment(official, appointmentId);
  if (current.status !== "MEETING_IN_PROGRESS" && current.status !== "MEETING_COMPLETED") {
    throw new Error("Start the meeting before recording notes.");
  }
  const combined = current.meetingNotes ? `${current.meetingNotes}\n${detail}` : detail;
  return withHistory(
    current,
    official,
    current.status,
    `Meeting note recorded: ${detail}`,
    { meetingNotes: combined },
  );
}

export async function completeOfficialMeeting(official: OfficialSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "completeMeeting" });
  await wait(350);
  const current = deskAppointment(official, appointmentId);
  if (!canCompleteMeeting(current.status)) {
    throw new Error("The meeting is not in progress.");
  }
  return withHistory(
    current,
    official,
    "MEETING_COMPLETED",
    "Meeting completed. Record action taken and close the appointment.",
  );
}

export async function closeOfficialAppointment(
  official: OfficialSession,
  appointmentId: string,
  actionTaken: string,
) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "close", actionTaken });
  await wait(350);
  const detail = actionTaken.trim();
  if (detail.length < 10) {
    throw new Error("Enter action taken of at least 10 characters.");
  }
  const current = deskAppointment(official, appointmentId);
  if (!canCloseAppointment(current.status)) {
    throw new Error("Complete the meeting before closing the appointment.");
  }
  return withHistory(
    current,
    official,
    "CLOSED",
    `Closed. Action taken: ${detail}`,
    { actionTaken: detail },
  );
}

function frontDeskActor(staff: FrontDeskSession) {
  return `${staff.name}, ${staff.designation}`;
}

export function belongsToFrontDeskOffice(
  appointment: TrackedAppointment,
  staff: FrontDeskSession,
) {
  return appointment.officeId === staff.officeId;
}

export function listFrontDeskAppointments(
  staff: FrontDeskSession,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  return listAllAppointments(created).filter((item) => belongsToFrontDeskOffice(item, staff));
}

export function findFrontDeskAppointment(
  staff: FrontDeskSession,
  appointmentId: string,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment | undefined {
  const id = appointmentId.trim().toUpperCase();
  return listFrontDeskAppointments(staff, created).find((item) => item.id === id);
}

export function searchFrontDeskVisits(
  staff: FrontDeskSession,
  input: { appointmentId?: string; mobile?: string },
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  const id = input.appointmentId?.trim().toUpperCase() ?? "";
  const mobile = input.mobile?.replace(/\D/g, "") ?? "";
  const desk = listFrontDeskAppointments(staff, created);
  if (id) {
    return desk.filter((item) => item.id === id && (!mobile || matchesRegisteredMobile(item, mobile)));
  }
  if (/^\d{10}$/.test(mobile)) {
    return desk.filter((item) => matchesRegisteredMobile(item, mobile));
  }
  return [];
}

export function listFrontDeskQueue(
  staff: FrontDeskSession,
  created: TrackedAppointment[] = readCreatedAppointments(),
): TrackedAppointment[] {
  return listFrontDeskAppointments(staff, created)
    .filter((item) => item.status === AppointmentStatus.WAITING)
    .sort((a, b) => (a.queuePosition ?? 99) - (b.queuePosition ?? 99));
}

function officeVisit(staff: FrontDeskSession, appointmentId: string) {
  const current = findFrontDeskAppointment(staff, appointmentId);
  if (!current) {
    throw new Error("This appointment is not booked at your office.");
  }
  return current;
}

function withFrontDeskHistory(
  current: TrackedAppointment,
  staff: FrontDeskSession,
  status: TrackedAppointment["status"],
  note: string,
  extra: Partial<TrackedAppointment> = {},
): TrackedAppointment {
  const next: TrackedAppointment = {
    ...current,
    ...extra,
    status,
    notes: note,
    history: [
      ...(current.history ?? []),
      {
        status,
        at: formatDateTimeLabel(new Date()),
        note,
        actor: frontDeskActor(staff),
      },
    ],
  };
  saveCreatedAppointment(next);
  return next;
}

function recomputeWaitingQueue(officeId: string) {
  const waiting = listAllAppointments()
    .filter((item) => item.officeId === officeId && item.status === AppointmentStatus.WAITING)
    .sort((a, b) => (a.queuePosition ?? 99) - (b.queuePosition ?? 99));
  waiting.forEach((item, index) => {
    const position = index + 1;
    if (item.queuePosition !== position) {
      saveCreatedAppointment({ ...item, queuePosition: position });
    }
  });
}

export async function checkInFrontDeskVisit(staff: FrontDeskSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "checkIn" });
  await wait(350);
  const current = officeVisit(staff, appointmentId);
  if (!canCheckIn(current.status)) {
    throw new Error("Check-in is only for citizens who confirmed the assigned slot.");
  }
  return withFrontDeskHistory(
    current,
    staff,
    "CHECKED_IN",
    "Identity verified at the front desk. The citizen may be added to the waiting queue.",
    { queuePosition: undefined },
  );
}

export async function sendFrontDeskVisitToQueue(staff: FrontDeskSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "queue" });
  await wait(350);
  const current = officeVisit(staff, appointmentId);
  if (!canSendToWaiting(current.status)) {
    throw new Error("Check the visitor in before adding them to the waiting queue.");
  }
  const position = listFrontDeskQueue(staff).length + 1;
  const next = withFrontDeskHistory(
    current,
    staff,
    "WAITING",
    `Added to the waiting queue as number ${position}.`,
    { queuePosition: position },
  );
  recomputeWaitingQueue(staff.officeId);
  return findFrontDeskAppointment(staff, next.id) ?? next;
}

export async function callNextFrontDeskVisitor(staff: FrontDeskSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "call" });
  await wait(300);
  const current = officeVisit(staff, appointmentId);
  if (current.status !== AppointmentStatus.WAITING) {
    throw new Error("Only waiting visitors can be called.");
  }
  return withFrontDeskHistory(
    current,
    staff,
    AppointmentStatus.WAITING,
    "Called to the officer’s desk. Remain in the waiting area until the meeting starts.",
    { queuePosition: current.queuePosition },
  );
}

export async function markFrontDeskNoShow(staff: FrontDeskSession, appointmentId: string) {
  if (isBrowser()) return mutateViaApi(appointmentId, { action: "noShow" });
  await wait(350);
  const current = officeVisit(staff, appointmentId);
  if (!canMarkNoShow(current.status)) {
    throw new Error("This visit cannot be marked as no-show in its current status.");
  }
  const next = withFrontDeskHistory(
    current,
    staff,
    "NO_SHOW",
    "Marked as no-show. The citizen may submit a new request. The appointment ID is unchanged.",
    { queuePosition: undefined },
  );
  recomputeWaitingQueue(staff.officeId);
  return next;
}
