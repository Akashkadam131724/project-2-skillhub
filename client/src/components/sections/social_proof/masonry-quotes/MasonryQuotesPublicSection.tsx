import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import MasonryQuotesUi from "./MasonryQuotesUi";
import { resolveMasonryQuoteUiItems } from "./lib/map";
import { isMasonryQuotesPlacementShowable } from "./lib/placement";
import type { MasonryQuotesSectionProps } from "./lib/types";

/** Public masonry quotes — maps placement props → {@link MasonryQuotesUi}. */
export default function MasonryQuotesPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "masonry_quotes",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MasonryQuotesSectionProps) {
  if (
    !isMasonryQuotesPlacementShowable(
      {
        section_key,
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

  const items = resolveMasonryQuoteUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <MasonryQuotesUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}
    />
  );
}
