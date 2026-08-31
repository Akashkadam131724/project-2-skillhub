"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import TabsNestedUi from "./TabsNestedUi";
import { resolveTabUiItems } from "./lib/map";
import { isNestedTabsPlacementShowable } from "./lib/placement";
import type { TabsLayout, TabsSectionProps } from "./lib/types";

export default function NestedTabsCmsSection({
  layout,
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "feature_tabs",
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
}: TabsSectionProps & { layout: TabsLayout }) {
  const tabs = resolveTabUiItems(mappingItems, { cmsMode: true });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });
  const eyebrow = (in_page_nav_title || "").trim();

  if (
    !isNestedTabsPlacementShowable(
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
    <TabsNestedUi
      layout={layout}
      id={id}
      preview
      onFormOpen={onFormOpen}
      tabs={tabs}
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

          {...cmsSectionChrome({
        section_key,
        itemCount: tabs.length,
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
