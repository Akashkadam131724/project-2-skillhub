"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "@/components/sections/SectionFrame";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import { resolveItemsForSection } from "@/lib/item-types";
import { isPlacementDarkBand } from "@/lib/section-theme";
import TrainingOptionCard from "./TrainingOptionCard";

/**
 * Flexible training modalities — image-led modern tiles.
 */
export default function TrainingOptionsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "training_options",
  cmsMode,
  onEditField,
  sectionTheme,
  section_theme,
  surfaceTone,
  surfaceBand,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      eyebrow="Formats"
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
          gridClassName="sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, i) => (
            <TrainingOptionCard
              key={item._id || item.id || i}
              item={item}
              index={i}
              onDarkBand={onDarkBand}
            />
          ))}
        </MobileCardPeekRow>
      ) : (
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
