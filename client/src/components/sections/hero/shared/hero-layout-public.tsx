import { publicSectionButtonsFooter } from "@/components/sections/shared/public-section-footer";
import type { HeroContentSectionProps } from "./lib/types";

export function heroLayoutPublicFooter(
  props: Pick<
    HeroContentSectionProps,
    "buttons" | "button_title" | "target_url"
  >,
  options: {
    onFormOpen?: HeroContentSectionProps["onFormOpen"];
    className?: string;
    buttonsClassName?: string;
    inverted?: boolean;
    surface?: string;
  } = {}
) {
  const {
    onFormOpen,
    className = "",
    buttonsClassName = "flex flex-wrap items-center gap-3",
    inverted,
    surface,
  } = options;

  return publicSectionButtonsFooter({
    buttons: props.buttons,
    button_title: props.button_title,
    target_url: props.target_url,
    onFormOpen,
    inverted,
    surface,
    className,
    buttonsClassName,
  });
}
