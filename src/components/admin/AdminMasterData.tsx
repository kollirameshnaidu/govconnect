"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { Field, Input, Select } from "@/components/common/FormControls";
import { AdminGate, AdminHeader, useAdmin } from "@/components/admin/AdminUi";
import { useAdminConfig } from "@/lib/use-admin-config";
import {
  addAdminCategoryForDepartment,
  addAdminOffice,
  addAdminOfficial,
  listDepartmentsForAdmin,
  listOfficesForAdmin,
  listOfficialsForAdmin,
} from "@/services/adminService";
import { getOfficeById } from "@/services/officeService";
import { getDepartmentById } from "@/services/departmentService";

export function AdminOffices() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [district, setDistrict] = useState(admin?.district ?? "Central district");
  const [address, setAddress] = useState("");

  if (!admin) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await addAdminOffice(admin!, { name, district, address, hours: "", phone: "", email: "" });
      setSuccess("Office added for this demo overlay. Public Find office can list it after refresh.");
      setName("");
      setAddress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add office.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminGate permission="offices">
      <div className="grid gap-6">
        <AdminHeader
          title="Offices"
          description="Office master data for your administrator scope. Adding an office does not create appointment slots."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading offices…</p>
        ) : (
          <>
            <ul className="grid gap-3">
              {listOfficesForAdmin(admin).map((office) => (
                <li key={office.id}>
                  <Card>
                    <p className="font-semibold text-navy-900">{office.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {office.district} · {office.hours} · {office.phone}
                    </p>
                    <p className="mt-1 text-sm text-ink">{office.address}</p>
                  </Card>
                </li>
              ))}
            </ul>
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">Add office</h2>
              <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
                {error ? <Alert tone="danger" className="md:col-span-2">{error}</Alert> : null}
                {success ? <Alert tone="success" className="md:col-span-2">{success}</Alert> : null}
                <Field id="office-name" label="Office name" required>
                  <Input id="office-name" value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field id="office-district" label="District" required>
                  <Input
                    id="office-district"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                  />
                </Field>
                <Field id="office-address" label="Address">
                  <Input
                    id="office-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className="md:col-span-2"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save office"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminDepartments() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  if (!admin) return null;
  return (
    <AdminGate permission="departments">
      <div className="grid gap-6">
        <AdminHeader
          title="Departments"
          description="Department catalogue used by booking and official desks. Super administrators maintain this list."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading departments…</p>
        ) : (
          <ul className="grid gap-3">
            {listDepartmentsForAdmin(admin).map((department) => (
              <li key={department.id}>
                <Card>
                  <p className="font-semibold text-navy-900">{department.name}</p>
                  <p className="mt-1 text-sm text-muted">{department.summary}</p>
                  <p className="mt-2 text-sm text-ink">
                    Categories: {department.categories.join(", ")}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminCategories() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState(admin?.departmentId ?? "revenue");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  if (!admin) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await addAdminCategoryForDepartment(admin!, departmentId, name);
      setSuccess("Category added. Booking will list it for this department.");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add category.");
    } finally {
      setPending(false);
    }
  }

  const departments = listDepartmentsForAdmin(admin);

  return (
    <AdminGate permission="categories">
      <div className="grid gap-6">
        <AdminHeader
          title="Categories"
          description="Service categories used when a citizen selects department and purpose. This does not confirm a slot."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading categories…</p>
        ) : departments.length === 0 ? (
          <EmptyState icon="info" title="No department in scope" description="This role has no department catalogue." />
        ) : (
          <>
            <ul className="grid gap-3">
              {departments.map((department) => (
                <li key={department.id}>
                  <Card>
                    <p className="font-semibold text-navy-900">{department.name}</p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-ink">
                      {department.categories.map((category) => (
                        <li key={category}>{category}</li>
                      ))}
                    </ul>
                  </Card>
                </li>
              ))}
            </ul>
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">Add category</h2>
              <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
                {error ? <Alert tone="danger" className="md:col-span-2">{error}</Alert> : null}
                {success ? <Alert tone="success" className="md:col-span-2">{success}</Alert> : null}
                {admin.kind !== "department" ? (
                  <Field id="cat-dept" label="Department" required>
                    <Select
                      id="cat-dept"
                      value={departmentId}
                      onChange={(event) => setDepartmentId(event.target.value)}
                    >
                      {departments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                ) : null}
                <Field id="cat-name" label="Category name" required>
                  <Input id="cat-name" value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save category"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminOfficials() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [staffId, setStaffId] = useState("");
  const [officeId, setOfficeId] = useState("collectorate-central");
  const [departmentId, setDepartmentId] = useState(admin?.departmentId ?? "revenue");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  if (!admin) return null;

  const offices = listOfficesForAdmin(admin);
  const departments = listDepartmentsForAdmin(admin);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");
    try {
      await addAdminOfficial(admin!, { name, designation, staffId, officeId, departmentId });
      setSuccess("Official added. They can sign in with this staff ID after OTP.");
      setName("");
      setStaffId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add official.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminGate permission="officials">
      <div className="grid gap-6">
        <AdminHeader
          title="Officials"
          description="Desk officers who review requests and assign confirmed date and time. Administrators do not schedule on their behalf."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading officials…</p>
        ) : (
          <>
            <ul className="grid gap-3">
              {listOfficialsForAdmin(admin).map((official) => (
                <li key={official.id}>
                  <Card>
                    <p className="font-semibold text-navy-900">
                      {official.name} · {official.staffId}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {official.designation} · {getOfficeById(official.officeId)?.name} ·{" "}
                      {getDepartmentById(official.departmentId)?.name}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
            <Card>
              <h2 className="text-lg font-semibold text-navy-900">Add official</h2>
              <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
                {error ? <Alert tone="danger" className="md:col-span-2">{error}</Alert> : null}
                {success ? <Alert tone="success" className="md:col-span-2">{success}</Alert> : null}
                <Field id="off-name" label="Name" required>
                  <Input id="off-name" value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field id="off-desig" label="Designation">
                  <Input
                    id="off-desig"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                  />
                </Field>
                <Field id="off-staff" label="Staff ID" required>
                  <Input
                    id="off-staff"
                    value={staffId}
                    onChange={(event) => setStaffId(event.target.value.toUpperCase())}
                    placeholder="REV-1199"
                  />
                </Field>
                <Field id="off-office" label="Office" required>
                  <Select id="off-office" value={officeId} onChange={(event) => setOfficeId(event.target.value)}>
                    {offices.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                {admin.kind !== "department" ? (
                  <Field id="off-dept" label="Department" required>
                    <Select
                      id="off-dept"
                      value={departmentId}
                      onChange={(event) => setDepartmentId(event.target.value)}
                    >
                      {departments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                ) : null}
                <div className="md:col-span-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save official"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </div>
    </AdminGate>
  );
}
