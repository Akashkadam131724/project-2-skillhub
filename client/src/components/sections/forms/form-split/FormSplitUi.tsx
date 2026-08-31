"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionLayoutRoot } from "@/components/sections/layout";
import { SectionBrandGlow, SectionLightCard } from "@/components/sections/shared/design";
import { DS_RADIUS, DS_TEXT, sectionClassNames } from "@/lib/sections/section-design-system";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import ShortLeadForm from "./ShortLeadForm";
import { normalizeFormContentSide } from "./lib/content-side";
import type { FormSplitUiProps } from "./lib/types";

export default function FormSplitUi({
  id,
  className = "",
  contentSide = "left",
  title,
  subtitle,
  body = "",
  contentSideSlot,
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
  highlights = [],
  highlightsSlot,
  itemsBar,
  formSlot,
  formTitle = "Send a message",
  formSubtitle = "",
  formKey = "lead",
  submitLabel = "Submit",
  successMessage,
  cmsMode = false,
}: FormSplitUiProps) {
  const side = normalizeFormContentSide({ content_side: contentSide });
  const formOnLeft = side === "right";
  const showBody = bodySlot != null || !isRichTextEmpty(body);
  const showHighlights = highlightsSlot != null || highlights.length > 0;

  const contentCol = (
    <div className="min-w-0 lg:sticky lg:top-[calc(var(--site-header-h,4.25rem)+2rem)] lg:self-start">
      {contentSideSlot}

      <p className={DS_TEXT.eyebrow}>Contact</p>

      {titleSlot ??
        (title ? (
          <h2
            className={`mt-3 mb-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight ${DS_TEXT.heading} sm:text-4xl`}
          >
            {title}
          </h2>
        ) : null)}

      {subtitleSlot ??
        (subtitle ? (
          <p
            className={`${DS_TEXT.muted} mt-4 mb-0 text-base leading-relaxed sm:text-lg`}
          >
            {subtitle}
          </p>
        ) : null)}

      {showBody ? (
        bodySlot ?? (
          <CmsRichText
            html={body}
            className={`${DS_TEXT.muted} mt-4 text-sm leading-relaxed`}
          />
        )
      ) : null}

      {footer}

      {itemsBar}

      {showHighlights ? (
        highlightsSlot ?? (
          <ul className="m-0 mt-4 grid list-none gap-3 p-0">
            {highlights.map((item, i) => (
              <li key={item.id ?? i}>
                <SectionLightCard
                  className={sectionClassNames(
                    DS_RADIUS.nested,
                    "px-4 py-3 shadow-none"
                  )}
                >
                  {item.title ? (
                    <span className={`text-sm font-semibold ${DS_TEXT.heading}`}>
                      {item.title}
                    </span>
                  ) : null}
                  {item.subtitle ? (
                    <span className={`mt-1 block text-sm ${DS_TEXT.muted}`}>
                      {item.subtitle}
                    </span>
                  ) : null}
                </SectionLightCard>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  );

  const formCol = (
    <div className="min-w-0">
      {formSlot ?? (
        <ShortLeadForm
          cmsMode={cmsMode}
          formKey={formKey}
          formTitle={formTitle}
          formSubtitle={formSubtitle}
          successMessage={successMessage}
          submitLabel={submitLabel}
        />
      )}
    </div>
  );

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      decor={<SectionBrandGlow />}
      hasBodyContent
    >
      <div className="relative grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className={formOnLeft ? "lg:order-1" : "lg:order-2"}>
          {formOnLeft ? formCol : contentCol}
        </div>
        <div className={formOnLeft ? "lg:order-2" : "lg:order-1"}>
          {formOnLeft ? contentCol : formCol}
        </div>
      </div>
    </SectionLayoutRoot>
  );
}
