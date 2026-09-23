"use client";

import { useEffect, useState } from "react";
import { api } from "@/constants/api";
import { AUTH_EVENT } from "@/constants/auth";
import { apiRequest } from "@/lib/api-client";
import {
  clearBrowserSession,
  isBrowserSignedOut,
  readBrowserSession,
  sessionsEqual,
  writeBrowserSession,
} from "@/lib/session";
import type { AppSession, CitizenSession, FrontDeskSession, OfficialSession, AdminSession } from "@/types";

function liveSession(initial: AppSession | null) {
  if (isBrowserSignedOut()) return null;
  return readBrowserSession() ?? initial;
}

export function useAppSession(initial: AppSession | null = null) {
  const [session, setSession] = useState(initial);

  useEffect(() => {
    function sync() {
      const next = liveSession(initial);
      setSession((current) => (sessionsEqual(current, next) ? current : next));
    }
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, [initial]);

  return session;
}

export function useCitizenSession(initial: AppSession | null = null) {
  return useAppSession(initial);
}

export function setCitizenSession(session: CitizenSession) {
  writeBrowserSession(session);
}

export function setOfficialSession(session: OfficialSession) {
  writeBrowserSession(session);
}

export function setFrontDeskSession(session: FrontDeskSession) {
  writeBrowserSession(session);
}

export function setAdminSession(session: AdminSession) {
  writeBrowserSession(session);
}

export function logoutCitizen() {
  void apiRequest(api.logout, { method: "POST" }).catch(() => undefined);
  clearBrowserSession();
}

export function logoutSession() {
  void apiRequest(api.logout, { method: "POST" }).catch(() => undefined);
  clearBrowserSession();
}
