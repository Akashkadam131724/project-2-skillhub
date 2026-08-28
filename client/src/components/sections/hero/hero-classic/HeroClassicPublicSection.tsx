import HeroClassicUi from "./HeroClassicUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { resolveHeroImageUrl } from "@/components/sections/hero/shared/lib/public-map";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroClassicSectionProps } from "./lib/types";

/** Public hero_classic — maps placement props → {@link HeroClassicUi}. */
export default function HeroClassicPublicSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroClassicSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    section_img_url,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_classic", props, false)) {
    return null;
  }

  return (
    <HeroClassicUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      imageUrl={resolveHeroImageUrl(section_img_url, data)}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-7 flex flex-wrap items-center gap-3 sm:mt-8",
      })}
    />
  );
}
