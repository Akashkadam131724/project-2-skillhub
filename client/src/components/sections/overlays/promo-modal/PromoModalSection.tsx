"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import SectionButtons from "@/components/ui/SectionButtons";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <PromoModalCmsPreview
      delayMs={delayMs}
      storageKey={storageKey}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading mt-2 text-xl font-semibold">
              {section_title}
            </h2>
          ) : (
            <h2 className="section-theme-placeholder mt-2 text-xl font-semibold italic">
              Modal title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-placeholder mt-1 text-sm italic">
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
      footer={
        list.length ? (
          <div className="mt-4">
            <SectionButtons buttons={list} onFormOpen={onFormOpen} />
          </div>
        ) : null
      }
    />
  );
}
