import { parseSessionObject } from "@/lib/session";
import type { AppSession } from "@/types";

const encoder = new TextEncoder();

function sessionSecret() {
  const value = process.env.SESSION_SECRET?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") return "";
  return "local-dev-only-session-secret";
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function utf8ToBase64Url(value: string) {
  return toBase64Url(encoder.encode(value));
}

function fromBase64Url(value: string) {
  const pad = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function hmacSha256(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function signaturesMatch(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function serializeSessionCookie(session: AppSession) {
  const secret = sessionSecret();
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  const payload = utf8ToBase64Url(JSON.stringify(session));
  const signature = await hmacSha256(secret, payload);
  return `${payload}.${signature}`;
}

export async function parseSignedSession(value?: string | null): Promise<AppSession | null> {
  if (!value) return null;
  const secret = sessionSecret();
  if (!secret) return null;
  try {
    const raw = decodeURIComponent(value);
    const separator = raw.lastIndexOf(".");
    if (separator <= 0) return null;
    const payload = raw.slice(0, separator);
    const signature = raw.slice(separator + 1);
    if (!payload || !signature) return null;
    const expected = await hmacSha256(secret, payload);
    if (!signaturesMatch(signature, expected)) return null;
    const json = new TextDecoder().decode(fromBase64Url(payload));
    return parseSessionObject(JSON.parse(json));
  } catch {
    return null;
  }
}
