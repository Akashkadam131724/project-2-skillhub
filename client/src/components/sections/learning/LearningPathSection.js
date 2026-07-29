"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "../SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

export default function LearningPathSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "learning_path",
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
      eyebrow="Learning path"
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
        <div className="flex flex-col gap-4">
          {items.map((step, i) => {
            const hasButtons =
              Array.isArray(step.buttons) && step.buttons.length > 0;
            return (
              <article
                key={step._id || step.id || i}
                data-section-surface="light-card"
                data-light-surface=""
                className="section-light-card flex gap-4 rounded-2xl section-ui-card border p-5 sm:gap-6 sm:p-6"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 font-[family-name:var(--font-display)] text-lg font-bold text-brand">
                  {step.value || i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {step.title ? (
                    <h3 className="m-0 text-lg font-semibold section-theme-heading">
                      {step.title}
                    </h3>
                  ) : null}
                  {step.subtitle ? (
                    <p className="section-theme-muted m-0 mt-1 text-sm">{step.subtitle}</p>
                  ) : null}
                  {!isRichTextEmpty(step.body) ? (
                    <CmsRichText
                      html={step.body}
                      className="mt-2 text-[15px] leading-relaxed section-theme-muted"
                    />
                  ) : null}
                  {hasButtons ? (
                    <div className="mt-4">
                      <SectionButtons
                        buttons={step.buttons}
                        className="flex flex-wrap gap-2"
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
