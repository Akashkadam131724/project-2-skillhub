"use client";

import { useState, type ReactNode } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import ContactChannelCard from "../shared/ContactChannelCard";
import { SectionLayoutRoot } from "@/components/sections/layout";
import { SectionBrandGlow, SectionLightCard } from "@/components/sections/shared/design";
import { DS_FIELD, DS_TEXT, sectionClassNames } from "@/lib/sections/section-design-system";
import { DS_RADIUS } from "@/lib/layout/section-layout-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import DsButton from "@/components/ui/DsButton";
import type { ContactFormUiProps } from "./lib/types";

const TOPICS = [
  "Request a demo",
  "Publishing & CMS",
  "Catalog & courses",
  "Partnership",
  "Support",
  "Other",
];

const COMPANY_SIZES = [
  "1–50",
  "51–200",
  "201–1,000",
  "1,001–5,000",
  "5,000+",
];

const DEFAULT_SUCCESS_NOTE =
  "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.";

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

export default function ContactFormUi({
  title,
  subtitle,
  body = "",
  successNote = DEFAULT_SUCCESS_NOTE,
  titleSlot,
  subtitleSlot,
  bodySlot,
  channelsSlot,
  channels = [],
  itemsBar,
  preview = false,
  id,
  className = "",
}: ContactFormUiProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    companySize: "",
    topic: "",
    message: "",
    consent: false,
  });

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (preview) return;
    if (
      !form.firstName ||
      !form.email ||
      !form.company ||
      !form.topic ||
      !form.message ||
      !form.consent
    ) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    window.setTimeout(() => {
      setStatus("success");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        jobTitle: "",
        companySize: "",
        topic: "",
        message: "",
        consent: false,
      });
    }, 650);
  }

  const showBody = bodySlot != null || !isRichTextEmpty(body);
  const showChannels = channelsSlot != null || channels.length > 0;

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      padding="lg"
      decor={<SectionBrandGlow />}
      hasBodyContent
    >
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div className="lg:col-span-5">
          <p className={DS_TEXT.eyebrow}>Contact</p>

          {titleSlot != null ? (
            titleSlot
          ) : title ? (
            <h2
              className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl lg:text-[2.65rem]`}
            >
              {title}
            </h2>
          ) : null}

          {subtitleSlot != null ? (
            subtitleSlot
          ) : subtitle ? (
            <p
              className={`${DS_TEXT.muted} mt-4 mb-0 text-base leading-relaxed sm:text-lg`}
            >
              {subtitle}
            </p>
          ) : null}

          {showBody ? (
            bodySlot != null ? (
              bodySlot
            ) : (
              <CmsRichText
                html={body}
                className={`${DS_TEXT.muted} mt-4 text-sm leading-relaxed`}
              />
            )
          ) : null}

          {showChannels ? (
            channelsSlot != null ? (
              channelsSlot
            ) : (
              <ul className="mt-8 m-0 grid list-none gap-3 p-0">
                {channels.map((item, i) => (
                  <li key={item.id ?? i}>
                    <ContactChannelCard item={item} />
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {itemsBar}
        </div>

        <div className="lg:col-span-7">
          <SectionLightCard
            className={sectionClassNames(DS_RADIUS.panel, "p-5 sm:p-7 lg:p-8")}
          >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className={`m-0 text-lg font-semibold ${DS_TEXT.heading}`}>
                  Send an inquiry
                </h3>
                <p className={`${DS_TEXT.muted} mt-1 mb-0 text-sm`}>
                  Typical response within one business day.
                </p>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand uppercase">
                Enterprise
              </span>
            </div>

            {status === "success" ? (
              <div
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-sm leading-relaxed text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
              >
                <p className="m-0 font-semibold">Inquiry received</p>
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
              <form
                onSubmit={onSubmit}
                className="grid gap-4 sm:grid-cols-2"
                noValidate
              >
                <Field id="contact-first" label="First name" required>
                  <input
                    id="contact-first"
                    name="firstName"
                    autoComplete="given-name"
                    className={inputClass}
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    required
                  />
                </Field>
                <Field id="contact-last" label="Last name">
                  <input
                    id="contact-last"
                    name="lastName"
                    autoComplete="family-name"
                    className={inputClass}
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                </Field>
                <Field id="contact-email" label="Work email" required>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />
                </Field>
                <Field id="contact-phone" label="Phone">
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </Field>
                <Field id="contact-company" label="Company" required>
                  <input
                    id="contact-company"
                    name="company"
                    autoComplete="organization"
                    className={inputClass}
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    required
                  />
                </Field>
                <Field id="contact-title" label="Job title">
                  <input
                    id="contact-title"
                    name="jobTitle"
                    autoComplete="organization-title"
                    className={inputClass}
                    value={form.jobTitle}
                    onChange={(e) => update("jobTitle", e.target.value)}
                  />
                </Field>
                <Field id="contact-size" label="Company size">
                  <select
                    id="contact-size"
                    name="companySize"
                    className={inputClass}
                    value={form.companySize}
                    onChange={(e) => update("companySize", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="contact-topic" label="Topic" required>
                  <select
                    id="contact-topic"
                    name="topic"
                    className={inputClass}
                    value={form.topic}
                    onChange={(e) => update("topic", e.target.value)}
                    required
                  >
                    <option value="">Select…</option>
                    {TOPICS.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field id="contact-message" label="How can we help?" required>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={`${inputClass} resize-y min-h-[8rem]`}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us about your team, timeline, and goals…"
                      required
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <label
                    className={`flex items-start gap-3 text-sm leading-relaxed ${DS_TEXT.muted}`}
                  >
                    <input
                      type="checkbox"
                      className={`${DS_FIELD.checkbox} mt-1 shrink-0`}
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      required
                    />
                    <span>
                      I agree to be contacted about SkillHub products and
                      services. You can unsubscribe at any time.
                    </span>
                  </label>
                </div>

                {status === "error" ? (
                  <p className="sm:col-span-2 m-0 text-sm text-red-600 dark:text-red-400">
                    Please complete the required fields and consent checkbox.
                  </p>
                ) : null}

                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                  <DsButton
                    label={
                      status === "submitting" ? "Sending…" : "Submit inquiry"
                    }
                    variant="primary"
                    size="md"
                    shape="rounded"
                    icon="none"
                    htmlType="submit"
                    disabled={status === "submitting" || preview}
                  />
                  <p className={`${DS_TEXT.subtle} m-0 text-xs`}>
                    Prefer email?{" "}
                    <a
                      href="mailto:hello@skillhub.example"
                      className="font-semibold text-brand no-underline hover:underline"
                    >
                      hello@skillhub.example
                    </a>
                  </p>
                </div>
              </form>
            )}
          </SectionLightCard>
        </div>
      </div>
    </SectionLayoutRoot>
  );
}
