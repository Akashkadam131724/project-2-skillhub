import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
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
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);
  const showHeader = Boolean(showEyebrow || showTitle || showSubtitle);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              items.length || itemsBar || emptyState || footer
                ? "mb-8 sm:mb-10"
                : ""
            }`}
          >
            {eyebrowSlot != null ? (
              eyebrowSlot
            ) : showEyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitleSlot != null ? (
              subtitleSlot
            ) : showSubtitle ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {itemsBar}

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

        {footer}
      </SectionWrapper>
    </section>
  );
}
