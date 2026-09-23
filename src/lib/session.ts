import {
  AUTH_EVENT,
  SESSION_COOKIE,
} from "@/constants/auth";
import { routes } from "@/constants/routes";
import type { AppSession, CitizenSession, FrontDeskSession, OfficialSession, AdminSession } from "@/types";

export function isCitizenSession(session: AppSession | null | undefined): session is CitizenSession {
  return session?.role === "citizen";
}

export function isOfficialSession(session: AppSession | null | undefined): session is OfficialSession {
  return session?.role === "official";
}

export function isFrontDeskSession(session: AppSession | null | undefined): session is FrontDeskSession {
  return session?.role === "frontdesk";
}

export function isAdminSession(session: AppSession | null | undefined): session is AdminSession {
  return session?.role === "admin";
}

export function parseSessionObject(value: unknown): AppSession | null {
  const session = value as AppSession;
  if (session?.role === "citizen" && session.id && /^\d{10}$/.test(session.mobile)) {
    return session;
  }
  if (
    session?.role === "official" &&
    session.id &&
    session.staffId &&
    session.officeId &&
    session.departmentId
  ) {
    return session;
  }
  if (session?.role === "frontdesk" && session.id && session.staffId && session.officeId) {
    return session;
  }
  if (
    session?.role === "admin" &&
    session.id &&
    session.staffId &&
    (session.kind === "super" || session.kind === "district" || session.kind === "department")
  ) {
    return session;
  }
  return null;
}

export function parseSession(_value?: string | null): AppSession | null {
  void _value;
  return null;
}

export function sessionsEqual(a: AppSession | null, b: AppSession | null) {
  if (a === b) return true;
  if (!a || !b || a.role !== b.role) return false;
  if (a.role === "citizen" && b.role === "citizen") {
    return (
      a.id === b.id &&
      a.name === b.name &&
      a.mobile === b.mobile &&
      (a.email ?? "") === (b.email ?? "") &&
      (a.v ?? 0) === (b.v ?? 0)
    );
  }
  if (a.role === "official" && b.role === "official") {
    return a.id === b.id && a.staffId === b.staffId && a.name === b.name && (a.v ?? 0) === (b.v ?? 0);
  }
  if (a.role === "frontdesk" && b.role === "frontdesk") {
    return a.id === b.id && a.staffId === b.staffId && a.name === b.name && (a.v ?? 0) === (b.v ?? 0);
  }
  if (a.role === "admin" && b.role === "admin") {
    return (
      a.id === b.id &&
      a.staffId === b.staffId &&
      a.name === b.name &&
      a.kind === b.kind &&
      (a.v ?? 0) === (b.v ?? 0)
    );
  }
  return false;
}

let cachedSession: AppSession | null = null;
let signedOut = false;

export function isBrowserSignedOut() {
  return signedOut;
}

export function readBrowserSession(): AppSession | null {
  if (signedOut) return null;
  return cachedSession;
}

export function writeBrowserSession(session: AppSession) {
  signedOut = false;
  cachedSession = session;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearBrowserSession() {
  signedOut = true;
  cachedSession = null;
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function postLoginPath(intent?: string | null, next?: string | null): string {
  if (next?.startsWith("/citizen")) return next;
  if (intent === "book") return routes.citizenBook;
  return routes.citizenDashboard;
}

export function postOfficialLoginPath(next?: string | null): string {
  if (next?.startsWith("/official") && !next.startsWith("/official/login")) return next;
  return routes.officialDashboard;
}

export function postFrontDeskLoginPath(next?: string | null): string {
  if (next?.startsWith("/front-desk") && !next.startsWith("/front-desk/login")) return next;
  return routes.frontDeskDashboard;
}

export function postAdminLoginPath(next?: string | null): string {
  if (next?.startsWith("/admin") && !next.startsWith("/admin/login")) return next;
  return routes.adminDashboard;
}

export function homeForSession(session: AppSession | null | undefined): string {
  if (isCitizenSession(session)) return routes.citizenDashboard;
  if (isOfficialSession(session)) return routes.officialDashboard;
  if (isFrontDeskSession(session)) return routes.frontDeskDashboard;
  if (isAdminSession(session)) return routes.adminDashboard;
  return routes.home;
}

export function maskMobile(mobile: string): string {
  return `XXXXXX${mobile.slice(-4)}`;
}
