"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import PartnersMarqueeUi from "./PartnersMarqueeUi";
import { resolvePartnerLogoUiItems } from "./lib/map";
import { isPartnersMarqueePlacementShowable } from "./lib/placement";
import type { PartnersMarqueeSectionProps } from "./lib/types";

/** CMS-only partners marquee adapter → {@link PartnersMarqueeUi}. */
export default function PartnersMarqueeSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "partners_marquee",
  onEditField,
  id,
}: PartnersMarqueeSectionProps) {
  const items = resolvePartnerLogoUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isPartnersMarqueePlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
      },
      true
    )
  ) {
    return null;
  }

  const showTitle = true;
  const showSubtitle = true;

  return (
    <PartnersMarqueeUi
      id={id}
      preview
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
          className="mb-4"
        />
      }
      eyebrowSlot={
        <p className="text-brand m-0 text-[11px] font-semibold tracking-[0.22em] uppercase">
          Ecosystem
        </p>
      }
      titleSlot={
        showTitle ? (
          <CmsEditable
            cmsMode
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title ? (
              <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {section_title}
              </h2>
            ) : (
              <h2 className="m-0 text-3xl font-semibold text-slate-300 italic dark:text-slate-600">
                Add title…
              </h2>
            )}
          </CmsEditable>
        ) : null
      }
      subtitleSlot={
        showSubtitle ? (
          <CmsEditable
            cmsMode
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {sub_title}
              </p>
            ) : (
              <p className="m-0 text-base text-slate-300 italic dark:text-slate-600">
                Add subtitle…
              </p>
            )}
          </CmsEditable>
        ) : null
      }
      items={items}
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
