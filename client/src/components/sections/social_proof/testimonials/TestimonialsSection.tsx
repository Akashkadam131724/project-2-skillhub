"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import TestimonialsUi from "./TestimonialsUi";
import { resolveTestimonialUiItems } from "./lib/map";
import { isTestimonialsPlacementShowable } from "./lib/placement";
import type { TestimonialsSectionProps } from "./lib/types";

/** CMS-only testimonials adapter → {@link TestimonialsUi}. */
export default function TestimonialsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "testimonials",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TestimonialsSectionProps) {
  const items = resolveTestimonialUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isTestimonialsPlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <TestimonialsUi
      id={id}
      preview
      {...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}
      items={items}
      {...cmsSectionChrome({
        section_key,
        itemCount: items.length,
        onEditField,
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}

    />
  );
}
