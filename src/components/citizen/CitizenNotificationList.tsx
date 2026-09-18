"use client";

import Link from "next/link";
import { useSession } from "@/components/auth/AuthProvider";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { routes } from "@/constants/routes";
import { getNotificationsForCitizen } from "@/services/notificationService";

export function CitizenNotificationList() {
  const session = useSession();
  const items = session ? getNotificationsForCitizen(session.id) : [];

  if (!session) return null;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Confirmed slots, transfers, and review updates appear here. Helpline
          staff cannot assign a confirmed appointment time.
        </p>
      </header>
      {items.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No alerts yet"
          description="You will be notified when an official reviews a request or assigns a confirmed date and time."
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
                    href={routes.citizenAppointment(item.appointmentId)}
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
