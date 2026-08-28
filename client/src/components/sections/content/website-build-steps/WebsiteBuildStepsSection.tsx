"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import WebsiteBuildStepsUi from "./WebsiteBuildStepsUi";
import { resolveWebsiteBuildStepUiItems } from "./lib/map";
import { isWebsiteBuildStepsPlacementShowable } from "./lib/placement";
import type { WebsiteBuildStepsSectionProps } from "./lib/types";

export default function WebsiteBuildStepsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "website_build_steps",
  cmsMode,
  onEditField,
  id,
}: WebsiteBuildStepsSectionProps) {
  const items = resolveWebsiteBuildStepUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isWebsiteBuildStepsPlacementShowable({ items: mappingItems }, cmsMode)
  ) {
    return null;
  }

  return (
    <WebsiteBuildStepsUi
      id={id}
      preview
      items={items}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
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
          cmsMode={cmsMode}
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
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
    />
  );
}
