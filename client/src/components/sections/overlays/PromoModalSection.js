"use client";

import { useEffect, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import SectionWrapper from "../SectionWrapper";
import { sortActiveButtons, buttonsFromLegacy } from "@/lib/utils/button-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";

/**
 * Timed promo modal — section-level CTAs inside the dialog; optional dismiss cookie via data.storage_key.
 */
export default function PromoModalSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  cmsMode = false,
  onEditField,
  onFormOpen,
}) {
  const delayMs = Math.max(0, Number(data.open_delay_ms) || 2500);
  const storageKey = String(data.storage_key || "skillhub_promo_modal").trim();
  const body = data.body || "";

  const [open, setOpen] = useState(false);
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  useEffect(() => {
    if (cmsMode) return undefined;
    if (storageKey && typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(storageKey) === "1") return undefined;
      } catch {
        /* ignore */
      }
    }
    const t = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(t);
  }, [cmsMode, delayMs, storageKey]);

  function dismiss() {
    setOpen(false);
    if (storageKey && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
    }
  }

  if (cmsMode) {
    return (
      <section className="border-b border-dashed border-violet-200 bg-violet-50/80 py-8 dark:border-violet-900 dark:bg-violet-950/30">
        <SectionWrapper>
          <p className="m-0 text-[11px] font-semibold tracking-wide text-violet-700 uppercase dark:text-violet-300">
            Promo modal (overlay)
          </p>
          <h2 className="mt-2 text-xl font-semibold section-theme-heading">
            {section_title || "Modal title…"}
          </h2>
          {sub_title ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{sub_title}</p>
          ) : null}
          <p className="mt-3 text-xs text-slate-500">
            Opens after <strong>{delayMs}ms</strong> on the live page. Dismiss uses session key{" "}
            <code className="rounded bg-white/80 px-1 dark:bg-slate-900">{storageKey}</code>.
          </p>
          {list.length ? (
            <div className="mt-4">
              <SectionButtons buttons={list} onFormOpen={onFormOpen} />
            </div>
          ) : null}
        </SectionWrapper>
      </section>
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        aria-label="Close"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl section-ui-card border shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          aria-label="Close dialog"
        >
          ×
        </button>
        <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
          {section_title ? (
            <h2
              id="promo-modal-title"
              className="m-0 pr-8 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight section-theme-heading"
            >
              {section_title}
            </h2>
          ) : null}
          {sub_title ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{sub_title}</p>
          ) : null}
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="mt-4 text-[15px] leading-relaxed section-theme-muted"
            />
          ) : null}
          {list.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <SectionButtons buttons={list} onFormOpen={onFormOpen} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
