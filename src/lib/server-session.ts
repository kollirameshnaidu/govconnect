import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/constants/auth";
import { parseSignedSession } from "@/lib/session-cookie";
import type { AppSession } from "@/types";

export async function getServerSession(): Promise<AppSession | null> {
  const jar = await cookies();
  return parseSignedSession(jar.get(SESSION_COOKIE)?.value);
}
