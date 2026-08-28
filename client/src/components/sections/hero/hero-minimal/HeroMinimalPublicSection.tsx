import HeroMinimalUi from "./HeroMinimalUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroMinimalSectionProps } from "./lib/types";

/** Public hero_minimal — maps placement props → {@link HeroMinimalUi}. */
export default function HeroMinimalPublicSection({
  section_title,
  sub_title,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroMinimalSectionProps) {
  const props = {
    section_title,
    sub_title,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_minimal", props, false)) {
    return null;
  }

  return (
    <HeroMinimalUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-6 flex flex-wrap items-center gap-3",
      })}
    />
  );
}
