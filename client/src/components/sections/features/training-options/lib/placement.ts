import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isTrainingOptionShowable } from "./map";
import type { TrainingOptionsSectionProps } from "./types";

export function isTrainingOptionsPlacementShowable(
  props: TrainingOptionsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "training_options", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTrainingOptionShowable);
}
