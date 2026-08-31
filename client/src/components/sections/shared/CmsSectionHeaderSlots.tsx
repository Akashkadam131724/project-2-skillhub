"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import {
  DS_TYPE,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";

export type CmsSectionHeaderSlotProps = {
  value?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  field: string;
  label: string;
  inverted?: boolean;
  cmsMode?: boolean;
  className?: string;
  placeholderClassName?: string;
  placeholder?: string;
};

/** CMS-editable section title — uses `DS_TYPE.displayTitle`. */
export function CmsSectionTitleSlot({
  value,
  onEditField,
  field,
  label,
  inverted = false,
  cmsMode = true,
  className = "",
  placeholderClassName = "",
  placeholder = "Add title…",
}: CmsSectionHeaderSlotProps) {
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field={field}
      label={label}
      onEditField={onEditField}
      inverted={inverted}
    >
      {value ? (
        <h2 className={sectionClassNames(DS_TYPE.displayTitle, className)}>
          {value}
        </h2>
      ) : (
        <h2
          className={sectionClassNames(
            DS_TYPE.placeholderTitle,
            placeholderClassName
          )}
        >
          {placeholder}
        </h2>
      )}
    </CmsEditable>
  );
}

/** CMS-editable section subtitle — uses `DS_TYPE.subtitle`. */
export function CmsSectionSubtitleSlot({
  value,
  onEditField,
  field,
  label,
  inverted = false,
  cmsMode = true,
  className = "",
  placeholderClassName = "",
  placeholder = "Add subtitle…",
}: CmsSectionHeaderSlotProps) {
  return (
    <CmsEditable
      cmsMode={cmsMode}
      field={field}
      label={label}
      onEditField={onEditField}
      inverted={inverted}
    >
      {value ? (
        <p className={sectionClassNames(DS_TYPE.subtitle, className)}>{value}</p>
      ) : (
        <p
          className={sectionClassNames(
            DS_TYPE.placeholderSubtitle,
            placeholderClassName
          )}
        >
          {placeholder}
        </p>
      )}
    </CmsEditable>
  );
}

export type CmsSectionHeaderSlotsOptions = {
  section_title?: string;
  sub_title?: string;
  onEditField?: (field: string, extra?: unknown) => void;
  inverted?: boolean;
  cmsMode?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
  titlePlaceholderClassName?: string;
  subtitlePlaceholderClassName?: string;
};

/**
 * Standard CMS title + subtitle slots for `*Ui` components.
 * Spread onto the Ui: `{...cmsSectionHeaderSlots({ section_title, sub_title, onEditField })}`
 */
export function cmsSectionHeaderSlots({
  section_title,
  sub_title,
  onEditField,
  inverted = false,
  cmsMode = true,
  titleClassName = "",
  subtitleClassName = "",
  titlePlaceholderClassName = "",
  subtitlePlaceholderClassName = "",
}: CmsSectionHeaderSlotsOptions) {
  return {
    titleSlot: (
      <CmsSectionTitleSlot
        value={section_title}
        onEditField={onEditField}
        field="section_title"
        label="Title"
        inverted={inverted}
        cmsMode={cmsMode}
        className={titleClassName}
        placeholderClassName={titlePlaceholderClassName}
      />
    ),
    subtitleSlot: (
      <CmsSectionSubtitleSlot
        value={sub_title}
        onEditField={onEditField}
        field="sub_title"
        label="Subtitle"
        inverted={inverted}
        cmsMode={cmsMode}
        className={subtitleClassName}
        placeholderClassName={subtitlePlaceholderClassName}
      />
    ),
  };
}
