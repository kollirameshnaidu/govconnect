"use client";

import { Card } from "@/components/common/Card";
import { AdminGate, AdminHeader, useAdmin } from "@/components/admin/AdminUi";
import {
  ADMIN_KIND_LABEL,
  ADMIN_PERMISSION_LABEL,
  ADMIN_PERMISSIONS,
  ALL_ADMIN_PERMISSIONS,
} from "@/constants/admin";
import { useAdminConfig } from "@/lib/use-admin-config";
import { listUsersForAdmin } from "@/services/adminService";
import type { AdminKind } from "@/types";

export function AdminUsers() {
  const admin = useAdmin();
  const { ready } = useAdminConfig();
  if (!admin) return null;
  const rows = listUsersForAdmin(admin);
  return (
    <AdminGate permission="users">
      <div className="grid gap-6">
        <AdminHeader
          title="Users"
          description="Staff identities that can sign in. Citizen accounts cannot open this portal. Administrators cannot assign a confirmed slot."
        />
        {!ready ? (
          <p className="text-sm text-muted">Loading users…</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-navy-50 text-navy-900">
                <tr>
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Staff ID</th>
                  <th className="px-3 py-2 font-semibold">Portal</th>
                  <th className="px-3 py-2 font-semibold">Scope</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.portal}-${row.id}`} className="border-t border-line">
                    <td className="px-3 py-2">
                      {row.name}
                      <span className="block text-xs text-muted">{row.designation}</span>
                    </td>
                    <td className="px-3 py-2 font-medium">{row.staffId}</td>
                    <td className="px-3 py-2">{row.portal}</td>
                    <td className="px-3 py-2 text-muted">{row.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminGate>
  );
}

export function AdminRoles() {
  const admin = useAdmin();
  if (!admin) return null;
  const kinds: AdminKind[] = ["super", "district", "department"];
  return (
    <AdminGate permission="roles">
      <div className="grid gap-6">
        <AdminHeader
          title="Roles"
          description="One admin tree with a permission map. Super, district, and department administrators are not separate applications."
        />
        <Card className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2">Permission</th>
                {kinds.map((kind) => (
                  <th key={kind} className="px-3 py-2">
                    {ADMIN_KIND_LABEL[kind]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_ADMIN_PERMISSIONS.map((permission) => (
                <tr key={permission} className="border-t border-line">
                  <td className="px-3 py-2">{ADMIN_PERMISSION_LABEL[permission]}</td>
                  {kinds.map((kind) => (
                    <td key={kind} className="px-3 py-2">
                      {ADMIN_PERMISSIONS[kind].includes(permission) ? "Allowed" : "Hidden"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminGate>
  );
}
