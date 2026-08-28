import TemplateGalleryUi from "./TemplateGalleryUi";
import { resolveTemplateGalleryUiItems } from "./lib/map";
import { isTemplateGalleryPlacementShowable } from "./lib/placement";
import type { TemplateGallerySectionProps } from "./lib/types";

export default function TemplateGalleryPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "template_gallery",
  id,
}: TemplateGallerySectionProps) {
  if (!isTemplateGalleryPlacementShowable({ items: mappingItems }, false)) {
    return null;
  }

  const items = resolveTemplateGalleryUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <TemplateGalleryUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
    />
  );
}
