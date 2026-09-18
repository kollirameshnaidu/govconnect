import { MOCK_OTP } from "@/constants/auth";
import { api } from "@/constants/api";
import { apiRequest, isBrowser } from "@/lib/api-client";
import { getRuntimeStore } from "@/lib/runtime-store";
import { CITIZENS, DEMO_CITIZEN } from "@/mock/citizens";
import { getAdminStaffByStaffId } from "@/services/adminService";
import { getFrontDeskStaffByStaffId } from "@/services/frontDeskService";
import { getOfficialByStaffId } from "@/services/officialService";
import type { AdminSession, CitizenSession, FrontDeskSession, OfficialSession } from "@/types";

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function knownCitizen(mobile: string): CitizenSession | undefined {
  const fromSeed = CITIZENS.find((item) => item.mobile === mobile);
  if (fromSeed) return fromSeed;
  if (typeof window === "undefined") {
    return getRuntimeStore().citizens.find((item) => item.mobile === mobile);
  }
  return undefined;
}

function rememberCitizen(session: CitizenSession) {
  if (typeof window !== "undefined") return;
  const store = getRuntimeStore();
  store.citizens = [session, ...store.citizens.filter((item) => item.mobile !== session.mobile)];
}

export async function sendCitizenOtp(mobile: string): Promise<string> {
  if (isBrowser()) {
    const data = await apiRequest<{ otp: string }>(api.otp, {
      method: "POST",
      body: JSON.stringify({ role: "citizen", mobile }),
    });
    return data.otp;
  }
  await wait();
  if (!/^\d{10}$/.test(mobile)) {
    throw new Error("Enter a 10-digit mobile number.");
  }
  return MOCK_OTP;
}

export async function verifyCitizenOtp(
  mobile: string,
  otp: string,
): Promise<CitizenSession> {
  if (isBrowser()) {
    const data = await apiRequest<{ session: CitizenSession }>(api.verify, {
      method: "POST",
      body: JSON.stringify({ role: "citizen", mobile, otp }),
    });
    return data.session;
  }
  await wait();
  if (!/^\d{10}$/.test(mobile)) {
    throw new Error("Enter a 10-digit mobile number.");
  }
  if (otp !== MOCK_OTP) {
    throw new Error("Enter the 6-digit OTP sent to your mobile.");
  }
  const known = knownCitizen(mobile);
  if (known) return known;
  return {
    role: "citizen",
    id: `citizen-${mobile}`,
    name: `Citizen ${mobile.slice(-4)}`,
    mobile,
  };
}

export async function registerCitizen(input: {
  name: string;
  mobile: string;
  email?: string;
}): Promise<CitizenSession> {
  if (isBrowser()) {
    const data = await apiRequest<{ session: CitizenSession }>(api.register, {
      method: "POST",
      body: JSON.stringify(input),
    });
    return data.session;
  }
  await wait();
  const name = input.name.trim();
  const mobile = input.mobile.replace(/\D/g, "");
  const email = input.email?.trim();
  if (name.length < 3) throw new Error("Enter your full name.");
  if (!/^\d{10}$/.test(mobile)) throw new Error("Enter a 10-digit mobile number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address or leave it blank.");
  }
  const session: CitizenSession =
    mobile === DEMO_CITIZEN.mobile
      ? { ...DEMO_CITIZEN, name, email: email || DEMO_CITIZEN.email }
      : {
          role: "citizen",
          id: `citizen-${mobile}`,
          name,
          mobile,
          email: email || undefined,
        };
  rememberCitizen(session);
  return session;
}

export async function sendOfficialOtp(staffId: string): Promise<string> {
  if (isBrowser()) {
    const data = await apiRequest<{ otp: string }>(api.otp, {
      method: "POST",
      body: JSON.stringify({ role: "official", staffId }),
    });
    return data.otp;
  }
  await wait();
  const official = getOfficialByStaffId(staffId);
  if (!official) {
    throw new Error("Enter a valid staff ID issued by your office.");
  }
  return MOCK_OTP;
}

export async function verifyOfficialOtp(
  staffId: string,
  otp: string,
): Promise<OfficialSession> {
  if (isBrowser()) {
    const data = await apiRequest<{ session: OfficialSession }>(api.verify, {
      method: "POST",
      body: JSON.stringify({ role: "official", staffId, otp }),
    });
    return data.session;
  }
  await wait();
  const official = getOfficialByStaffId(staffId);
  if (!official) {
    throw new Error("Enter a valid staff ID issued by your office.");
  }
  if (otp !== MOCK_OTP) {
    throw new Error("Enter the 6-digit OTP sent to your registered staff contact.");
  }
  return {
    role: "official",
    id: official.id,
    name: official.name,
    designation: official.designation,
    officeId: official.officeId,
    departmentId: official.departmentId,
    staffId: official.staffId,
  };
}

export async function sendFrontDeskOtp(staffId: string): Promise<string> {
  if (isBrowser()) {
    const data = await apiRequest<{ otp: string }>(api.otp, {
      method: "POST",
      body: JSON.stringify({ role: "frontdesk", staffId }),
    });
    return data.otp;
  }
  await wait();
  const staff = getFrontDeskStaffByStaffId(staffId);
  if (!staff) {
    throw new Error("Enter a valid front desk staff ID issued by your office.");
  }
  return MOCK_OTP;
}

export async function verifyFrontDeskOtp(
  staffId: string,
  otp: string,
): Promise<FrontDeskSession> {
  if (isBrowser()) {
    const data = await apiRequest<{ session: FrontDeskSession }>(api.verify, {
      method: "POST",
      body: JSON.stringify({ role: "frontdesk", staffId, otp }),
    });
    return data.session;
  }
  await wait();
  const staff = getFrontDeskStaffByStaffId(staffId);
  if (!staff) {
    throw new Error("Enter a valid front desk staff ID issued by your office.");
  }
  if (otp !== MOCK_OTP) {
    throw new Error("Enter the 6-digit OTP sent to your registered staff contact.");
  }
  return {
    role: "frontdesk",
    id: staff.id,
    name: staff.name,
    designation: staff.designation,
    officeId: staff.officeId,
    staffId: staff.staffId,
  };
}

export async function sendAdminOtp(staffId: string): Promise<string> {
  if (isBrowser()) {
    const data = await apiRequest<{ otp: string }>(api.otp, {
      method: "POST",
      body: JSON.stringify({ role: "admin", staffId }),
    });
    return data.otp;
  }
  await wait();
  const staff = getAdminStaffByStaffId(staffId);
  if (!staff) {
    throw new Error("Enter a valid administrator staff ID issued by your office.");
  }
  return MOCK_OTP;
}

export async function verifyAdminOtp(staffId: string, otp: string): Promise<AdminSession> {
  if (isBrowser()) {
    const data = await apiRequest<{ session: AdminSession }>(api.verify, {
      method: "POST",
      body: JSON.stringify({ role: "admin", staffId, otp }),
    });
    return data.session;
  }
  await wait();
  const staff = getAdminStaffByStaffId(staffId);
  if (!staff) {
    throw new Error("Enter a valid administrator staff ID issued by your office.");
  }
  if (otp !== MOCK_OTP) {
    throw new Error("Enter the 6-digit OTP sent to your registered staff contact.");
  }
  return {
    role: "admin",
    id: staff.id,
    name: staff.name,
    designation: staff.designation,
    staffId: staff.staffId,
    kind: staff.kind,
    departmentId: staff.departmentId,
    district: staff.district,
  };
}
