import { SectionLayoutRoot } from "@/components/sections/layout";
import BenefitItemCard from "./BenefitItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import type { KeyBenefitsUiProps } from "./lib/types";

/**
 * Pure key-benefits layout — no CMS imports.
 */
export default function KeyBenefitsUi({
  title,
  subtitle,
  eyebrow,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: KeyBenefitsUiProps) {

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
            gapClassName="gap-4 sm:gap-5"
            gridClassName="sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {items.map((item, i) => (
              <BenefitItemCard
                key={item.id ?? i}
                title={item.title}
                body={item.body}
                imageUrl={item.imageUrl}
                buttons={item.buttons}
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
