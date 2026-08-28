"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { LearningPathStepUiItem } from "./lib/types";

export type LearningPathStepItemCardProps = {
  item?: LearningPathStepUiItem | Record<string, unknown> | null;
  preview?: boolean;
  index?: number;
};

export default function LearningPathStepItemCard({
  item,
  preview = false,
  index = 0,
}: LearningPathStepItemCardProps) {
  const row = (item || {}) as LearningPathStepUiItem;
  const stepNumber = row.stepNumber ?? index + 1;
  const title = row.title || "";
  const subtitle = row.subtitle || "";
  const body = row.body || String((item as Record<string, unknown>)?.body || "");
  const buttons = Array.isArray(row.buttons) ? row.buttons : [];

  return (
    <article
      data-section-surface="light-card"
      data-light-surface=""
      className="section-light-card section-ui-card flex gap-4 rounded-2xl border p-5 sm:gap-6 sm:p-6"
    >
      <span className="text-brand flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 font-[family-name:var(--font-display)] text-lg font-bold">
        {stepNumber}
      </span>
      <div className="min-w-0 flex-1">
        {title || preview ? (
          <h3 className="section-theme-heading m-0 text-lg font-semibold">
            {title || <CardPlaceholder>Module title</CardPlaceholder>}
          </h3>
        ) : null}
        {subtitle || preview ? (
          <p className="section-theme-muted m-0 mt-1 text-sm">
            {subtitle || (preview ? <CardPlaceholder>Duration</CardPlaceholder> : null)}
          </p>
        ) : null}
        {!isRichTextEmpty(body) || preview ? (
          <CmsRichText
            html={body}
            className="section-theme-muted mt-2 text-[15px] leading-relaxed"
            empty={
              preview ? (
                <p className="section-theme-muted m-0 mt-2 text-[15px] leading-relaxed italic">
                  Description…
                </p>
              ) : null
            }
          />
        ) : null}
        {buttons.length ? (
          <div className="mt-4">
            <SectionButtons buttons={buttons} className="flex flex-wrap gap-2" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
