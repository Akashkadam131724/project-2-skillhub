"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import { resolveItemsForSection } from "@/lib/item-types";
import SectionFrame from "./SectionFrame";

export default function FaqSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "faq",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  // Entity/live FAQ uses mapping `items[]` only — never legacy data / template bleed
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="border-t border-slate-200 dark:border-slate-800">
          {items.map((item, i) => (
            <SectionItemCard
              key={item._id || item.id || i}
              type="faq"
              item={item}
            />
          ))}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
