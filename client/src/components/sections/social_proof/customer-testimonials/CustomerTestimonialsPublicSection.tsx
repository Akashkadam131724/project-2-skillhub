import SectionButtons from "@/components/ui/SectionButtons";
import CustomerTestimonialsUi from "./CustomerTestimonialsUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <CustomerTestimonialsUi
      id={id}
      title={section_title}
      subtitle={sub_title}
      items={items}
      footer={
        list.length ? (
          <div className="mt-6 sm:mt-8">
            <SectionButtons
              buttons={list}
              onFormOpen={onFormOpen}
              className="flex flex-wrap items-center gap-3"
            />
          </div>
        ) : null
      }
    />
  );
}
