import {
  sectionProbeFromProps,
  shouldRenderPlacement,
} from "@/lib/sections/item-types";
import { isCustomerTestimonialShowable } from "./map";
import type { CustomerTestimonialsSectionProps } from "./types";

export function isCustomerTestimonialsPlacementShowable(
  props: CustomerTestimonialsSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  if (
    !shouldRenderPlacement(
      sectionProbeFromProps(
        props.section_key || "customer_testimonials",
        props
      ),
      false
    )
  ) {
    return false;
  }
  const items = Array.isArray(props.items) ? props.items : [];
  return items.some(isCustomerTestimonialShowable);
}
