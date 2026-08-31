import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import DomainSearchBandUi from "./DomainSearchBandUi";
import { resolveDomainChipUiItems } from "./lib/map";
import { isDomainSearchBandPlacementShowable } from "./lib/placement";
import type { DomainSearchBandSectionProps } from "./lib/types";

export default function DomainSearchBandPublicSection({
  section_title,
  sub_title,
  data,
  items: mappingItems,
  section_key = "domain_search_band",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: DomainSearchBandSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveDomainChipUiItems(section_key, mappingItems);

  return (
    <DomainSearchBandUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      domain={data?.domain || "yourbrand.com"}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
        inverted: true,
        className: "mt-8 flex flex-wrap items-center gap-3",
      })}
    />
  );
}
