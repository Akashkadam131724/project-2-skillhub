import { SectionLayoutRoot } from "@/components/sections/layout";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import TeamMemberItemCard from "./TeamMemberItemCard";
import type { TeamUiProps } from "./lib/types";

/**
 * Pure team layout — no CMS imports.
 */
export default function TeamUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  preview = false,
  id,
  className = "",
}: TeamUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = showTitle || showSubtitle;

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
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
            gapClassName="gap-5"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((item, i) => (
              <TeamMemberItemCard
                key={item.id ?? i}
                {...item}
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
