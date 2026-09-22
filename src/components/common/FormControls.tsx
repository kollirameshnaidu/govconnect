"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function Field({ id, label, hint, error, required, children }: FieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <div
        className={cn(error && "[&_input]:border-danger [&_select]:border-danger [&_textarea]:border-danger")}
      >
        {children}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-muted/80 focus:border-navy-700";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete = "current-password",
  placeholder = "Password",
  required,
}: {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="pr-16"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-2 text-xs font-semibold text-navy-700"
        onClick={() => setVisible((current) => !current)}
        aria-pressed={visible}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlClass, className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/80 focus:border-navy-700",
        className,
      )}
      {...props}
    />
  );
}
