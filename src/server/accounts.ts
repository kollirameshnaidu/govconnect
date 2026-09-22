import { DEMO_CITIZEN } from "@/mock/citizens";
import { ADMIN_STAFF } from "@/mock/admin";
import { FRONT_DESK_STAFF } from "@/mock/front-desk";
import { OFFICIALS } from "@/mock/officials";
import { DEMO_PASSWORD } from "@/constants/auth";
import { normalizeEmail, staffLoginEmail } from "@/lib/auth-rules";
import { getRuntimeStore } from "@/lib/runtime-store";
import { hashPassword } from "@/server/password";
import type { AdminKind, AppSession, AuthAccount, UserRole } from "@/types";

export function publicAccount(account: AuthAccount): AuthAccount {
  const copy = { ...account };
  delete copy.resetTokenHash;
  delete copy.resetExpiresAt;
  delete copy.emailVerifyTokenHash;
  delete copy.emailVerifyExpiresAt;
  return copy;
}

export function toSession(account: AuthAccount): AppSession {
  if (account.role === "official") {
    return {
      role: "official",
      id: account.id,
      name: account.name,
      designation: account.designation ?? "Officer",
      officeId: account.officeId ?? "",
      departmentId: account.departmentId ?? "",
      staffId: account.staffId ?? "",
    };
  }
  if (account.role === "frontdesk") {
    return {
      role: "frontdesk",
      id: account.id,
      name: account.name,
      designation: account.designation ?? "Front desk clerk",
      officeId: account.officeId ?? "",
      staffId: account.staffId ?? "",
    };
  }
  if (account.role === "admin") {
    return {
      role: "admin",
      id: account.id,
      name: account.name,
      designation: account.designation ?? "Administrator",
      staffId: account.staffId ?? "",
      kind: (account.kind ?? "super") as AdminKind,
      departmentId: account.departmentId,
      district: account.district,
    };
  }
  return {
    role: "citizen",
    id: account.id,
    name: account.name,
    mobile: account.mobile ?? "",
    email: account.email,
  };
}

export function findAccountByEmail(email: string) {
  const normalized = normalizeEmail(email);
  return getRuntimeStore().accounts.find((item) => normalizeEmail(item.email) === normalized);
}

export function findAccountByMobile(mobile: string) {
  const digits = mobile.replace(/\D/g, "");
  return getRuntimeStore().accounts.find((item) => item.mobile === digits);
}

export function findAccountByResetHash(tokenHash: string) {
  return getRuntimeStore().accounts.find(
    (item) => item.resetTokenHash === tokenHash && (item.resetExpiresAt ?? 0) > Date.now(),
  );
}

export function findAccountByVerifyHash(tokenHash: string) {
  return getRuntimeStore().accounts.find(
    (item) => item.emailVerifyTokenHash === tokenHash && (item.emailVerifyExpiresAt ?? 0) > Date.now(),
  );
}

export function saveAccount(account: AuthAccount) {
  const store = getRuntimeStore();
  store.accounts = [account, ...store.accounts.filter((item) => item.id !== account.id)];
}

function demoPassword() {
  return process.env.DEMO_AUTH_PASSWORD || DEMO_PASSWORD;
}

export async function seedAuthAccounts(existing: AuthAccount[]) {
  const next = [...existing];
  const demoHash = await hashPassword(demoPassword());

  function upsert(account: Omit<AuthAccount, "passwordHash"> & { passwordHash?: string }) {
    const email = normalizeEmail(account.email);
    const found = next.find(
      (item) => item.id === account.id || (email && normalizeEmail(item.email) === email),
    );
    if (found?.passwordHash) {
      if (account.role !== "citizen" || account.id === DEMO_CITIZEN.id) {
        found.emailVerified = true;
      }
      return;
    }
    const record: AuthAccount = {
      ...account,
      email,
      emailVerified: account.emailVerified ?? true,
      passwordHash: found?.passwordHash || account.passwordHash || demoHash,
    };
    if (found) {
      Object.assign(found, record);
      return;
    }
    next.unshift(record);
  }

  upsert({
    id: DEMO_CITIZEN.id,
    role: "citizen",
    email: DEMO_CITIZEN.email ?? "",
    name: DEMO_CITIZEN.name,
    mobile: DEMO_CITIZEN.mobile,
  });

  for (const official of OFFICIALS) {
    upsert({
      id: official.id,
      role: "official",
      email: staffLoginEmail(official.staffId),
      name: official.name,
      staffId: official.staffId,
      designation: official.designation,
      officeId: official.officeId,
      departmentId: official.departmentId,
    });
  }

  for (const staff of FRONT_DESK_STAFF) {
    upsert({
      id: staff.id,
      role: "frontdesk",
      email: staffLoginEmail(staff.staffId),
      name: staff.name,
      staffId: staff.staffId,
      designation: staff.designation,
      officeId: staff.officeId,
    });
  }

  for (const staff of ADMIN_STAFF) {
    upsert({
      id: staff.id,
      role: "admin",
      email: staffLoginEmail(staff.staffId),
      name: staff.name,
      staffId: staff.staffId,
      designation: staff.designation,
      kind: staff.kind,
      departmentId: staff.departmentId,
      district: staff.district,
    });
  }

  return next;
}

export function accountFromLegacy(document: Record<string, unknown>, fallbackRole: UserRole = "citizen"): AuthAccount | null {
  const id = String(document.id ?? document._id ?? "");
  const email = normalizeEmail(String(document.email ?? ""));
  if (!id) return null;
  return {
    id,
    role: (document.role as UserRole) || fallbackRole,
    email,
    passwordHash: String(document.passwordHash ?? ""),
    name: String(document.name ?? "Citizen"),
    mobile: document.mobile ? String(document.mobile) : undefined,
    staffId: document.staffId ? String(document.staffId) : undefined,
    designation: document.designation ? String(document.designation) : undefined,
    officeId: document.officeId ? String(document.officeId) : undefined,
    departmentId: document.departmentId ? String(document.departmentId) : undefined,
    kind: document.kind as AdminKind | undefined,
    district: document.district ? String(document.district) : undefined,
    resetTokenHash: document.resetTokenHash ? String(document.resetTokenHash) : undefined,
    resetExpiresAt: typeof document.resetExpiresAt === "number" ? document.resetExpiresAt : undefined,
    emailVerified:
      typeof document.emailVerified === "boolean"
        ? document.emailVerified
        : fallbackRole !== "citizen" || id === DEMO_CITIZEN.id,
    emailVerifyTokenHash: document.emailVerifyTokenHash ? String(document.emailVerifyTokenHash) : undefined,
    emailVerifyExpiresAt:
      typeof document.emailVerifyExpiresAt === "number" ? document.emailVerifyExpiresAt : undefined,
  };
}

export function provisionStaffAccount(input: {
  id: string;
  role: Exclude<UserRole, "citizen">;
  name: string;
  staffId: string;
  designation?: string;
  officeId?: string;
  departmentId?: string;
  kind?: AdminKind;
  district?: string;
  passwordHash: string;
}) {
  saveAccount({
    ...input,
    email: staffLoginEmail(input.staffId),
    emailVerified: true,
  });
}
