import HeroGradientSliderStatic from "./HeroGradientSliderStatic";

type HeroGradientSliderPublicSectionProps = {
  id?: string;
};

/**
 * Public hero_gradient_slider — static demo content until CMS map is wired.
 * DB placement only needs section_key (and optional render_key) set.
 */
export default function HeroGradientSliderPublicSection({
  id,
}: HeroGradientSliderPublicSectionProps) {
  return <HeroGradientSliderStatic id={id} />;
}
