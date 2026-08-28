"use client";

import { useState, type ReactNode } from "react";
import SectionLightCard from "@/components/sections/shared/design/SectionLightCard";
import DsButton from "@/components/ui/DsButton";
import { DS_FIELD, DS_TEXT } from "@/lib/sections/section-design-system";

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={DS_FIELD.label}>
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

const inputClass = DS_FIELD.input;

export type ShortLeadFormProps = {
  cmsMode?: boolean;
  formKey?: string;
  formTitle?: string;
  formSubtitle?: string;
  successMessage?: string;
  submitLabel?: string;
};

/**
 * Fixed short lead form — fields are static in code (not CMS form builder).
 */
export default function ShortLeadForm({
  cmsMode = false,
  formKey = "lead",
  formTitle = "Get in touch",
  formSubtitle = "We typically respond within one business day.",
  successMessage,
  submitLabel = "Submit",
}: ShortLeadFormProps) {
  const successNote =
    successMessage ||
    "Thanks — we received your message and will follow up shortly.";

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    company: "",
    message: "",
    consent: false,
  });

  function update(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cmsMode) return;
    if (!form.firstName || !form.email || !form.message || !form.consent) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      setForm({
        firstName: "",
        email: "",
        company: "",
        message: "",
        consent: false,
      });
    }, 650);
  }

  return (
    <SectionLightCard className="rounded-[1.75rem] p-5 sm:p-7 lg:p-8">
      <div className="mb-6">
        <h3 className={`m-0 text-lg font-semibold ${DS_TEXT.heading}`}>
          {formTitle}
        </h3>
        {formSubtitle ? (
          <p className={`${DS_TEXT.muted} mt-1 mb-0 text-sm`}>
            {formSubtitle}
          </p>
        ) : null}
        {formKey && cmsMode ? (
          <p className={`${DS_TEXT.subtle} mt-2 mb-0 font-mono text-[10px]`}>
            form_key: {formKey}
          </p>
        ) : null}
      </div>

      {status === "success" ? (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm leading-relaxed text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
        >
          <p className="m-0 font-semibold">Message received</p>
          <p className="mt-2 mb-0">{successNote}</p>
          <button
            type="button"
            className="mt-4 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
            onClick={() => setStatus("idle")}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4" noValidate>
          <Field id="lead-first" label="First name" required>
            <input
              id="lead-first"
              name="firstName"
              autoComplete="given-name"
              className={inputClass}
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </Field>
          <Field id="lead-email" label="Work email" required>
            <input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </Field>
          <Field id="lead-company" label="Company">
            <input
              id="lead-company"
              name="company"
              autoComplete="organization"
              className={inputClass}
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </Field>
          <Field id="lead-message" label="Message" required>
            <textarea
              id="lead-message"
              name="message"
              rows={4}
              className={`${inputClass} min-h-[6rem] resize-y`}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="How can we help?"
              required
            />
          </Field>
          <label
            className={`flex items-start gap-3 text-sm leading-relaxed ${DS_TEXT.muted}`}
          >
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              required
            />
            <span>
              I agree to be contacted about products and services. You can
              unsubscribe at any time.
            </span>
          </label>

          {status === "error" ? (
            <p className="m-0 text-sm text-red-600 dark:text-red-400">
              Please complete the required fields and consent checkbox.
            </p>
          ) : null}

          <DsButton
            label={status === "submitting" ? "Sending…" : submitLabel}
            variant="primary"
            size="md"
            shape="rounded"
            icon="none"
            htmlType="submit"
            disabled={status === "submitting" || cmsMode}
            className="w-full sm:w-auto"
          />
        </form>
      )}
    </SectionLightCard>
  );
}
