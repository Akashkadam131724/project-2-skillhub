import SectionButtons from "@/components/ui/SectionButtons";
import TestimonialsUi from "./TestimonialsUi";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
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

  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  return (
    <TestimonialsUi
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
