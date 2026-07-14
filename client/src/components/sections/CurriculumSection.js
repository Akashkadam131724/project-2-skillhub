"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import { resolveItemsForSection } from "@/lib/item-types";
import SectionFrame from "./SectionFrame";

export default function CurriculumSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "curriculum",
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
        <ol className="m-0 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
          {items.map((item, i) => (
            <li key={item._id || item.id || i}>
              <SectionItemCard type="curriculum" item={item} />
            </li>
          ))}
        </ol>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
