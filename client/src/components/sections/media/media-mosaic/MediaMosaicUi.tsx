import { SectionLayoutRoot } from "@/components/sections/layout";
import MediaMosaicItemCard from "./MediaMosaicItemCard";
import type { MediaMosaicUiProps } from "./lib/types";

export default function MediaMosaicUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: MediaMosaicUiProps) {

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
      footer={footer}
      items={items}
    >
{items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {items.map((item, i) => (
              <MediaMosaicItemCard
                key={item.id ?? i}
                item={item}
                preview={preview}
                featured={item.featured}
              />
            ))}
          </div>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
