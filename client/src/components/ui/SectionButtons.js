"use client";

import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/button-types";
import CmsButton from "./CmsButton";

/**
 * Renders a section's buttons array (or legacy button_title / target_url).
 */
export default function SectionButtons({
  buttons,
  button_title,
  target_url,
  className = "flex flex-wrap items-center gap-3",
  buttonClassName = "",
  onFormOpen,
  inverted = false,
}) {
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  if (!list.length) return null;

  return (
    <div className={className}>
      {list.map((btn, i) => (
        <CmsButton
          key={btn._id || btn.id || `${btn.label}-${i}`}
          button={btn}
          className={buttonClassName}
          onFormOpen={onFormOpen}
          inverted={inverted}
        />
      ))}
    </div>
  );
}
