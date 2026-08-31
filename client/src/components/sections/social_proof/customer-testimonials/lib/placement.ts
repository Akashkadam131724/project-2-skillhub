import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isCustomerTestimonialShowable } from "./map";
import type { CustomerTestimonialsSectionProps } from "./types";

export const isCustomerTestimonialsPlacementShowable = createPlacementGuard<CustomerTestimonialsSectionProps>(
  "customer_testimonials",
  isCustomerTestimonialShowable
);
