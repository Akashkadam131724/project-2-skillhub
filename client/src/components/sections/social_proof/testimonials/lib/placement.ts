import { createPlacementGuard } from "@/lib/sections/placement-guard";
import { isTestimonialShowable } from "./map";
import type { TestimonialsSectionProps } from "./types";

export const isTestimonialsPlacementShowable = createPlacementGuard<TestimonialsSectionProps>(
  "testimonials",
  isTestimonialShowable
);
