import HorizonGalleryUi from "./HorizonGalleryUi";
import { resolveHorizonGalleryPanelUiItems } from "./lib/map";
import { isHorizonGalleryPlacementShowable } from "./lib/placement";
import type { HorizonGallerySectionProps } from "./lib/types";

export default function HorizonGalleryPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "horizon_gallery",
  id,
}: HorizonGallerySectionProps) {
  if (!isHorizonGalleryPlacementShowable({ items: mappingItems }, false)) {
    return null;
  }

  const items = resolveHorizonGalleryPanelUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <HorizonGalleryUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
