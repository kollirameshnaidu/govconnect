"use client";

import { useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/components/auth/AuthProvider";
import { routes } from "@/constants/routes";
import { isFrontDeskSession } from "@/lib/session";
import { useFrontDeskAppointments } from "@/lib/use-citizen-appointments";
import {
  callNextFrontDeskVisitor,
  listFrontDeskQueue,
  markFrontDeskNoShow,
} from "@/services/appointmentService";
import type { FrontDeskSession, TrackedAppointment } from "@/types";

export function FrontDeskQueue() {
  const session = useSession();
  const staff = isFrontDeskSession(session) ? session : null;
  const { appointments, ready } = useFrontDeskAppointments(staff);
  const queue = staff ? listFrontDeskQueue(staff, appointments) : [];

  if (!staff) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading queue…</p>;
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-bold text-navy-900">Waiting queue</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Call visitors in order. The official starts the meeting from the official portal. Mark
          no-show if the citizen does not remain after check-in.
        </p>
      </header>
      {queue.length === 0 ? (
        <EmptyState
          icon="users"
          title="Queue is empty"
          description="Check in a confirmed visitor and add them to the waiting queue."
          action={
            <Button href={routes.frontDeskSearch} variant="outline">
              Search visitor
            </Button>
          }
        />
      ) : (
        <QueueList queue={queue} staff={staff} />
      )}
    </div>
  );
}

function QueueList({
  queue,
  staff,
}: {
  queue: TrackedAppointment[];
  staff: FrontDeskSession;
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const desk = staff;

  async function run(action: string, work: () => Promise<unknown>) {
    setPending(action);
    setError("");
    try {
      await work();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The action could not be completed.");
    } finally {
      setPending("");
    }
  }

  const nextVisitor = queue[0];

  return (
    <div className="grid gap-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {nextVisitor ? (
        <Card>
          <p className="text-sm font-semibold text-navy-700">Next to call</p>
          <p className="mt-1 text-lg font-bold text-navy-900">
            {nextVisitor.citizenName} · {nextVisitor.id}
          </p>
          <p className="mt-1 text-sm text-muted">{nextVisitor.purpose}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => run("call", () => callNextFrontDeskVisitor(desk, nextVisitor.id))}
              disabled={Boolean(pending)}
            >
              {pending === "call" ? "Calling…" : "Call next"}
            </Button>
            <Button href={routes.frontDeskVisit(nextVisitor.id)} variant="outline">
              Open visit
            </Button>
          </div>
        </Card>
      ) : null}
      <ol className="grid gap-3">
        {queue.map((item) => (
          <li key={item.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Position {item.queuePosition ?? "—"}
                  </p>
                  <p className="mt-1 font-semibold text-navy-900">
                    {item.citizenName} · {item.id}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {item.confirmedAt ?? "Slot not listed"} · {item.purpose}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href={routes.frontDeskVisit(item.id)} size="sm" variant="outline">
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={Boolean(pending)}
                  onClick={() => run(`no-show-${item.id}`, () => markFrontDeskNoShow(desk, item.id))}
                >
                  {pending === `no-show-${item.id}` ? "Saving…" : "No-show"}
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
