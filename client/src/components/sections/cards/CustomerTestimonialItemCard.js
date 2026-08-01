"use client";

import { TestimonialSlide } from "@/components/sections/social_proof/testimonials";

/** Carousel-style customer testimonial (stars + quote + author + logo) */
export default function CustomerTestimonialItemCard({ item, preview = false }) {
  return (
    <div
      data-light-surface
      className="rounded-xl section-ui-card border px-4 py-4"
    >
      <TestimonialSlide item={item} preview={preview} />
    </div>
  );
}
