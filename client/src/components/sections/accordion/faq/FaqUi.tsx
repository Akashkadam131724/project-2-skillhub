import {
  SectionLayoutRoot,
  SectionStack,
} from "@/components/sections/layout";
import FaqItemCard from "../shared/FaqItemCard";
import type { FaqUiProps } from "./lib/types";

/**
 * Pure FAQ layout — no CMS imports.
 * Pass plain strings / item DTOs, or slots for chrome (CMS adapter injects pencils).
 */
export default function FaqUi({
  title,
  subtitle,
  eyebrow = "FAQ",
  titleSlot,
  subtitleSlot,
  headerAction,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  darkBand = false,
  preview = false,
  id,
  className = "",
}: FaqUiProps) {

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      bodyGap="gridGapTight"
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
      headerAction={headerAction}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={items}
    >
      {items.length ? (
        <SectionStack gap="gridGapTight">
          {items.map((item, i) => (
            <FaqItemCard
              key={item.id ?? i}
              question={item.question}
              answer={item.answer}
              buttons={item.buttons}
              index={i}
              preview={preview}
              onDarkBand={darkBand}
            />
          ))}
        </SectionStack>
      ) : (
        emptyState
      )}
    </SectionLayoutRoot>
  );
}
