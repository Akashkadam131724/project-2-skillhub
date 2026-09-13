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
  className?: string;
  buttonsClassName?: string;
};

/**
 * Bottom-of-section CTAs — shared across all section layouts.
 * Owns body→footer spacing via `mt-*` (default {@link DS_SPACE.footerOffset}).
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
  className = DS_SPACE.footerOffset,
  buttonsClassName = "flex flex-wrap items-center gap-3",
}: SectionButtonsFooterProps) {
  const list = sortActiveButtons(
    Array.isArray(buttons) && buttons.length
      ? buttons
      : buttonsFromLegacy(button_title, target_url)
  );

  if (!cmsMode && !list.length) return null;

  return (
    <div className={sectionClassNames(className)} data-cms-buttons-footer>
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
