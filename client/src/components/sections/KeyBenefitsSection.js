"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
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
        <MobileCardPeekRow
          gapClassName="gap-4 sm:gap-5"
          gridClassName="sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {items.map((item, i) => (
            <SectionItemCard
              key={item._id || item.id || i}
              type="benefit"
              item={item}
            />
          ))}
        </MobileCardPeekRow>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
