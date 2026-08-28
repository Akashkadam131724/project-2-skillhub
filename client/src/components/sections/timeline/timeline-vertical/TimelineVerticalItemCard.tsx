"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { itemTitle } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TimelineStepUiItem } from "./lib/types";

export type TimelineVerticalItemCardProps = {
  item?: TimelineStepUiItem | Record<string, unknown> | null;
  index?: number;
  preview?: boolean;
};

export default function TimelineVerticalItemCard({
  item,
  index = 0,
  preview = false,
}: TimelineVerticalItemCardProps) {
  const row = (item || {}) as TimelineStepUiItem & Record<string, unknown>;
  const title = row.title || itemTitle(row) || "";
  const subtitle = String(row.subtitle || "");
  const body = String(row.body || "");

  return (
    <article className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        {subtitle ? (
          <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            {subtitle}
          </p>
        ) : preview ? (
          <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-400 uppercase italic">
            <CardPlaceholder>Date / phase…</CardPlaceholder>
          </p>
        ) : null}
        <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
          {title || (preview ? <CardPlaceholder>Milestone…</CardPlaceholder> : null)}
        </h3>
        {!isRichTextEmpty(body) ? (
          <CmsRichText
            html={body}
            className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
          />
        ) : preview ? (
          <p className="m-0 text-xs text-slate-400">
            <CardPlaceholder>Description…</CardPlaceholder>
          </p>
        ) : null}
      </div>
    </article>
  );
}
