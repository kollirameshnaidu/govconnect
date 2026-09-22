export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
export const CONFIRM_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const GENERIC_LOGIN_ERROR = "Enter a valid email and password.";
export const GENERIC_RESET_SENT =
  "If an account exists for that email, a reset link has been sent.";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export function passwordIssue(password: string) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Use letters and numbers in your password.";
  }
  return "";
}

export function staffLoginEmail(staffId: string) {
  return `${staffId.trim().toLowerCase()}@govconnect.gov.in`;
}
