import type { AppointmentStatus } from "@/constants/appointment-status";

export type Department = {
  id: string;
  name: string;
  summary: string;
  serviceCount: number;
  icon: string;
  categories: string[];
  officeIds: string[];
};

export type GovernmentOffice = {
  id: string;
  name: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  departmentIds: string[];
};

export type QuickService = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  departmentId: string;
  documents: string[];
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  body: string[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CharterItem = {
  id: string;
  title: string;
  detail: string;
};

export type JourneyStep = {
  id: string;
  title: string;
  description: string;
  status: AppointmentStatus;
};

export type HowItWorksStep = {
  id: string;
  step: string;
  title: string;
  description: string;
};

export type UserRole = "citizen" | "official" | "frontdesk" | "admin";
export type AdminKind = "super" | "district" | "department";
export type AdminPermission =
  | "offices"
  | "departments"
  | "categories"
  | "officials"
  | "users"
  | "roles"
  | "appointments"
  | "slots"
  | "holidays"
  | "sla"
  | "escalation"
  | "notifications"
  | "reports"
  | "audit"
  | "settings";

export type CitizenSession = {
  role: "citizen";
  id: string;
  name: string;
  mobile: string;
  email?: string;
};

export type OfficialSession = {
  role: "official";
  id: string;
  name: string;
  designation: string;
  officeId: string;
  departmentId: string;
  staffId: string;
};

export type FrontDeskSession = {
  role: "frontdesk";
  id: string;
  name: string;
  designation: string;
  officeId: string;
  staffId: string;
};

export type AdminSession = {
  role: "admin";
  id: string;
  name: string;
  designation: string;
  staffId: string;
  kind: AdminKind;
  departmentId?: string;
  district?: string;
};

export type AppSession = CitizenSession | OfficialSession | FrontDeskSession | AdminSession;

export type FrontDeskStaff = {
  id: string;
  name: string;
  designation: string;
  officeId: string;
  staffId: string;
};

export type AppointmentHistoryEvent = {
  status: AppointmentStatus;
  at: string;
  note: string;
  actor?: string;
};

export type AppointmentTransfer = {
  fromDepartment: string;
  fromCategory?: string;
  fromOfficial: string;
  toDepartment: string;
  toCategory?: string;
  toOfficial: string;
  reason: string;
  transferredBy: string;
  transferredAt: string;
};

export type TrackedAppointment = {
  id: string;
  officeName: string;
  departmentName: string;
  officialName: string;
  purpose: string;
  status: AppointmentStatus;
  preferredDate: string;
  confirmedAt: string | null;
  citizenId?: string;
  citizenName?: string;
  citizenMobile?: string;
  createdOn?: string;
  notes?: string;
  category?: string;
  documents?: string[];
  documentsToCarry?: string[];
  officeId?: string;
  departmentId?: string;
  officialId?: string;
  history?: AppointmentHistoryEvent[];
  transfer?: AppointmentTransfer;
  queuePosition?: number;
  actionTaken?: string;
  meetingNotes?: string;
};

export type Official = {
  id: string;
  name: string;
  designation: string;
  officeId: string;
  departmentId: string;
  staffId: string;
};

export type AppointmentDraft = {
  officeId: string;
  departmentId: string;
  category: string;
  officialId: string;
  purpose: string;
  documents: string[];
  preferredDate: string;
};

export type CitizenNotification = {
  id: string;
  citizenId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  appointmentId?: string;
};

export type OfficialNotification = {
  id: string;
  officialId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  appointmentId?: string;
};

export type FrontDeskNotification = {
  id: string;
  staffId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  appointmentId?: string;
};

export type AdminStaff = {
  id: string;
  name: string;
  designation: string;
  staffId: string;
  kind: AdminKind;
  departmentId?: string;
  district?: string;
};

export type AdminNotification = {
  id: string;
  staffId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  appointmentId?: string;
};

export type NotifiedHoliday = {
  date: string;
  label: string;
  scope: "national" | "district";
  district?: string;
};

export type AppointmentSlot = {
  officeId: string;
  time: string;
  enabled: boolean;
};

export type SlaPolicy = {
  reviewHours: number;
  departmentHours: Record<string, number>;
};

export type AuditLog = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export type EscalationRecord = {
  id: string;
  appointmentId: string;
  at: string;
  actor: string;
  note: string;
  status: "open" | "acknowledged";
};

export type TrustStat = {
  id: string;
  value: string;
  label: string;
};

export type Grievance = {
  id: string;
  name: string;
  mobile: string;
  type: string;
  details: string;
  submittedAt: string;
};
