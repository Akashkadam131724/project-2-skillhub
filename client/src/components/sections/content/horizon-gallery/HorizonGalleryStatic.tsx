import HorizonGalleryUi from "./HorizonGalleryUi";
import { HORIZON_GALLERY_STATIC_DEMO } from "./lib/static-demo";

export default function HorizonGalleryStatic() {
  return (
    <HorizonGalleryUi
      title={HORIZON_GALLERY_STATIC_DEMO.section_title}
      subtitle={HORIZON_GALLERY_STATIC_DEMO.sub_title}
      items={HORIZON_GALLERY_STATIC_DEMO.items}
    />
  );
}
