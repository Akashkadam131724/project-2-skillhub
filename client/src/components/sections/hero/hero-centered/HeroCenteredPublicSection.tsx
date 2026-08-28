import HeroCenteredUi from "./HeroCenteredUi";
import { heroLayoutPublicFooter } from "@/components/sections/hero/shared/hero-layout-public";
import { isHeroPlacementShowable } from "@/components/sections/hero/shared/lib/placement";
import type { HeroCenteredSectionProps } from "./lib/types";

/** Public hero_centered — maps placement props → {@link HeroCenteredUi}. */
export default function HeroCenteredPublicSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: HeroCenteredSectionProps) {
  const props = {
    section_title,
    sub_title,
    data,
    buttons,
    button_title,
    target_url,
  };

  if (!isHeroPlacementShowable("hero_centered", props, false)) {
    return null;
  }

  return (
    <HeroCenteredUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      body={data?.body}
      footer={heroLayoutPublicFooter(props, {
        onFormOpen,
        className: "mt-8 flex flex-wrap items-center justify-center gap-3",
      })}
    />
  );
}
