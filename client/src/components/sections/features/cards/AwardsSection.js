"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import { resolveItemsForSection } from "@/lib/item-types";
import { AwardCard } from "./CardItems";

/**
 * Awards / recognition — editorial numbered tiles.
 */
export default function AwardsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "awards",
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
      eyebrow="Quality"
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
          gapClassName="gap-5 lg:gap-6"
          gridClassName="sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, i) => (
            <AwardCard key={item._id || item.id || i} item={item} index={i} />
          ))}
        </MobileCardPeekRow>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
