"use client";

import TestimonialSlide from "./TestimonialSlide";

export type CustomerTestimonialItemCardProps = {
  item?: Record<string, unknown> | null;
  preview?: boolean;
};

/** Carousel-style customer testimonial (stars + quote + author + logo) */
export default function CustomerTestimonialItemCard({
  item,
  preview = false,
}: CustomerTestimonialItemCardProps) {
  return (
    <div
      data-light-surface
      className="section-ui-card rounded-xl border px-4 py-4"
    >
      <TestimonialSlide item={item} preview={preview} />
    </div>
  );
}
