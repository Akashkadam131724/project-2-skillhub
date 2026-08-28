"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
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
        eyebrow ? (
          <CmsEditable
            cmsMode
            field="in_page_nav_title"
            label="Eyebrow"
            onEditField={onEditField}
            inverted={onDarkBand}
          >
            <p
              className={`m-0 text-[11px] font-semibold tracking-[0.22em] uppercase ${
                onDarkBand ? "text-white/50" : "text-brand"
              }`}
            >
              {eyebrow}
            </p>
          </CmsEditable>
        ) : (
          <CmsEditable
            cmsMode
            field="in_page_nav_title"
            label="Eyebrow"
            onEditField={onEditField}
            inverted={onDarkBand}
          >
            <p className="section-theme-placeholder m-0 text-[11px] font-semibold tracking-[0.22em] uppercase italic">
              Add eyebrow…
            </p>
          </CmsEditable>
        )
      }
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
              Add title…
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
            <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
      items={items}
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted={onDarkBand}
        />
      }
    />
  );
}
