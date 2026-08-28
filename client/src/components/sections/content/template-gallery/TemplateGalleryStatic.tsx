import TemplateGalleryUi from "./TemplateGalleryUi";
import { TEMPLATE_GALLERY_STATIC_DEMO } from "./lib/static-demo";

export default function TemplateGalleryStatic() {
  return (
    <TemplateGalleryUi
      title={TEMPLATE_GALLERY_STATIC_DEMO.section_title}
      subtitle={TEMPLATE_GALLERY_STATIC_DEMO.sub_title}
      items={TEMPLATE_GALLERY_STATIC_DEMO.items}
    />
  );
}
