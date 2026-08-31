import HeroSplitUi from "./HeroSplitUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroSplitSectionProps } from "./lib/types";

/** Public hero_split — maps placement props → {@link HeroSplitUi}. */
export default function HeroSplitPublicSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroSplitSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    section_img_url,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_split", props, false)) {
    return null;
  }

  return (
    <HeroSplitUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      imageUrl={resolveHeroImageUrl(section_img_url, data)}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-2",
        buttonsClassName: "flex flex-wrap items-center gap-3",
      })}
    />
  );
}
