"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import { resolveItemsForSection } from "@/lib/item-types";
import TextMediaRow from "./TextMediaRow";

/**
 * Stacked text + media rows with modern editorial split.
 */
export default function TextMediaSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "text_media",
  cmsMode,
  onEditField,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title || undefined}
      subtitle={sub_title || undefined}
      eyebrow={section_title || sub_title ? "Learning paths" : undefined}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttonsFooter={false}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
          {items.map((item, i) => (
            <TextMediaRow
              key={item._id || item.id || i}
              item={item}
              index={i}
            />
          ))}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
