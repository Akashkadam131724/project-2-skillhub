import { SectionLayoutRoot } from "@/components/sections/layout";
import ResourceItemCard from "./ResourceItemCard";
import type { ResourcesUiProps } from "./lib/types";

/**
 * Pure resources list — no CMS imports.
 */
export default function ResourcesUi({
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
}: ResourcesUiProps) {

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
          <ul className="m-0 list-none space-y-3 p-0">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <ResourceItemCard
                  title={item.title}
                  body={item.body}
                  href={item.href}
                  buttons={item.buttons}
                  preview={preview}
                />
              </li>
            ))}
          </ul>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
