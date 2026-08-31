import { SectionLayoutRoot } from "@/components/sections/layout";
import CurriculumItemCard from "./CurriculumItemCard";
import type { CurriculumUiProps } from "./lib/types";

/**
 * Pure curriculum list — no CMS imports.
 */
export default function CurriculumUi({
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
}: CurriculumUiProps) {

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
          <ol className="m-0 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
            {items.map((item, i) => (
              <li key={item.id ?? i}>
                <CurriculumItemCard
                  title={item.title}
                  preview={preview}
                />
              </li>
            ))}
          </ol>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
