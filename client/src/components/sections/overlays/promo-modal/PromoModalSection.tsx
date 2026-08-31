"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import PromoModalCmsPreview from "./PromoModalCmsPreview";
import { resolvePromoModalConfig } from "./lib/map";
import { isPromoModalPlacementShowable } from "./lib/placement";
import type { PromoModalSectionProps } from "./lib/types";

/** CMS-only promo modal adapter → {@link PromoModalCmsPreview}. */
export default function PromoModalSection({
  section_title,
  sub_title,
  data = {},
  buttons,
  button_title,
  target_url,
  onEditField,
  onFormOpen,
}: PromoModalSectionProps) {
  const { delayMs, storageKey } = resolvePromoModalConfig(data);

  if (
    !isPromoModalPlacementShowable(
      {
        section_title,
        sub_title,
        data,
        buttons,
        button_title,
        target_url,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <PromoModalCmsPreview
      delayMs={delayMs}
      storageKey={storageKey}
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      footer={
        cmsSectionChrome({
          section_key: "promo_modal",
          itemCount: 0,
          onEditField,
          buttons,
          button_title,
          target_url,
          onFormOpen,
          footerClassName: "mt-4",
          withItems: false,
        }).footer
      }
    />
  );
}
