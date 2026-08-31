"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import TimelineVerticalUi from "./TimelineVerticalUi";
import { resolveTimelineStepUiItems } from "./lib/map";
import { isTimelineVerticalPlacementShowable } from "./lib/placement";
import type { TimelineVerticalSectionProps } from "./lib/types";

/**
 * CMS-only vertical timeline adapter → {@link TimelineVerticalUi}.
 * Public pages use {@link TimelineVerticalPublicSection}.
 */
export default function TimelineVerticalSection({
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "timeline_vertical",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TimelineVerticalSectionProps) {
  const items = resolveTimelineStepUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });
  const eyebrow = (in_page_nav_title || "").trim();

  if (
    !isTimelineVerticalPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        in_page_nav_title,
        items: mappingItems,
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
    <TimelineVerticalUi
      id={id}
      preview
      eyebrowSlot={
        <CmsEditable
          cmsMode
          field="in_page_nav_title"
          label="Eyebrow"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          {eyebrow ? (
            <p
              className={`m-0 text-[11px] font-semibold tracking-[0.22em] uppercase ${
                onDarkBand ? "text-white/50" : "text-brand"
              }`}
            >
              {eyebrow}
            </p>
          ) : (
            <p className="section-theme-placeholder m-0 text-[11px] font-semibold tracking-[0.22em] uppercase italic">
              Add eyebrow…
            </p>
          )}
        </CmsEditable>
      }
      {...cmsSectionHeaderSlots({
        section_title,
        sub_title,
        onEditField,
        inverted: onDarkBand,
      })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
        onDarkBand: onDarkBand,
      })}

    />
  );
}
