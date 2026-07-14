"use client";

import { getSectionItemsConfig } from "@/lib/section-items-config";

/**
 * CMS control placed next to the cards — label comes from section config
 * (FAQ items, Benefit cards, Stats, …) not a generic "Items".
 */
export default function CmsSectionItemsBar({
  sectionKey,
  cmsMode,
  onEditField,
  itemCount = 0,
  className = "",
}) {
  if (!cmsMode) return null;
  const config = getSectionItemsConfig(sectionKey);
  if (!config) return null;

  const label = config.actionLabel || config.label || "Items";

  return (
    <div
      className={`mb-3 flex flex-wrap items-center justify-between gap-2 ${className}`.trim()}
    >
      <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        {config.label}
        {itemCount ? (
          <span className="ml-1.5 font-normal normal-case text-slate-400">
            · {itemCount}
          </span>
        ) : null}
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditField?.("items");
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:border-brand hover:text-brand dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
      >
        <span aria-hidden>{itemCount ? "✎" : "+"}</span>
        {itemCount ? `Edit ${label}` : `Add ${label}`}
      </button>
    </div>
  );
}
