"use client";

import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import NewsletterBandUi from "./NewsletterBandUi";
import { isNewsletterBandPlacementShowable } from "./lib/placement";
import type { NewsletterBandSectionProps } from "./lib/types";

export default function NewsletterBandSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
  id,
}: NewsletterBandSectionProps) {
  const placeholder = data.email_placeholder || "Work email";

  if (
    !isNewsletterBandPlacementShowable(
      {
        section_title,
        sub_title,
        buttons,
        button_title,
        target_url,
      },
      cmsMode
    )
  ) {
    return null;
  }

  return (
    <NewsletterBandUi
      id={id}
      eyebrow="Stay in the loop"
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        cmsMode,
      })}
      placeholder={placeholder}
      readOnly={!cmsMode}
      formFooter={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="shrink-0"
          buttonsClassName="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap"
        />
      }
    />
  );
}
