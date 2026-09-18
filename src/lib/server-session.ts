import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/constants/auth";
import { parseSession } from "@/lib/session";
import type { AppSession } from "@/types";

export async function getServerSession(): Promise<AppSession | null> {
  const jar = await cookies();
  return parseSession(jar.get(SESSION_COOKIE)?.value);
}
