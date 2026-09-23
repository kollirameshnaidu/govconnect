"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/common/Alert";
import { Button } from "@/components/common/Button";
import { Field, Input, Select, Textarea } from "@/components/common/FormControls";
import { api } from "@/constants/api";
import { apiRequest } from "@/lib/api-client";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const mobile = String(data.get("mobile") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "other");
    if (name.length < 3) {
      setError("Enter your full name.");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a 10-digit mobile number.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address or leave it blank.");
      return;
    }
    if (message.length < 20) {
      setError("Enter a message of at least 20 characters.");
      return;
    }
    setError("");
    setPending(true);
    try {
      await apiRequest(api.grievances, {
        method: "POST",
        body: JSON.stringify({
          name,
          mobile,
          type: topic,
          details: email ? `${message}\n\nEmail: ${email}` : message,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the message.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <Alert tone="success" title="Message received">
        Helpline staff received this message. They cannot assign a confirmed
        appointment slot. Use Book appointment to submit a request.
      </Alert>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit} noValidate>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field id="contact-name" label="Full name" required>
        <Input id="contact-name" name="name" autoComplete="name" required />
      </Field>
      <Field id="contact-mobile" label="Mobile number" required>
        <Input
          id="contact-mobile"
          name="mobile"
          inputMode="numeric"
          maxLength={10}
          required
        />
      </Field>
      <Field id="contact-email" label="Email" hint="Optional">
        <Input id="contact-email" name="email" type="email" autoComplete="email" />
      </Field>
      <Field id="contact-topic" label="Topic">
        <Select id="contact-topic" name="topic" defaultValue="process">
          <option value="process">How the process works</option>
          <option value="track">Tracking an appointment</option>
          <option value="office">Finding an office</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field id="contact-message" label="Message" required>
        <Textarea id="contact-message" name="message" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
