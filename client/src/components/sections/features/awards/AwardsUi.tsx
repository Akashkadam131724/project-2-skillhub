import { SectionLayoutRoot } from "@/components/sections/layout";
import AwardCard from "@/components/sections/features/cards/AwardCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import type { AwardsUiProps } from "./lib/types";

/**
 * Pure awards layout — no CMS imports.
 */
export default function AwardsUi({
  title,
  subtitle,
  eyebrow = "Quality",
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: AwardsUiProps) {

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
      items={items}
    >
{items.length ? (
          <MobileCardPeekRow
            gapClassName="gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <AwardCard
                key={item.id ?? i}
                title={item.title}
                body={item.body}
                imageUrl={item.imageUrl}
                index={i}
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
