import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isLearningPathStepShowable } from "./map";
import type { LearningPathSectionProps } from "./types";

export function isLearningPathPlacementShowable(
  props: LearningPathSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "learning_path", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  if (items.some(isLearningPathStepShowable)) return true;
  const list = sortActiveButtons(
    Array.isArray(props.buttons) && props.buttons.length
      ? props.buttons
      : buttonsFromLegacy(props.button_title, props.target_url)
  );
  return list.length > 0;
}
