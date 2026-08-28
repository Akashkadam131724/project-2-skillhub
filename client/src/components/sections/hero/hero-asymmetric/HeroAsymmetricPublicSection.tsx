import HeroAsymmetricUi from "./HeroAsymmetricUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroAsymmetricSectionProps } from "./lib/types";

/** Public hero_asymmetric — maps placement props → {@link HeroAsymmetricUi}. */
export default function HeroAsymmetricPublicSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroAsymmetricSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_asymmetric", props, false)) {
    return null;
  }

  return (
    <HeroAsymmetricUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        inverted: true,
        className: "mt-0 flex flex-col items-stretch gap-3",
      })}
    />
  );
}
