"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import StatsUi from "./StatsUi";
import { resolveStatUiItems } from "./lib/map";
import { isStatsPlacementShowable } from "./lib/placement";
import type { StatsSectionProps } from "./lib/types";

/**
 * CMS-only stats adapter → {@link StatsUi}.
 * Public pages use {@link StatsPublicSection}.
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
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
}: StatsSectionProps) {
  const items = resolveStatUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (
    !isStatsPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
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
    <StatsUi
      id={id}
      preview
      onDarkBand={onDarkBand}
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
          className={
            onDarkBand
              ? "[&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:text-white"
              : undefined
          }
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
