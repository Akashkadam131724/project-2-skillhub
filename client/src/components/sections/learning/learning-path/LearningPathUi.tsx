import { SectionLayoutRoot } from "@/components/sections/layout";
import LearningPathStepItemCard from "./LearningPathStepItemCard";
import type { LearningPathUiProps } from "./lib/types";

export default function LearningPathUi({
  title,
  subtitle,
  eyebrow = "Learning path",
  titleSlot,
  subtitleSlot,
  eyebrowSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  items = [],
  preview = false,
  id,
  className = "",
}: LearningPathUiProps) {
  const showEyebrow = eyebrowSlot != null || Boolean(eyebrow);

  return (
        <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={eyebrow}
      eyebrowSlot={eyebrowSlot}
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
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <LearningPathStepItemCard
                key={item.id ?? i}
                item={item}
                index={i}
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
