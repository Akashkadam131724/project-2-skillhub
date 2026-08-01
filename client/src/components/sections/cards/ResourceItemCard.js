"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import CardPlaceholder from "./CardPlaceholder";

export default function ResourceItemCard({ item, preview = false }) {
  const title = itemTitle(item) || item.label;
  const desc = item.body || item.subtitle;

  return (
    <div>
      {item.href ? (
        <a
          href={item.href}
          className="text-sm font-medium text-brand no-underline"
          onClick={preview ? (e) => e.preventDefault() : undefined}
        >
          {title || (preview ? <CardPlaceholder>Resource name…</CardPlaceholder> : "Resource")}
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {title || (preview ? <CardPlaceholder>Resource name…</CardPlaceholder> : null)}
        </span>
      )}
      {!isRichTextEmpty(desc) ? (
        <CmsRichText html={desc} className="mt-0.5 text-xs text-slate-500" />
      ) : null}
      {Array.isArray(item.buttons) && item.buttons.length ? (
        <SectionButtons
          buttons={item.buttons}
          className="mt-2 flex flex-wrap items-center gap-2"
        />
      ) : null}
    </div>
  );
}
