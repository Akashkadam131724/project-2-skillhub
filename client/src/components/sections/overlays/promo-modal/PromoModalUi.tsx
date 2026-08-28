"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { PromoModalUiProps } from "./lib/types";

/** Live fixed overlay dialog for promo modal. */
export default function PromoModalUi({
  open,
  onDismiss,
  title,
  subtitle,
  body = "",
  footer = null,
  id,
}: PromoModalUiProps) {
  if (!open) return null;

  const titleId = id ? `${id}-title` : "promo-modal-title";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="bg-ink/55 absolute inset-0 backdrop-blur-sm"
        aria-label="Close"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="section-ui-card relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          aria-label="Close dialog"
        >
          ×
        </button>
        <div className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10">
          {title ? (
            <h2
              id={titleId}
              className="section-theme-heading m-0 pr-8 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight"
            >
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="section-theme-muted mt-4 text-[15px] leading-relaxed"
            />
          ) : null}
          {footer}
        </div>
      </div>
    </div>
  );
}
