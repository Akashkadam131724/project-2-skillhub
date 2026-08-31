import { SectionLayoutRoot } from "@/components/sections/layout";
import TrustBadgeItemCard from "./TrustBadgeItemCard";
import type { TrustBadgesUiProps } from "./lib/types";

/**
 * Pure trust-badges layout — no CMS imports.
 */
export default function TrustBadgesUi({
  title,
  subtitle,
  eyebrow = "Trust",
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: TrustBadgesUiProps) {

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
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items.map((badge, i) => (
              <li key={badge.id ?? i}>
                <TrustBadgeItemCard badge={badge} preview={preview} />
              </li>
            ))}
          </ul>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
