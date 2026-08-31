import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { mediaAlt } from "@/lib/utils/media-alt";
import SiteBuilderHeroUi from "./SiteBuilderHeroUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { SiteBuilderHeroSectionProps } from "./lib/types";

/** Public site_builder_hero — maps placement props → {@link SiteBuilderHeroUi}. */
export default function SiteBuilderHeroPublicSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: SiteBuilderHeroSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("site_builder_hero", props, false)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  return (
    <SiteBuilderHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Site preview")}
      badge={badge || undefined}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        inverted: true,
        className: "mt-9",
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
