import { api } from "@/constants/api";
import { apiRequest, isBrowser } from "@/lib/api-client";
import type { Grievance } from "@/types";

export async function submitGrievance(input: {
  name: string;
  mobile: string;
  type: string;
  details: string;
}): Promise<Grievance> {
  if (!isBrowser()) {
    throw new Error("Submit the grievance from the public form.");
  }
  const data = await apiRequest<{ grievance: Grievance }>(api.grievances, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.grievance;
}
