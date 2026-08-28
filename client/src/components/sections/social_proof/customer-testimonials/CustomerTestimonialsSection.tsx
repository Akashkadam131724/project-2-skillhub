"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
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
      eyebrowSlot={
        <p className="text-brand m-0 text-[11px] font-semibold tracking-[0.22em] uppercase">
          Stories
        </p>
      }
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
              Add title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
      items={items}
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
        />
      }
    />
  );
}
