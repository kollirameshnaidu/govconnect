import { api } from "@/constants/api";
import { apiRequest } from "@/lib/api-client";
import type { AppSession, CitizenSession, UserRole } from "@/types";

export async function loginWithPassword(role: UserRole, email: string, password: string) {
  const data = await apiRequest<{ session: AppSession }>(api.login, {
    method: "POST",
    body: JSON.stringify({ role, email, password }),
  });
  return data.session;
}

export async function registerCitizen(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}) {
  return apiRequest<{ email?: string; message: string }>(api.register, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function confirmCitizenEmail(token: string) {
  const data = await apiRequest<{ session: CitizenSession }>(api.confirmEmail, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  return data.session;
}

export async function requestPasswordReset(email: string) {
  await apiRequest(api.forgotPassword, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordWithToken(token: string, password: string, confirmPassword: string) {
  await apiRequest(api.resetPassword, {
    method: "POST",
    body: JSON.stringify({ token, password, confirmPassword }),
  });
}

export async function updateCitizenProfile(input: { name: string; email: string }) {
  const data = await apiRequest<{ session: CitizenSession }>(api.profile, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.session;
}
