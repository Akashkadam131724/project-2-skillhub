"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { resolveItemsForSection } from "@/lib/item-types";
import { TrainingOptionCard } from "./CardItems";

/**
 * Flexible training modalities — 4-up image cards.
 * Title + footer CTAs are left-aligned via SectionFrame.
 */
export default function TrainingOptionsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "training_options",
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
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {items.map((item, i) => (
            <li key={item._id || item.id || i} className="min-w-0">
              <TrainingOptionCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
