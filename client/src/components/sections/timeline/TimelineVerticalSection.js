"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "../SectionFrame";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { isRichTextEmpty } from "@/lib/utils/rich-text";

export default function TimelineVerticalSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "timeline_vertical",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <ol className="relative m-0 list-none space-y-0 p-0 pl-2 sm:pl-4">
          {items.map((step, i) => {
            const hasButtons =
              Array.isArray(step.buttons) && step.buttons.length > 0;
            const isLast = i === items.length - 1;
            return (
              <li key={step._id || step.id || i} className="relative flex gap-4 pb-10 sm:gap-6">
                {!isLast ? (
                  <span
                    className="absolute top-10 left-[11px] w-px bg-slate-200 sm:left-[15px] dark:bg-slate-700"
                    style={{ height: "calc(100% - 2rem)" }}
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-white text-[11px] font-bold text-brand sm:size-8 sm:text-xs dark:bg-slate-950">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  {step.subtitle ? (
                    <p className="m-0 text-[11px] font-semibold tracking-wide text-brand uppercase">
                      {step.subtitle}
                    </p>
                  ) : null}
                  {step.title ? (
                    <h3 className="m-0 mt-1 text-lg font-semibold section-theme-heading">
                      {step.title}
                    </h3>
                  ) : null}
                  {!isRichTextEmpty(step.body) ? (
                    <CmsRichText
                      html={step.body}
                      className="mt-2 text-[15px] leading-relaxed section-theme-muted"
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
          })}
        </ol>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
