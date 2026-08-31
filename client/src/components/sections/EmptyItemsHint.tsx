"use client";

import { getSectionItemsConfig } from "@/lib/sections/section-items-config";
import { useSectionCmsKeys } from "@/context/SectionCmsContext";

export type EmptyItemsHintProps = {
  sectionKey?: string;
  renderKey?: string | null;
  label?: string;
  onEditField?: (field: string, extra?: unknown) => void;
};

/** Shared empty state for item-driven sections in CMS mode */
export default function EmptyItemsHint({
  sectionKey: sectionKeyProp,
  renderKey: renderKeyProp,
  label,
  onEditField,
}: EmptyItemsHintProps) {
  const ctx = useSectionCmsKeys();
  const sectionKey = sectionKeyProp || ctx.sectionKey;
  const renderKey =
    renderKeyProp !== undefined && renderKeyProp !== null
      ? renderKeyProp
      : ctx.renderKey;

  const config = getSectionItemsConfig(sectionKey, renderKey);
  const name = label || config?.actionLabel || config?.label || "items";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditField?.("items");
      }}
      className="section-theme-subtle m-0 w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-transparent px-4 py-6 text-center text-sm transition hover:border-brand hover:text-brand dark:border-slate-700"
    >
      No {name} yet — click to add
    </button>
  );
}
