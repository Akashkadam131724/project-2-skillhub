"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemAnswer, itemQuestion } from "@/lib/sections/item-types";
import CardPlaceholder from "./CardPlaceholder";

/** Shared FAQ accordion row — used on page + CMS preview */
export default function FaqItemCard({
  item,
  preview = false,
  index = 0,
  onDarkBand = false,
}) {
  const q = itemQuestion(item);
  const a = itemAnswer(item);
  const hasButtons = Array.isArray(item.buttons) && item.buttons.length > 0;
  const n = String((index ?? 0) + 1).padStart(2, "0");

  return (
    <div
      {...(onDarkBand
        ? { "data-section-surface": "glass-card" }
        : { "data-section-surface": "light-card", "data-light-surface": "" })}
      className={`section-ui-card overflow-hidden rounded-[1.25rem] border shadow-[0_12px_40px_-32px_rgba(0,0,0,0.45)] ${
        onDarkBand ? "section-glass-card-shell" : "section-light-card"
      }`}
    >
      <details open={preview || undefined} className="group/faq">
        <summary
          className={`flex list-none items-start justify-between gap-4 px-5 py-5 text-left outline-none marker:content-none sm:px-6 [&::-webkit-details-marker]:hidden ${
            preview ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <span className="flex min-w-0 flex-1 items-start gap-4">
            <span className="section-faq-index mt-0.5 shrink-0 font-[family-name:var(--font-display)] text-lg font-semibold">
              {n}
            </span>
            <span className="min-w-0 flex-1 text-base font-semibold leading-snug tracking-tight section-theme-heading sm:text-lg">
              {q || (preview ? <CardPlaceholder>Question…</CardPlaceholder> : null)}
            </span>
          </span>
          <span
            className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-lg leading-none font-light transition group-open/faq:border-brand group-open/faq:bg-brand group-open/faq:text-white ${
              onDarkBand
                ? "border-[color:var(--card-border)] bg-[color:color-mix(in_srgb,var(--card-bg)_80%,transparent)] text-[color:var(--card-fg)]"
                : "border-[color:var(--card-border)] bg-[color:var(--ds-light-field-bg)] text-[color:var(--ds-light-card-fg)]"
            }`}
            aria-hidden
          >
            <span className="group-open/faq:hidden">+</span>
            <span className="hidden group-open/faq:inline">−</span>
          </span>
        </summary>
        {(!isRichTextEmpty(a) || preview || hasButtons) && (
          <div className="border-t px-5 pb-5 sm:px-6 sm:pb-6 border-[color:var(--card-border)]">
            <div className="pt-4 pl-10 sm:pl-12">
              {!isRichTextEmpty(a) || preview ? (
                <CmsRichText
                  html={a}
                  className="section-theme-muted text-[15px] leading-relaxed sm:text-base"
                  empty={
                    preview ? (
                      <p className="section-theme-muted m-0 text-[15px] leading-relaxed sm:text-base">
                        <CardPlaceholder>Answer…</CardPlaceholder>
                      </p>
                    ) : null
                  }
                />
              ) : null}
              {hasButtons ? (
                <div className="mt-4">
                  <SectionButtons
                    buttons={item.buttons}
                    inverted={onDarkBand}
                    className="flex flex-wrap items-center gap-2"
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </details>
    </div>
  );
}
