import { DEMO_CITIZEN_MOBILE } from "@/constants/auth";
import type { CitizenSession } from "@/types";

export const DEMO_CITIZEN: CitizenSession = {
  role: "citizen",
  id: "citizen-priya",
  name: "Priya Sharma",
  mobile: DEMO_CITIZEN_MOBILE,
  email: "priya.sharma@example.in",
};

export const CITIZENS: CitizenSession[] = [DEMO_CITIZEN];
