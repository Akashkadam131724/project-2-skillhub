"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TestimonialUiItem } from "./lib/types";

export type TestimonialItemCardProps = {
  item?: TestimonialUiItem | Record<string, unknown> | null;
  preview?: boolean;
};

export default function TestimonialItemCard({
  item,
  preview = false,
}: TestimonialItemCardProps) {
  const row = (item || {}) as TestimonialUiItem & Record<string, unknown>;
  const quote =
    row.quote || String(row.body || "");
  const author =
    row.author || String(row.title || "");

  return (
    <blockquote className="section-ui-card m-0 rounded-xl border p-4">
      {!isRichTextEmpty(quote) || preview ? (
        <CmsRichText
          html={quote}
          className="text-sm text-slate-700 italic dark:text-slate-200"
          empty={
            preview ? (
              <p className="m-0 text-sm text-slate-700 italic dark:text-slate-200">
                “<CardPlaceholder>Quote…</CardPlaceholder>”
              </p>
            ) : null
          }
        />
      ) : null}
      {author || preview ? (
        <footer className="mt-2 text-xs font-semibold text-slate-500">
          — {author || <CardPlaceholder>Author</CardPlaceholder>}
        </footer>
      ) : null}
    </blockquote>
  );
}
