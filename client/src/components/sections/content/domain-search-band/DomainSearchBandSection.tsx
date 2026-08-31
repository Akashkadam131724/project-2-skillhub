"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
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
      {...cmsSectionHeaderSlots({
        section_title:
          section_title || (cmsMode ? "Find your domain" : undefined),
        sub_title:
          sub_title ||
          (cmsMode ? "Search for a name that makes your idea official." : undefined),
        onEditField,
        cmsMode,
        inverted: true,
        subtitleClassName: "max-w-md",
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
        footerClassName: "mt-8",
      })}

    />
  );
}
