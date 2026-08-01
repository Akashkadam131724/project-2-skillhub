"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import FaqItemCard from "@/components/sections/cards/FaqItemCard";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import SectionFrame from "../SectionFrame";

export default function FaqSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "faq",
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const darkBand = isPlacementDarkBand({
    section_theme,
    sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="FAQ"
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      buttonsInverted={darkBand}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <FaqItemCard
              key={item._id || item.id || i}
              item={item}
              index={i}
              onDarkBand={darkBand}
            />
          ))}
        </div>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
