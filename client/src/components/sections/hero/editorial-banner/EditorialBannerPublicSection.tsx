import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { mediaAlt } from "@/lib/utils/media-alt";
import EditorialBannerUi from "./EditorialBannerUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { EditorialBannerSectionProps } from "./lib/types";

/** Public editorial_banner — maps placement props → {@link EditorialBannerUi}. */
export default function EditorialBannerPublicSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: EditorialBannerSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("editorial_banner", props, false)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);

  return (
    <EditorialBannerUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Editorial banner")}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-8",
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
