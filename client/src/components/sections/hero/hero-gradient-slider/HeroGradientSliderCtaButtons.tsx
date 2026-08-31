"use client";

import SectionButtons from "@/components/ui/SectionButtons";
import { normalizeButton } from "@/lib/utils/button-types";

type HeroGradientSliderCtaButtonsProps = {
  buttons?: unknown[];
  videoUrl?: string;
  onFormOpenChange?: (open: boolean) => void;
};

export default function HeroGradientSliderCtaButtons({
  buttons = [],
  videoUrl = "",
  onFormOpenChange,
}: HeroGradientSliderCtaButtonsProps) {
  const merged = [...(Array.isArray(buttons) ? buttons : [])];
  const url = videoUrl.trim();

  if (url) {
    merged.push(
      normalizeButton({
        label: "Watch video",
        variant: merged.length ? "outline" : "primary",
        icon: "youtube",
        action_type: "youtube",
        target_url: url,
      })
    );
  }

  return (
    <SectionButtons
      buttons={merged}
      inverted
      className="flex flex-wrap items-center gap-4 sm:gap-x-6"
      onFormOpen={() => onFormOpenChange?.(true)}
    />
  );
}
