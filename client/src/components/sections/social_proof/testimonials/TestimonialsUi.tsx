import { SectionLayoutRoot } from "@/components/sections/layout";
import TestimonialItemCard from "./TestimonialItemCard";
import type { TestimonialsUiProps } from "./lib/types";

export default function TestimonialsUi({
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
}: TestimonialsUiProps) {

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
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((item, i) => (
              <TestimonialItemCard
                key={item.id ?? i}
                item={item}
                preview={preview}
              />
            ))}
          </div>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
