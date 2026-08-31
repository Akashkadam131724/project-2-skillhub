import { SectionLayoutRoot } from "@/components/sections/layout";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
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
    </SectionLayoutRoot>
  );
}
