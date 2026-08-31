import { SectionLayoutRoot } from "@/components/sections/layout";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TimelineStepUiItem, TimelineVerticalUiProps } from "./lib/types";

function TimelineStepRow({
  step,
  index,
  isLast,
  preview = false,
}: {
  step: TimelineStepUiItem;
  index: number;
  isLast: boolean;
  preview?: boolean;
}) {
  const hasButtons = Array.isArray(step.buttons) && step.buttons.length > 0;

  return (
    <li className="relative flex gap-4 pb-10 sm:gap-6">
      {!isLast ? (
        <span
          className="absolute top-10 left-[11px] w-px bg-slate-200 sm:left-[15px] dark:bg-slate-700"
          style={{ height: "calc(100% - 2rem)" }}
          aria-hidden
        />
      ) : null}
      <span className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-white text-[11px] font-bold text-brand sm:size-8 sm:text-xs dark:bg-slate-950">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {step.subtitle ? (
          <p className="m-0 text-[11px] font-semibold tracking-wide text-brand uppercase">
            {step.subtitle}
          </p>
        ) : preview ? (
          <p className="m-0 text-[11px] font-semibold tracking-wide text-brand/50 uppercase italic">
            <CardPlaceholder>Date / phase…</CardPlaceholder>
          </p>
        ) : null}
        {step.title ? (
          <h3 className="section-theme-heading m-0 mt-1 text-lg font-semibold">
            {step.title}
          </h3>
        ) : preview ? (
          <h3 className="section-theme-placeholder m-0 mt-1 text-lg font-semibold italic">
            <CardPlaceholder>Milestone…</CardPlaceholder>
          </h3>
        ) : null}
        {!isRichTextEmpty(step.body) || preview ? (
          <CmsRichText
            html={step.body}
            className="section-theme-muted mt-2 text-[15px] leading-relaxed"
            empty={
              preview ? (
                <p className="section-theme-placeholder m-0 mt-2 text-[15px] leading-relaxed italic">
                  <CardPlaceholder>Description…</CardPlaceholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {hasButtons ? (
          <div className="mt-3">
            <SectionButtons
              buttons={step.buttons}
              className="flex flex-wrap gap-2"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}

/** Pure vertical timeline layout — no CMS chrome. */
export default function TimelineVerticalUi({
  title,
  subtitle,
  eyebrow,
  eyebrowSlot,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: TimelineVerticalUiProps) {

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      eyebrowSlot={eyebrowSlot}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
{items.length ? (
          <ol className="relative m-0 list-none space-y-0 p-0 pl-2 sm:pl-4">
            {items.map((step, i) => (
              <TimelineStepRow
                key={step.id ?? i}
                step={step}
                index={i}
                isLast={i === items.length - 1}
                preview={preview}
              />
            ))}
          </ol>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
