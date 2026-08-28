import {
  placementHasMeaningfulContent,
  sectionProbeFromProps,
} from "@/lib/sections/item-types";
import type { HeroContentSectionProps } from "./types";

/** Public pages: skip empty field-driven heroes (CMS still shows shells). */
export function shouldHideEmptyHero(
  sectionKey: string,
  props: HeroContentSectionProps = {}
): boolean {
  if (props.cmsMode) return false;
  return !placementHasMeaningfulContent(
    sectionProbeFromProps(sectionKey, props as Record<string, unknown>)
  );
}

export function isHeroPlacementShowable(
  sectionKey: string,
  props: HeroContentSectionProps,
  cmsMode = false
): boolean {
  return !shouldHideEmptyHero(sectionKey, { ...props, cmsMode });
}
