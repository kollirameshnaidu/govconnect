import { APPOINTMENT_STATUS_LABEL } from "@/constants/appointment-status";
import { getAppointmentHistory } from "@/lib/appointment-lifecycle";
import { listAdminAppointments } from "@/services/adminService";
import {
  listCitizenAppointments,
  listFrontDeskAppointments,
  listOfficialAppointments,
} from "@/services/appointmentService";
import type {
  AdminNotification,
  AdminSession,
  CitizenNotification,
  FrontDeskNotification,
  FrontDeskSession,
  OfficialNotification,
  OfficialSession,
  TrackedAppointment,
} from "@/types";

function latestEvents(appointments: TrackedAppointment[]) {
  return appointments
    .flatMap((appointment) =>
      getAppointmentHistory(appointment).map((event, index) => ({
        appointment,
        event,
        index,
      })),
    )
    .sort((a, b) => b.event.at.localeCompare(a.event.at))
    .slice(0, 20);
}

export function getNotificationsForCitizen(citizenId: string): CitizenNotification[] {
  return latestEvents(listCitizenAppointments(citizenId)).map(({ appointment, event, index }) => ({
    id: `${appointment.id}-${event.status}-${index}`,
    citizenId,
    title: APPOINTMENT_STATUS_LABEL[event.status],
    body: event.note || appointment.notes || APPOINTMENT_STATUS_LABEL[event.status],
    date: event.at,
    read: true,
    appointmentId: appointment.id,
  }));
}

export function getNotificationsForOfficial(official: OfficialSession | string): OfficialNotification[] {
  const session =
    typeof official === "string"
      ? ({ id: official, officeId: "", departmentId: "" } as OfficialSession)
      : official;
  return latestEvents(listOfficialAppointments(session)).map(({ appointment, event, index }) => ({
    id: `${appointment.id}-${event.status}-${index}`,
    officialId: session.id,
    title: APPOINTMENT_STATUS_LABEL[event.status],
    body: event.note || appointment.notes || APPOINTMENT_STATUS_LABEL[event.status],
    date: event.at,
    read: true,
    appointmentId: appointment.id,
  }));
}

export function getNotificationsForFrontDesk(staff: FrontDeskSession | string): FrontDeskNotification[] {
  const session =
    typeof staff === "string" ? ({ staffId: staff, officeId: "" } as FrontDeskSession) : staff;
  return latestEvents(listFrontDeskAppointments(session)).map(({ appointment, event, index }) => ({
    id: `${appointment.id}-${event.status}-${index}`,
    staffId: session.staffId,
    title: APPOINTMENT_STATUS_LABEL[event.status],
    body: event.note || appointment.notes || APPOINTMENT_STATUS_LABEL[event.status],
    date: event.at,
    read: true,
    appointmentId: appointment.id,
  }));
}

export function getNotificationsForAdmin(
  key: string | AdminSession | null | undefined,
): AdminNotification[] {
  if (!key || typeof key === "string" || !key.kind) return [];
  return latestEvents(listAdminAppointments(key)).map(({ appointment, event, index }) => ({
    id: `${appointment.id}-${event.status}-${index}`,
    staffId: key.staffId,
    title: APPOINTMENT_STATUS_LABEL[event.status],
    body: event.note || appointment.notes || APPOINTMENT_STATUS_LABEL[event.status],
    date: event.at,
    read: true,
    appointmentId: appointment.id,
  }));
}
