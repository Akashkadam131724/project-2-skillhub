"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionFrame from "../SectionFrame";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { resolveItemsForSection } from "@/lib/item-types";
import { isRichTextEmpty } from "@/lib/rich-text";

export default function ComparisonTableSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "comparison_table",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  ...frameProps
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <SectionFrame
      title={section_title}
      subtitle={sub_title}
      cmsMode={cmsMode}
      onEditField={onEditField}
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      onFormOpen={onFormOpen}
      {...frameProps}
    >
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode={cmsMode}
        onEditField={onEditField}
        itemCount={items.length}
      />
      {items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
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
                return (
                  <tr
                    key={row._id || row.id || i}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800/80"
                  >
                    <td className="px-4 py-4 align-top font-medium section-theme-heading sm:px-5">
                      {row.title || row.label || "—"}
                    </td>
                    <td className="px-4 py-4 align-top text-brand sm:px-5">
                      {row.value || row.subtitle || "—"}
                    </td>
                    <td className="px-4 py-4 align-top section-theme-muted sm:px-5">
                      {!isRichTextEmpty(row.body) ? (
                        <CmsRichText html={row.body} className="text-sm" />
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
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      )}
    </SectionFrame>
  );
}
