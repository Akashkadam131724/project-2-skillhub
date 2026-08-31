import { SectionLayoutRoot } from "@/components/sections/layout";
import TrainingOptionCard from "@/components/sections/features/cards/TrainingOptionCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import type { TrainingOptionsUiProps } from "./lib/types";

/**
 * Pure training-options layout — no CMS imports.
 */
export default function TrainingOptionsUi({
  title,
  subtitle,
  eyebrow = "Formats",
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  onDarkBand = false,
  preview = false,
  id,
  className = "",
}: TrainingOptionsUiProps) {

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
{items.length ? (
          <MobileCardPeekRow
            gapClassName="gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-4"
          >
            {items.map((item, i) => (
              <TrainingOptionCard
                key={item.id ?? i}
                title={item.title}
                body={item.body}
                imageUrl={item.imageUrl}
                buttons={item.buttons}
                index={i}
                onDarkBand={onDarkBand}
                preview={preview}
              />
            ))}
          </MobileCardPeekRow>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
