"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

export function PreferredDateHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Why is a preferred date not a booking?
      </Button>
      <Modal
        open={open}
        title="Preferred date versus confirmed slot"
        onClose={() => setOpen(false)}
      >
        <p className="text-sm leading-6 text-muted">
          Citizens propose a date that works for them. An official then reviews
          office hours, holidays, and workload, and assigns the confirmed
          appointment date and time. Until that happens, the request stays under
          review.
        </p>
      </Modal>
    </>
  );
}
