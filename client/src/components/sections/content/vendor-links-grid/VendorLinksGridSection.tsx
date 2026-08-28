"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import VendorLinksGridUi from "./VendorLinksGridUi";
import VendorLinksGridLinkCard from "./VendorLinksGridLinkCard";
import { resolveVendorLinksGridLinks } from "./lib/map";
import { isVendorLinkGridPlacementShowable } from "./lib/placement";
import type { VendorLinksGridSectionProps } from "./lib/types";

const titleClassName =
  "m-0 mb-4 text-left font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:mb-6 sm:text-4xl";

const bodyClassName = "mb-4 text-base leading-relaxed";

export default function VendorLinksGridSection({
  section_title,
  data,
  items: mappingItems,
  section_key = "vendor_link_grid",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  cmsMode = true,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: VendorLinksGridSectionProps) {
  const body = data?.body || "";
  const links = resolveVendorLinksGridLinks(mappingItems, {
    cmsMode: true,
  });

  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });

  const props = {
    section_key,
    section_title,
    data,
    items: mappingItems,
    buttons,
    button_title,
    target_url,
  };

  if (!isVendorLinkGridPlacementShowable(props, cmsMode)) {
    return null;
  }

  const headingClass = `${titleClassName} ${DS_TEXT.heading}`;
  const bodyClass = `${bodyClassName} ${DS_TEXT.muted}`;

  return (
    <VendorLinksGridUi
      id={id}
      links={links}
      onDarkBand={onDarkBand}
      titleSlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="section_title"
          label="Title"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          {section_title || cmsMode ? (
            <h2 className={headingClass}>
              {section_title ||
                (cmsMode
                  ? "Role-Based Solutions That Support Enterprise Transformation"
                  : null)}
            </h2>
          ) : null}
        </CmsEditable>
      }
      bodySlot={
        <CmsEditable
          cmsMode={cmsMode}
          field="body"
          label="Body"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          <CmsRichText
            html={body}
            className={bodyClass}
            empty={
              cmsMode ? (
                <p
                  className={`m-0 ${bodyClassName} ${DS_TEXT.subtle} italic`}
                >
                  Add body copy…
                </p>
              ) : null
            }
          />
        </CmsEditable>
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted={onDarkBand}
          surface={onDarkBand ? "dark" : "inherit"}
          className="mt-4"
        />
      }
      linksSlot={
        <>
          <CmsSectionItemsBar
            sectionKey={section_key}
            cmsMode={cmsMode}
            onEditField={onEditField}
            itemCount={links.length}
            className="mb-3"
          />
          <CmsEditable
            cmsMode={cmsMode}
            field="items"
            label="Vendor links"
            onEditField={onEditField}
          >
            {links.length ? (
              <div className="grid grid-cols-1 divide-y overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm sm:grid-cols-2 sm:divide-x sm:divide-y dark:border-slate-700/80">
                {links.map((link, index) => (
                  <VendorLinksGridLinkCard
                    key={String(link.id)}
                    link={link}
                    index={index}
                  />
                ))}
              </div>
            ) : cmsMode ? (
              <EmptyItemsHint
                sectionKey={section_key}
                onEditField={onEditField}
              />
            ) : null}
          </CmsEditable>
        </>
      }
    />
  );
}
