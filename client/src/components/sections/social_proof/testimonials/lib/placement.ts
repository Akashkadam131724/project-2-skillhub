import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isTestimonialShowable } from "./map";
import type { TestimonialsSectionProps } from "./types";

export function isTestimonialsPlacementShowable(
  props: TestimonialsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(props.section_key || "testimonials", props),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isTestimonialShowable);
}
