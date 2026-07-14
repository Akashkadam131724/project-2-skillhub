"use client";

function EditIcon({ className = "size-3.5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Wraps a visible field with a pencil that opens a single-field edit drawer.
 * Only renders the icon when cmsMode is true.
 */
export default function CmsEditable({
  cmsMode = false,
  field,
  label,
  onEditField,
  children,
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
        <EditIcon />
      </button>
    </div>
  );
}

export { EditIcon };
