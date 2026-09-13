"use client";

import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { CMS_DARK_BAND_ITEMS_BAR_CLASS } from "@/lib/sections/section-design-system";

export type CmsSectionChromeOptions = {
  section_key: string;
  itemCount: number;
  onEditField?: (field: string, extra?: unknown) => void;
  buttons?: unknown[];
  button_title?: string;
  target_url?: string;
  onFormOpen?: (formKey: string, button?: unknown) => void;
  inverted?: boolean;
  /** Shorthand — applies dark-band items bar chrome */
  onDarkBand?: boolean;
  itemsBarClassName?: string;
  /** Extra footer classes (layout only). Offset comes from `footerSpaced`. */
  footerClassName?: string;
  /** When false, no default footerOffset — pass custom mt in footerClassName. */
  footerSpaced?: boolean;
  buttonsClassName?: string;
  editField?: string;
  /** When false, only returns `footer` (no items bar / empty hint). Default true. */
  withItems?: boolean;
};

/**
 * Standard CMS body chrome — items bar, empty hint, section buttons footer.
 * Spread onto `*Ui`: `{...cmsSectionChrome({ section_key, itemCount: items.length, ... })}`
 */
export function cmsSectionChrome({
  section_key,
  itemCount,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  inverted = false,
  onDarkBand = false,
  itemsBarClassName,
  footerClassName = "",
  footerSpaced = true,
  buttonsClassName,
  editField,
  withItems = true,
}: CmsSectionChromeOptions) {
  const barClass =
    itemsBarClassName ?? (onDarkBand ? CMS_DARK_BAND_ITEMS_BAR_CLASS : undefined);

  const footer = (
    <SectionButtonsFooter
      buttons={buttons}
      button_title={button_title}
      target_url={target_url}
      cmsMode
      onEditField={onEditField}
      onFormOpen={onFormOpen}
      inverted={inverted || onDarkBand}
      surface={inverted || onDarkBand ? "dark" : "inherit"}
      editField={editField}
      spaced={footerSpaced}
      className={footerClassName}
      buttonsClassName={buttonsClassName}
    />
  );

  if (!withItems) {
    return { footer };
  }

  return {
    itemsBar: (
      <CmsSectionItemsBar
        sectionKey={section_key}
        cmsMode
        onEditField={onEditField}
        itemCount={itemCount}
        className={barClass}
      />
    ),
    emptyState: (
      <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
    ),
    footer,
  };
}
