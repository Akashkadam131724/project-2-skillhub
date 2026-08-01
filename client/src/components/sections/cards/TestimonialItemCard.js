"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import { isRichTextEmpty } from "@/lib/rich-text";
import { itemAuthor, itemQuote } from "@/lib/item-types";
import CardPlaceholder from "./CardPlaceholder";

export default function TestimonialItemCard({ item, preview = false }) {
  const quote = itemQuote(item);
  const author = itemAuthor(item);

  return (
    <blockquote className="m-0 rounded-xl section-ui-card border p-4">
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
      {(author || preview) && (
        <footer className="mt-2 text-xs font-semibold text-slate-500">
          — {author || <CardPlaceholder>Author</CardPlaceholder>}
        </footer>
      )}
    </blockquote>
  );
}
