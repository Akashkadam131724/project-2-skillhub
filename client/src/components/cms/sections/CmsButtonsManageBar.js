"use client";

/**
 * CMS-only control to open the buttons field editor.
 * Loaded via dynamic import from SectionButtonsFooter when cmsMode is on.
 */
export default function CmsButtonsManageBar({
  count = 0,
  editField = "buttons",
  onEditField,
  inverted = false,
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${count ? "mt-3" : ""}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditField?.(editField);
        }}
        className="section-btn section-btn--cms-manage"
        {...(inverted ? { "data-btn-surface": "dark" } : {})}
      >
        <span aria-hidden>{count ? "✎" : "+"}</span>
        {count ? `Edit buttons (${count})` : "Add buttons"}
      </button>
      {!count ? (
        <span
          className={`text-[11px] ${
            inverted ? "text-white/50" : "section-theme-subtle"
          }`}
        >
          Links, on-page targets, or forms
        </span>
      ) : null}
    </div>
  );
}
