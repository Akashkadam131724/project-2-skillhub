"use client";

import PencilIcon from "@/components/icons/PencilIcon";

/**
 * Wraps a visible field with a pencil that opens a single-field edit drawer.
 * Only renders the icon when cmsMode is true.
 */
export default function CmsEditable({
  cmsMode = false,
  field = undefined,
  label = undefined,
  onEditField = undefined,
  children = null,
  className = "",
  inverted = false,
}) {
  if (!cmsMode) return children;

  return (
    <div className={`group/cms relative flex w-full max-w-full items-start gap-1.5 ${className}`}>
      <div className="min-w-0 flex-1">{children}</div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditField?.(field);
        }}
        className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border-0 shadow-sm transition ${
          inverted
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        }`}
        aria-label={`Edit ${label || field}`}
        title={`Edit ${label || field}`}
      >
        <PencilIcon />
      </button>
    </div>
  );
}

export { PencilIcon as EditIcon };
