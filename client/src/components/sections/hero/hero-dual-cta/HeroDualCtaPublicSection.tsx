import HeroDualCtaUi from "./HeroDualCtaUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroDualCtaSectionProps } from "./lib/types";

/** Public hero_dual_cta — maps placement props → {@link HeroDualCtaUi}. */
export default function HeroDualCtaPublicSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroDualCtaSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    section_img_url,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_dual_cta", props, false)) {
    return null;
  }

  return (
    <HeroDualCtaUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      imageUrl={resolveHeroImageUrl(section_img_url, data)}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-3",
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
