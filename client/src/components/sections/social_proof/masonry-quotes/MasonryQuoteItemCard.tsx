"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import StarSparkleIcon from "@/components/icons/StarSparkleIcon";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { MasonryQuoteUiItem } from "./lib/types";

export type MasonryQuoteItemCardProps = {
  item?: MasonryQuoteUiItem | Record<string, unknown> | null;
  preview?: boolean;
  revealDelayMs?: number;
  visible?: boolean;
};

export default function MasonryQuoteItemCard({
  item,
  preview = false,
  revealDelayMs = 0,
  visible = true,
}: MasonryQuoteItemCardProps) {
  const row = (item || {}) as MasonryQuoteUiItem;
  const quote = row.quote || String((item as Record<string, unknown>)?.body || "");
  const author = row.author || String((item as Record<string, unknown>)?.subtitle || "");
  const role = row.role || String((item as Record<string, unknown>)?.value || "");
  const avatarUrl = row.avatarUrl;
  const initial = row.avatarInitial || author.slice(0, 1) || "?";

  return (
    <li
      className={`mb-4 break-inside-avoid list-none transition duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${revealDelayMs}ms` }}
    >
      <article
        data-section-surface="light-card"
        data-light-surface=""
        className="section-light-card section-ui-card rounded-2xl border p-5 shadow-sm"
      >
        <div className="text-brand mb-3 flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, s) => (
            <StarSparkleIcon key={s} />
          ))}
        </div>
        {!isRichTextEmpty(quote) ? (
          <CmsRichText
            html={quote}
            className="section-theme-muted text-[15px] leading-relaxed"
          />
        ) : preview ? (
          <p className="section-theme-muted m-0 text-[15px] leading-relaxed">
            <CardPlaceholder>Quote…</CardPlaceholder>
          </p>
        ) : null}
        <div className="mt-5 flex items-center gap-3">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={author || "Author"}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="bg-ink inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <p className="section-theme-heading m-0 truncate text-sm font-semibold">
              {author || (preview ? <CardPlaceholder>Author</CardPlaceholder> : null)}
            </p>
            {role || preview ? (
              <p className="section-theme-subtle m-0 truncate text-xs">
                {role || (preview ? <CardPlaceholder>Role</CardPlaceholder> : null)}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </li>
  );
}
