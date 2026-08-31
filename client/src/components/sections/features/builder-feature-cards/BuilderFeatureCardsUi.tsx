import { SectionLayoutRoot } from "@/components/sections/layout";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { BuilderFeatureCardsUiProps } from "./lib/types";

/**
 * Pure builder feature cards layout — no CMS imports.
 */
export default function BuilderFeatureCardsUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  items = [],
  id,
  className = "",
}: BuilderFeatureCardsUiProps) {

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
            gapClassName="gap-px"
            gridClassName="sm:grid-cols-2 lg:grid-cols-4"
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-200"
          >
            {items.map((item, i) => (
              <article
                key={item.id ?? i}
                data-light-surface=""
                className="flex min-h-[280px] flex-col bg-white p-6 dark:bg-slate-900"
              >
                <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {item.value || String(i + 1).padStart(2, "0")}
                </div>
                {item.title ? (
                  <h3 className="m-0 text-xl font-semibold tracking-tight section-theme-heading">
                    {item.title}
                  </h3>
                ) : null}
                {item.subtitle ? (
                  <p className="mt-2 mb-0 text-sm font-medium text-brand">
                    {item.subtitle}
                  </p>
                ) : null}
                {!isRichTextEmpty(item.body) ? (
                  <CmsRichText
                    html={item.body}
                    className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  />
                ) : null}
                <div className="mt-auto pt-8 text-sm font-semibold section-theme-heading">
                  Learn more →
                </div>
              </article>
            ))}
          </MobileCardPeekRow>
        ) : (
          emptyState
        )}
    </SectionLayoutRoot>
  );
}
