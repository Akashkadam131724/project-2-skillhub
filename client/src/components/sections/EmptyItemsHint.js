"use client";

import { getSectionItemsConfig } from "@/lib/section-items-config";

/** Shared empty state for item-driven sections in CMS mode */
export default function EmptyItemsHint({
  sectionKey,
  label,
  onEditField,
}) {
  const config = getSectionItemsConfig(sectionKey);
  const name =
    label || config?.actionLabel || config?.label || "items";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditField?.("items");
      }}
      className="m-0 w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-transparent px-4 py-6 text-center text-sm text-slate-400 transition hover:border-brand hover:text-brand dark:border-slate-700"
    >
      No {name} yet — click to add
    </button>
  );
}
