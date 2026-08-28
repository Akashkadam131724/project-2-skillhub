import SectionButtons from "@/components/ui/SectionButtons";
import {
  resolveHeroSectionButtons,
} from "./lib/public-map";
import type { HeroContentSectionProps } from "./lib/types";

export function heroLayoutPublicFooter(
  props: Pick<
    HeroContentSectionProps,
    "buttons" | "button_title" | "target_url"
  >,
  options: {
    onFormOpen?: HeroContentSectionProps["onFormOpen"];
    className?: string;
    inverted?: boolean;
  } = {}
) {
  const list = resolveHeroSectionButtons(props);
  if (!list.length) return null;
  return (
    <SectionButtons
      buttons={list}
      onFormOpen={options.onFormOpen}
      inverted={options.inverted}
      className={options.className ?? "flex flex-wrap items-center gap-3"}
    />
  );
}
