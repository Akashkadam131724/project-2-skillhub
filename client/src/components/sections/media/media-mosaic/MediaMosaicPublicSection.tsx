import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import MediaMosaicUi from "./MediaMosaicUi";
import { resolveMediaMosaicTileUiItems } from "./lib/map";
import { isMediaMosaicPlacementShowable } from "./lib/placement";
import type { MediaMosaicSectionProps } from "./lib/types";

/** Public media mosaic — maps placement props → {@link MediaMosaicUi}. */
export default function MediaMosaicPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "media_mosaic",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: MediaMosaicSectionProps) {
  if (
    !isMediaMosaicPlacementShowable(
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

  const items = resolveMediaMosaicTileUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <MediaMosaicUi
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
