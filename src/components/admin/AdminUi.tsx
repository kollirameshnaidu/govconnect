"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { useSession } from "@/components/auth/AuthProvider";
import { canAdmin } from "@/constants/admin";
import { isAdminSession } from "@/lib/session";
import type { AdminPermission, AdminSession } from "@/types";

export function useAdmin() {
  const session = useSession();
  return isAdminSession(session) ? session : null;
}

export function AdminGate({
  permission,
  children,
}: {
  permission: AdminPermission;
  children: ReactNode;
}) {
  const admin = useAdmin();
  if (!admin) return null;
  if (!canAdmin(admin, permission)) {
    return (
      <EmptyState
        icon="alert"
        title="Not permitted for this administrator"
        description="Department, district, and super administrators share this portal with different permissions. This page is outside your role."
      />
    );
  }
  return children;
}

export function AdminHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-saffron-600">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold text-navy-900">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

export function adminScopeLabel(admin: AdminSession) {
  if (admin.kind === "department") return `Department scope`;
  if (admin.kind === "district") return admin.district ?? "District scope";
  return "All offices";
}
