"use client";

import { mediaUrl } from "@/lib/cms-api";

/**
 * Stacked section_preview_img mock of a page layout (template or live).
 * Images render full width at natural height.
 * @param {{ items: Array<{ id: string, section_key: string, preview?: string, sort_order?: number, hidden?: boolean }> }} props
 */
export default function CmsPagePreviewStack({ items = [], emptyMessage }) {
  if (!items.length) {
    return (
      <p className="m-0 rounded-lg border border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        {emptyMessage || "No sections mapped yet."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          Page preview
        </p>
        <p className="mt-0.5 mb-0 text-xs text-slate-400">
          Section preview images in page order — full width, natural height.
        </p>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item) => {
          const url = mediaUrl(item.preview);
          return (
            <div
              key={item.id}
              className={`relative ${item.hidden ? "opacity-45" : ""}`}
            >
              <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1">
                <span className="rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  #{item.sort_order ?? "—"} {item.section_key}
                </span>
                {item.hidden ? (
                  <span className="rounded bg-rose-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    hidden
                  </span>
                ) : null}
              </div>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={item.section_key}
                  className="block h-auto w-full"
                />
              ) : (
                <div className="flex h-28 items-center justify-center bg-slate-100 text-xs text-slate-400 dark:bg-slate-800">
                  No preview image for {item.section_key}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
