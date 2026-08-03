"use client";

import Link from "next/link";
import { SectionPreviewThumb } from "@/components/cms/admin/CmsUi";
import { ScopeBadge } from "@/components/cms/sections/CmsSectionFilters";
import { placementKey } from "@/lib/sections/page-sections-stack";
import { previewSrc } from "@/components/cms/pages/live/field-meta";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";

/** Mapped placements list — show/hide/remove/reorder. */
export default function MappedSectionsTab({ onClose }) {
  const { pageKey } = useCmsLiveEdit();
  const {
    sections,
    catalog,
    sortDisabled,
    saving: busy,
    toggleVisibility,
    removeExtra,
    move,
  } = useCmsLivePagePlacements();

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        {sortDisabled
          ? "Sections (template order + page mappings)"
          : "Sort sections"}
      </p>
      {sortDisabled ? (
        <p className="mb-2 text-[11px] text-slate-400">
          Template sections follow{" "}
          <Link
            href={`/cms/pages/${pageKey}`}
            className="font-semibold text-brand no-underline"
          >
            template CMS
          </Link>
          . Page-only (+page) sections use this page’s mapping sort — move those
          with ↑ ↓.
        </p>
      ) : (
        <p className="mb-2 text-[11px] text-slate-400">
          Order is stored on this page’s EntityPageSection mappings.
        </p>
      )}
      <ul className="m-0 list-none space-y-1.5 p-0">
        {sections.map((s, index) => {
          const pid = placementKey(s);
          const canMove = !sortDisabled || s.is_entity_extra;
          const hidden = s.status === false;
          return (
            <li
              key={pid}
              className={`flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 dark:border-slate-800 ${
                hidden ? "opacity-50" : ""
              }`}
            >
              <SectionPreviewThumb
                src={previewSrc(s, catalog)}
                alt={s.section_key}
                className="size-10"
              />
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left text-xs font-medium text-slate-800 dark:text-slate-100"
                onClick={() => {
                  document
                    .getElementById(`cms-section-${pid}`)
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  onClose();
                }}
              >
                <span className="mr-1 text-slate-400">#{s.sort_order}</span>
                {s.section_key}
                <ScopeBadge
                  scope={s.content_scope}
                  className="ml-1 align-middle"
                />
                {s.is_entity_extra ? (
                  <span className="ml-1 text-[10px] text-emerald-600">
                    +page
                  </span>
                ) : null}
                {hidden ? (
                  <span className="ml-1 text-[10px] text-rose-600">hidden</span>
                ) : null}
              </button>
              <button
                type="button"
                className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                disabled={busy}
                onClick={() => toggleVisibility(s)}
                title={
                  hidden
                    ? "Show section on this page"
                    : "Hide section on this page"
                }
              >
                {hidden ? "Show" : "Hide"}
              </button>
              {s.is_entity_extra ? (
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-30 dark:hover:bg-rose-950/40"
                  disabled={busy}
                  onClick={() => removeExtra(s)}
                  title="Remove this page-only mapping"
                >
                  Remove
                </button>
              ) : null}
              {canMove ? (
                <>
                  <button
                    type="button"
                    className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    disabled={index === 0 || busy}
                    onClick={() => move(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    disabled={index === sections.length - 1 || busy}
                    onClick={() => move(index, 1)}
                  >
                    ↓
                  </button>
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
