"use client";

import {
  DS_SPACE,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
import {
  buttonsFromLegacy,
  sortActiveButtons,
} from "@/lib/utils/button-types";
import SectionButtons from "@/components/ui/SectionButtons";
import CmsButtonsManageBar from "@/components/cms/sections/CmsButtonsManageBar";

export type SectionButtonsFooterProps = {
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  cmsMode?: boolean;
  onEditField?: (field: string, extra?: unknown) => void;
  /** CMS drawer field — default section buttons; item-driven sections use "items". */
  editField?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  inverted?: boolean;
  /** inherit | light | dark */
  surface?: string;
  /**
   * When true (default), applies {@link DS_SPACE.footerOffset}.
   * Set false for flush heroes / tight footers and pass custom `mt-*` in className.
   */
  spaced?: boolean;
  /** Extra classes only — offset comes from `spaced`, not from replacing className. */
  className?: string;
  buttonsClassName?: string;
};

/**
 * Bottom-of-section CTAs — shared across all section layouts.
 * Owns body→footer spacing via `spaced` + {@link DS_SPACE.footerOffset}.
 * Must sit outside SectionShell’s body stack so gap does not double that margin.
 */
export default function SectionButtonsFooter({
  buttons,
  button_title,
  target_url,
  cmsMode = false,
  onEditField,
  editField = "buttons",
  onFormOpen,
  inverted = false,
  surface = "inherit",
  spaced = true,
  className = "",
  buttonsClassName = "flex flex-wrap items-center gap-3",
}: SectionButtonsFooterProps) {
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  if (!cmsMode && !list.length) return null;

  return (
    <div
      className={sectionClassNames(
        spaced ? DS_SPACE.footerOffset : null,
        className
      )}
      data-cms-buttons-footer
    >
      {list.length ? (
        <SectionButtons
          buttons={list}
          onFormOpen={onFormOpen}
          inverted={inverted}
          surface={surface}
          className={buttonsClassName}
        />
      ) : null}

      {cmsMode ? (
        <CmsButtonsManageBar
          count={list.length}
          editField={editField}
          onEditField={onEditField}
          inverted={inverted}
        />
      ) : null}
    </div>
  );
}
