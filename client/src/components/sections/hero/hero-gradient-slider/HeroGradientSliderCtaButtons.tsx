"use client";

import SectionButtons from "@/components/ui/SectionButtons";

type HeroGradientSliderCtaButtonsProps = {
  buttons?: unknown[];
  onFormOpenChange?: (open: boolean) => void;
};

export default function HeroGradientSliderCtaButtons({
  buttons = [],
  onFormOpenChange,
}: HeroGradientSliderCtaButtonsProps) {
  if (!Array.isArray(buttons) || !buttons.length) return null;

  return (
    <SectionButtons
      buttons={buttons}
      inverted
      className="flex flex-wrap items-center gap-4 sm:gap-x-6"
      onFormOpen={() => onFormOpenChange?.(true)}
    />
  );
}
