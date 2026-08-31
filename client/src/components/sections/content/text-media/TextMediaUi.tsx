import { SectionLayoutRoot } from "@/components/sections/layout";
import TextMediaRow from "./TextMediaRow";
import type { TextMediaUiProps } from "./lib/types";

export default function TextMediaUi({
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
}: TextMediaUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const resolvedEyebrow =
    eyebrow ?? (showTitle || showSubtitle ? "Learning paths" : undefined);

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      eyebrow={resolvedEyebrow}
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
          <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
            {items.map((item, i) => (
              <TextMediaRow
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
