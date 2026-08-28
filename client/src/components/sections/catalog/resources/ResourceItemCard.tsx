"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";

export type ResourceItemCardProps = {
  item?: {
    label?: string;
    body?: string;
    subtitle?: string;
    href?: string;
    buttons?: unknown[];
    [key: string]: unknown;
  } | null;
  title?: string;
  body?: string;
  href?: string;
  buttons?: unknown[];
  preview?: boolean;
};

/**
 * Resource row — prefer plain title/body/href/buttons; `item` for CMS previews.
 */
export default function ResourceItemCard({
  item,
  title,
  body,
  href,
  buttons,
  preview = false,
}: ResourceItemCardProps) {
  const resolvedTitle = title ?? (item ? itemTitle(item) || item.label : "");
  const desc = body ?? (item ? item.body || item.subtitle : "");
  const link = href ?? (item ? item.href : "");
  const list = Array.isArray(buttons)
    ? buttons
    : Array.isArray(item?.buttons)
      ? item.buttons
      : [];

  return (
    <div>
      {link ? (
        <a
          href={link}
          className="text-sm font-medium text-brand no-underline"
          onClick={preview ? (e) => e.preventDefault() : undefined}
        >
          {resolvedTitle ||
            (preview ? (
              <CardPlaceholder>Resource name…</CardPlaceholder>
            ) : (
              "Resource"
            ))}
        </a>
      ) : (
        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {resolvedTitle ||
            (preview ? (
              <CardPlaceholder>Resource name…</CardPlaceholder>
            ) : null)}
        </span>
      )}
      {!isRichTextEmpty(desc) ? (
        <CmsRichText html={desc} className="mt-0.5 text-xs text-slate-500" />
      ) : null}
      {list.length ? (
        <SectionButtons
          buttons={list}
          className="mt-2 flex flex-wrap items-center gap-2"
        />
      ) : null}
    </div>
  );
}
