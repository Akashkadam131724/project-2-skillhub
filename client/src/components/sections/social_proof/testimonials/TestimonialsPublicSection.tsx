import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import TestimonialsUi from "./TestimonialsUi";
import { resolveTestimonialUiItems } from "./lib/map";
import { isTestimonialsPlacementShowable } from "./lib/placement";
import type { TestimonialsSectionProps } from "./lib/types";

/** Public testimonials — maps placement props → {@link TestimonialsUi}. */
export default function TestimonialsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "testimonials",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: TestimonialsSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveTestimonialUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <TestimonialsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={publicSectionButtonsFooter({
        buttons,
        button_title,
        target_url,
        onFormOpen,
      })}
    />
  );
}
