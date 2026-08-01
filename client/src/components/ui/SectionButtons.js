"use client";

import {
  sortActiveButtons,
  buttonsFromLegacy,
} from "@/lib/utils/button-types";
import DsButton from "./DsButton";

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
  /** inherit | light | dark — use light for buttons inside white cards on dark bands */
  surface = "inherit",
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
        <DsButton
          key={btn._id || btn.id || `${btn.label}-${i}`}
          button={btn}
          className={buttonClassName}
          onFormOpen={onFormOpen}
          inverted={inverted}
          surface={surface}
        />
      ))}
    </div>
  );
}

