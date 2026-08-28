import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { ComparisonTableUiProps } from "./lib/types";

/**
 * Pure comparison table — no CMS chrome imports beyond rich text rendering.
 */
export default function ComparisonTableUi({
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
}: ComparisonTableUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showHeader = Boolean(eyebrow || showTitle || showSubtitle);

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden bg-transparent py-14 sm:py-16 lg:py-20 ${className}`.trim()}
    >
      <SectionWrapper>
        {showHeader ? (
          <header
            className={`flex flex-col gap-2.5 sm:gap-3 ${
              items.length || itemsBar || emptyState || footer
                ? "mb-8 sm:mb-10"
                : ""
            }`}
          >
            {eyebrow ? (
              <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            {titleSlot != null ? (
              titleSlot
            ) : showTitle ? (
              <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitleSlot != null ? (
              subtitleSlot
            ) : showSubtitle ? (
              <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </header>
        ) : null}

        {itemsBar}

        {items.length ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
                  <th className="px-4 py-3 font-semibold section-theme-heading sm:px-5">
                    Option
                  </th>
                  <th className="px-4 py-3 font-semibold section-theme-heading sm:px-5">
                    Detail
                  </th>
                  <th className="px-4 py-3 font-semibold section-theme-heading sm:px-5">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, i) => {
                  const hasButtons =
                    Array.isArray(row.buttons) && row.buttons.length > 0;
                  const option = row.option?.trim();
                  const highlight = row.highlight?.trim();
                  const notes = row.notes || "";

                  return (
                    <tr
                      key={row.id ?? i}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/80"
                    >
                      <td className="px-4 py-4 align-top font-medium section-theme-heading sm:px-5">
                        {option ||
                          (preview ? (
                            <CardPlaceholder>Option…</CardPlaceholder>
                          ) : (
                            "—"
                          ))}
                      </td>
                      <td className="px-4 py-4 align-top text-brand sm:px-5">
                        {highlight ||
                          (preview ? (
                            <CardPlaceholder>Highlight…</CardPlaceholder>
                          ) : (
                            "—"
                          ))}
                      </td>
                      <td className="px-4 py-4 align-top section-theme-muted sm:px-5">
                        {!isRichTextEmpty(notes) || preview ? (
                          <CmsRichText
                            html={notes}
                            className="text-sm"
                            empty={
                              preview ? (
                                <p className="m-0 text-sm">
                                  <CardPlaceholder>Notes…</CardPlaceholder>
                                </p>
                              ) : null
                            }
                          />
                        ) : null}
                        {hasButtons ? (
                          <div className="mt-3">
                            <SectionButtons
                              buttons={row.buttons}
                              className="flex flex-wrap gap-2"
                            />
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          emptyState
        )}

        {footer}
      </SectionWrapper>
    </section>
  );
}
