"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { api } from "@/constants/api";
import { AUTH_EVENT } from "@/constants/auth";
import { apiRequest } from "@/lib/api-client";
import {
  clearBrowserSession,
  readBrowserSession,
  sessionsEqual,
  writeBrowserSession,
} from "@/lib/session";
import type { AppSession, CitizenSession, FrontDeskSession, OfficialSession, AdminSession } from "@/types";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(AUTH_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(AUTH_EVENT, onChange);
  };
}

export function useAppSession(initial: AppSession | null = null) {
  const snapshotRef = useRef(initial);

  const getSnapshot = useCallback(() => {
    const next = readBrowserSession();
    if (!next) return snapshotRef.current;
    if (sessionsEqual(snapshotRef.current, next)) return snapshotRef.current;
    snapshotRef.current = next;
    return snapshotRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => snapshotRef.current, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
