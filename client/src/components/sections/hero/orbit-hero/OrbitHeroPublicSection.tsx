import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { mediaAlt } from "@/lib/utils/media-alt";
import OrbitHeroUi from "./OrbitHeroUi";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { OrbitHeroSectionProps } from "./lib/types";

/** Public orbit_hero — maps placement props → {@link OrbitHeroUi}. */
export default function OrbitHeroPublicSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: OrbitHeroSectionProps) {
  const props = {
    section_title,
    sub_title,
    section_img_url,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("orbit_hero", props, false)) {
    return null;
  }

  const imageUrl = resolveHeroImageUrl(section_img_url, data);
  const badge = data?.label || data?.eyebrow || "";

  return (
    <OrbitHeroUi
      id={id}
      imageUrl={imageUrl}
      imageAlt={mediaAlt(section_title, "Product preview")}
      badge={badge || undefined}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-8",
        buttonsClassName: "flex flex-wrap items-center justify-center gap-3",
      })}
    />
  );
}
