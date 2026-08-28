import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isBuilderFeatureCardShowable } from "./map";
import type { BuilderFeatureCardsSectionProps } from "./types";

export function isBuilderFeatureCardsPlacementShowable(
  props: BuilderFeatureCardsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(
        props.section_key || "builder_feature_cards",
        props
      ),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isBuilderFeatureCardShowable);
}
