"use client";

import Link from "next/link";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isOfficialSession } from "@/lib/session";
import { getNotificationsForOfficial } from "@/services/notificationService";

export function OfficialNotificationList() {
  const session = useSession();
  const official = isOfficialSession(session) ? session : null;
  const items = official ? getNotificationsForOfficial(official.id) : [];

  if (!official) return null;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          New inbox items, accepted requests waiting for a slot, and citizen confirmations.
        </p>
      </header>
      {items.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No alerts yet"
          description="Desk activity for this staff ID will appear here."
        />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="font-semibold text-navy-900">{item.title}</h2>
                  <p className="text-xs text-muted">{item.date}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                {item.appointmentId ? (
                  <Link
                    href={routes.officialRequest(item.appointmentId)}
                    className="mt-3 inline-flex text-sm font-semibold text-navy-700"
                  >
                    Open {item.appointmentId}
                  </Link>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
