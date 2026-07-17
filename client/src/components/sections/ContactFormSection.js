"use client";

import { useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection, itemTitle } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

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

function Field({ id, label, required, children }) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300"
      >
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

/**
 * Enterprise contact form — left copy/channels, right multi-field inquiry form.
 */
export default function ContactFormSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "contact_form",
  cmsMode,
  onEditField,
}) {
  const body = data?.body || "";
  const successNote =
    data?.success_message ||
    "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.";
  const items = resolveItemsForSection(section_key, mappingItems);

  const [status, setStatus] = useState("idle");
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

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (cmsMode) return;
    if (!form.firstName || !form.email || !form.company || !form.topic || !form.message || !form.consent) {
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

  if (!cmsMode && !section_title && !sub_title && isRichTextEmpty(body) && !items.length) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24 dark:bg-slate-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 12%, color-mix(in oklab, var(--brand) 14%, transparent), transparent 38%), radial-gradient(circle at 92% 88%, color-mix(in oklab, var(--brand) 10%, transparent), transparent 36%)",
        }}
      />

      <SectionWrapper>
        <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5">
            <p className="m-0 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
              Contact
            </p>
            <CmsEditable
              cmsMode={cmsMode}
              field="section_title"
              label="Title"
              onEditField={onEditField}
            >
              {section_title || cmsMode ? (
                <h2 className="mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.65rem] dark:text-white">
                  {section_title || (cmsMode ? "Get in touch" : null)}
                </h2>
              ) : null}
            </CmsEditable>

            <CmsEditable
              cmsMode={cmsMode}
              field="sub_title"
              label="Subtitle"
              onEditField={onEditField}
            >
              {sub_title || cmsMode ? (
                <p className="mt-4 mb-0 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                  {sub_title || (cmsMode ? "Supporting line…" : null)}
                </p>
              ) : null}
            </CmsEditable>

            {!isRichTextEmpty(body) || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="body"
                label="Body"
                onEditField={onEditField}
              >
                <CmsRichText
                  html={body}
                  className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  empty={
                    cmsMode ? (
                      <p className="m-0 text-slate-400 italic">Optional body…</p>
                    ) : null
                  }
                />
              </CmsEditable>
            ) : null}

            <CmsEditable
              cmsMode={cmsMode}
              field="items"
              label="Contact channels"
              onEditField={onEditField}
            >
              <ul className="mt-8 m-0 grid list-none gap-3 p-0">
                {items.map((item, i) => {
                  const title = itemTitle(item) || item.title;
                  const href = String(item.href || "").trim();
                  const Wrapper = href ? "a" : "div";
                  return (
                    <li key={item._id || item.id || i}>
                      <Wrapper
                        {...(href
                          ? {
                              href,
                              className:
                                "flex flex-col rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 no-underline transition hover:border-brand/40 dark:border-slate-700 dark:bg-slate-900/80",
                            }
                          : {
                              className:
                                "flex flex-col rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/80",
                            })}
                      >
                        <span className="text-xs font-semibold tracking-wide text-brand uppercase">
                          {title}
                        </span>
                        {item.subtitle ? (
                          <span className="mt-1 text-sm font-medium text-ink dark:text-white">
                            {item.subtitle}
                          </span>
                        ) : null}
                        {!isRichTextEmpty(item.body) ? (
                          <CmsRichText
                            html={item.body}
                            className="mt-1 text-xs text-slate-500 dark:text-slate-400"
                          />
                        ) : null}
                      </Wrapper>
                    </li>
                  );
                })}
              </ul>
            </CmsEditable>

            <CmsSectionItemsBar
              sectionKey={section_key}
              cmsMode={cmsMode}
              onEditField={onEditField}
              itemCount={items.length}
              className="mt-4"
            />
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] sm:p-7 lg:p-8 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="m-0 text-lg font-semibold text-ink dark:text-white">
                    Send an inquiry
                  </h3>
                  <p className="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">
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
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
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
                    <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand"
                        checked={form.consent}
                        onChange={(e) => update("consent", e.target.checked)}
                        required
                      />
                      <span>
                        I agree to be contacted about SkillHub products and services.
                        You can unsubscribe at any time.
                      </span>
                    </label>
                  </div>

                  {status === "error" ? (
                    <p className="sm:col-span-2 m-0 text-sm text-red-600 dark:text-red-400">
                      Please complete the required fields and consent checkbox.
                    </p>
                  ) : null}

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={status === "submitting" || cmsMode}
                      className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "submitting" ? "Sending…" : "Submit inquiry"}
                    </button>
                    <p className="m-0 text-xs text-slate-500 dark:text-slate-400">
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
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
