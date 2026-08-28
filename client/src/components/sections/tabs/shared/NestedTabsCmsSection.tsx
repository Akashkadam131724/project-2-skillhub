"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
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
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={tabs.length}
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
