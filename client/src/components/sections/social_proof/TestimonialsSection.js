"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import TestimonialItemCard from "@/components/sections/cards/TestimonialItemCard";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import SectionFrame from "../SectionFrame";

export default function TestimonialsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "testimonials",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, i) => (
            <TestimonialItemCard key={item._id || item.id || i} item={item} />
          ))}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
