import { BookingWizard } from "@/components/citizen/BookingWizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New appointment" };

export default async function CitizenBookPage({
  searchParams,
}: PageProps<"/citizen/appointments/new">) {
  const params = await searchParams;
  const officeId = typeof params.office === "string" ? params.office : undefined;
  const departmentId =
    typeof params.department === "string" ? params.department : undefined;

  return (
    <BookingWizard
      initialOfficeId={officeId}
      initialDepartmentId={departmentId}
    />
  );
}
