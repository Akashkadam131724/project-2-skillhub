import {
  publicSectionButtonsFooter,
  resolvePlacementButtons,
} from "@/components/sections/shared/public-section-footer";
import CustomerTestimonialsUi from "./CustomerTestimonialsUi";
import { resolveCustomerTestimonialUiItems } from "./lib/map";
import { isCustomerTestimonialsPlacementShowable } from "./lib/placement";
import type { CustomerTestimonialsSectionProps } from "./lib/types";

/** Public customer testimonials carousel → {@link CustomerTestimonialsUi}. */
export default function CustomerTestimonialsPublicSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "customer_testimonials",
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: CustomerTestimonialsSectionProps) {
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
      false
    )
  ) {
    return null;
  }

  const items = resolveCustomerTestimonialUiItems(section_key, mappingItems);
  if (!items.length) return null;

  return (
    <CustomerTestimonialsUi
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
