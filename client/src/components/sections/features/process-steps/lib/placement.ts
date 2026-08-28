import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isProcessStepShowable } from "./map";
import type { ProcessStepsSectionProps } from "./types";

export function isProcessStepsPlacementShowable(
  props: ProcessStepsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "process_steps", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isProcessStepShowable);
}
