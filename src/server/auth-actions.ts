import { DEMO_CITIZEN } from "@/mock/citizens";
import {
  GENERIC_LOGIN_ERROR,
  CONFIRM_TOKEN_TTL_MS,
  RESET_TOKEN_TTL_MS,
  isValidEmail,
  normalizeEmail,
  passwordIssue,
} from "@/lib/auth-rules";
import {
  findAccountByEmail,
  findAccountByMobile,
  findAccountByResetHash,
  findAccountByVerifyHash,
  saveAccount,
  toSession,
} from "@/server/accounts";
import { isSmtpConfigured, sendRegistrationConfirmEmail } from "@/server/mail";
import { hashPassword, verifyPassword } from "@/server/password";
import { createResetToken, hashResetToken } from "@/server/reset-token";
import type { AppSession, CitizenSession, UserRole } from "@/types";

export async function loginWithPassword(
  role: UserRole,
  email: string,
  password: string,
): Promise<AppSession> {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized) || !password) {
    throw new Error(GENERIC_LOGIN_ERROR);
  }
  const account = findAccountByEmail(normalized);
  const matches = await verifyPassword(password, account?.passwordHash);
  if (!account || !matches || account.role !== role) {
    throw new Error(GENERIC_LOGIN_ERROR);
  }
  if (role === "citizen" && account.emailVerified !== true) {
    throw new Error("Confirm the email sent to your address before signing in.");
  }
  const session = toSession(account);
  if (session.role === "citizen" && !/^\d{10}$/.test(session.mobile)) {
    throw new Error(GENERIC_LOGIN_ERROR);
  }
  return session;
}

export async function registerCitizenAccount(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  mobile?: string;
}): Promise<CitizenSession> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const mobile = (input.mobile ?? "").replace(/\D/g, "");
  const password = input.password;
  if (name.length < 3) throw new Error("Enter your full name.");
  if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
  if (!/^\d{10}$/.test(mobile)) throw new Error("Enter a 10-digit mobile number.");
  const passwordError = passwordIssue(password);
  if (passwordError) throw new Error(passwordError);
  if (input.confirmPassword !== undefined && input.confirmPassword !== password) {
    throw new Error("The passwords do not match.");
  }
  if (findAccountByEmail(email)) {
    throw new Error("An account with this email already exists. Sign in or reset your password.");
  }
  if (findAccountByMobile(mobile)) {
    throw new Error("An account with this mobile number already exists. Sign in instead.");
  }
  if (!isSmtpConfigured()) {
    throw new Error("Email is not configured.");
  }
  const token = createResetToken();
  const account = {
    id: mobile === DEMO_CITIZEN.mobile ? DEMO_CITIZEN.id : `citizen-${mobile}`,
    role: "citizen" as const,
    email,
    passwordHash: await hashPassword(password),
    name,
    mobile,
    emailVerified: false,
    emailVerifyTokenHash: hashResetToken(token),
    emailVerifyExpiresAt: Date.now() + CONFIRM_TOKEN_TTL_MS,
  };
  saveAccount(account);
  await sendRegistrationConfirmEmail(email, name, token);
  return toSession(account) as CitizenSession;
}

export async function issuePasswordReset(email: string) {
  if (!isSmtpConfigured()) {
    throw new Error("Email is not configured.");
  }
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return null;
  const account = findAccountByEmail(normalized);
  if (!account?.passwordHash) {
    console.info("[auth] password reset skipped");
    return null;
  }
  const token = createResetToken();
  saveAccount({
    ...account,
    resetTokenHash: hashResetToken(token),
    resetExpiresAt: Date.now() + RESET_TOKEN_TTL_MS,
  });
  return { email: account.email, token };
}

export async function resetPasswordWithToken(token: string, password: string, confirmPassword: string) {
  const passwordError = passwordIssue(password);
  if (passwordError) throw new Error(passwordError);
  if (password !== confirmPassword) throw new Error("The passwords do not match.");
  if (!token.trim()) throw new Error("This reset link is invalid or has expired.");
  const account = findAccountByResetHash(hashResetToken(token.trim()));
  if (!account) throw new Error("This reset link is invalid or has expired.");
  const next = { ...account, passwordHash: await hashPassword(password) };
  delete next.resetTokenHash;
  delete next.resetExpiresAt;
  saveAccount(next);
}

export async function confirmCitizenEmail(token: string): Promise<CitizenSession> {
  if (!token.trim()) throw new Error("This confirmation link is invalid or has expired.");
  const account = findAccountByVerifyHash(hashResetToken(token.trim()));
  if (!account || account.role !== "citizen") {
    throw new Error("This confirmation link is invalid or has expired.");
  }
  const next = { ...account, emailVerified: true };
  delete next.emailVerifyTokenHash;
  delete next.emailVerifyExpiresAt;
  saveAccount(next);
  return toSession(next) as CitizenSession;
}

export async function updateCitizenAccount(
  session: CitizenSession,
  input: { name: string; email: string },
): Promise<CitizenSession> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  if (name.length < 3) throw new Error("Enter your full name.");
  if (!isValidEmail(email)) throw new Error("Enter a valid email address.");
  const account = findAccountByEmail(session.email ?? "") ?? findAccountByMobile(session.mobile);
  if (!account || account.id !== session.id) throw new Error("Sign in to continue.");
  const taken = findAccountByEmail(email);
  if (taken && taken.id !== account.id) {
    throw new Error("An account with this email already exists.");
  }
  const next = { ...account, name, email };
  saveAccount(next);
  return toSession(next) as CitizenSession;
}
