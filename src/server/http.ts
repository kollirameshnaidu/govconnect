import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/constants/auth";
import {
  isAdminSession,
  isCitizenSession,
  isFrontDeskSession,
  isOfficialSession,
  parseSession,
} from "@/lib/session";
import type { AdminSession, AppSession, CitizenSession, FrontDeskSession, OfficialSession } from "@/types";

export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function errorResponse(error: unknown, fallback = "Request failed.") {
  const message = error instanceof Error && error.message ? error.message : fallback;
  const status = message.toLowerCase().includes("sign in") ? 401 : 400;
  return jsonError(message, status);
}

export async function getRequestSession(): Promise<AppSession | null> {
  const jar = await cookies();
  return parseSession(jar.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(session: AppSession) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(session), {
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    sameSite: "lax",
    httpOnly: false,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    httpOnly: false,
  });
}

export async function requireSession(): Promise<AppSession> {
  const session = await getRequestSession();
  if (!session) throw new Error("Sign in to continue.");
  return session;
}

export async function requireCitizen(): Promise<CitizenSession> {
  const session = await requireSession();
  if (!isCitizenSession(session)) throw new Error("This action is limited to the signed-in citizen.");
  return session;
}

export async function requireOfficial(): Promise<OfficialSession> {
  const session = await requireSession();
  if (!isOfficialSession(session)) throw new Error("This action is limited to the assigned official.");
  return session;
}

export async function requireFrontDesk(): Promise<FrontDeskSession> {
  const session = await requireSession();
  if (!isFrontDeskSession(session)) throw new Error("This action is limited to front desk staff.");
  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await requireSession();
  if (!isAdminSession(session)) throw new Error("This action is limited to administrators.");
  return session;
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Enter the required details.");
  }
}
