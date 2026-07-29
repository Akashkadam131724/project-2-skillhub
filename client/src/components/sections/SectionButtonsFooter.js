"use client";

import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/button-types";
import SectionButtons from "@/components/ui/SectionButtons";

/**
 * Bottom-of-section CTAs — shared across all section layouts.
 * Live CMS always shows a manage strip; public pages only render when buttons exist.
 */
export default function SectionButtonsFooter({
  buttons,
  button_title,
  target_url,
  cmsMode = false,
  onEditField,
  /** CMS drawer field — default section buttons; item-driven sections use "items". */
  editField = "buttons",
  onFormOpen,
  inverted = false,
  className = "mt-6 sm:mt-8",
  buttonsClassName = "flex flex-wrap items-center gap-3",
}) {
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  if (!cmsMode && !list.length) return null;

  return (
    <div className={className.trim()} data-cms-buttons-footer>
      {list.length ? (
        <SectionButtons
          buttons={list}
          onFormOpen={onFormOpen}
          inverted={inverted}
          className={buttonsClassName}
        />
      ) : null}

      {cmsMode ? (
        <div
          className={`flex flex-wrap items-center gap-2 ${
            list.length ? "mt-3" : ""
          }`}
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
            <span aria-hidden>{list.length ? "✎" : "+"}</span>
            {list.length
              ? `Edit buttons (${list.length})`
              : "Add buttons"}
          </button>
          {!list.length ? (
            <span
              className={`text-[11px] ${
                inverted ? "text-white/50" : "section-theme-subtle"
              }`}
            >
              Links, on-page targets, or forms
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
