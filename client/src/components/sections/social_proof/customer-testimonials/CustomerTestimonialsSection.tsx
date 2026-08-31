"use client";

import { cmsSectionChrome } from "@/components/sections/shared/cms-section-chrome";
import { cmsSectionHeaderSlots } from "@/components/sections/shared/CmsSectionHeaderSlots";
import CustomerTestimonialsUi from "./CustomerTestimonialsUi";
import { resolveCustomerTestimonialUiItems } from "./lib/map";
import { isCustomerTestimonialsPlacementShowable } from "./lib/placement";
import type { CustomerTestimonialsSectionProps } from "./lib/types";

/** CMS-only customer testimonials adapter → {@link CustomerTestimonialsUi}. */
export default function CustomerTestimonialsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "customer_testimonials",
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CustomerTestimonialsSectionProps) {
  const items = resolveCustomerTestimonialUiItems(section_key, mappingItems, {
    cmsMode: true,
  });

  if (
    !isCustomerTestimonialsPlacementShowable(
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
    <CustomerTestimonialsUi
      id={id}
      preview
      eyebrow="Stories"
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
