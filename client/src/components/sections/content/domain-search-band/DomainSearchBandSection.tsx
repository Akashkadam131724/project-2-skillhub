"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import DomainSearchBandUi from "./DomainSearchBandUi";
import { resolveDomainChipUiItems } from "./lib/map";
import { isDomainSearchBandPlacementShowable } from "./lib/placement";
import type { DomainSearchBandSectionProps } from "./lib/types";

export default function DomainSearchBandSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "domain_search_band",
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
  id,
}: DomainSearchBandSectionProps) {
  const items = resolveDomainChipUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const domain = data?.domain || "yourbrand.com";

  if (
    !isDomainSearchBandPlacementShowable(
      {
        section_title,
        sub_title,
        items: mappingItems,
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
    <DomainSearchBandUi
      id={id}
      domain={domain}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title || cmsMode ? (
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {section_title || "Find your domain"}
            </h2>
          ) : null}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title || cmsMode ? (
            <p className="mt-3 mb-0 max-w-md text-base text-white/65">
              {sub_title ||
                "Search for a name that makes your idea official."}
            </p>
          ) : null}
        </CmsEditable>
      }
      items={items}
      emptyState={
        cmsMode ? (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        ) : null
      }
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className="mt-4 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_p]:text-white/70"
        />
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted
          className="mt-8"
        />
      }
    />
  );
}
