"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import { resolveItemsForSection } from "@/lib/item-types";
import SectionFrame from "./SectionFrame";

export default function KeyBenefitsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "key_benefits",
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
              <SectionItemCard type="benefit" item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
