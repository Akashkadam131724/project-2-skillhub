"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";
import WhyChooseUi from "./WhyChooseUi";
import { resolveWhyChooseUiItems } from "./lib/map";
import { isWhyChoosePlacementShowable } from "./lib/placement";
import type { WhyChooseSectionProps } from "./lib/types";

/**
 * CMS-only why choose adapter → {@link WhyChooseUi}.
 * Public pages use {@link WhyChoosePublicSection}.
 */
export default function WhyChooseSection({
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "why_choose",
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}: WhyChooseSectionProps) {
  const items = resolveWhyChooseUiItems(section_key, mappingItems, {
    cmsMode: true,
  });
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionTheme,
    surfaceTone,
    surfaceBand,
  });
  const lightBand = !onDarkBand;
  const eyebrow = (in_page_nav_title || "").trim();

  if (
    !isWhyChoosePlacementShowable(
      {
        section_key,
        section_title,
        sub_title,
        in_page_nav_title,
        items: mappingItems,
        buttons,
        button_title,
        target_url,
      },
      true
    )
  ) {
    return null;
  }

  return (
    <WhyChooseUi
      id={id}
      preview
      onDarkBand={onDarkBand}
      eyebrowSlot={
        <CmsEditable
          cmsMode
          field="in_page_nav_title"
          label="Eyebrow"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          <p
            className={`m-0 text-[11px] font-semibold tracking-[0.22em] uppercase ${
              lightBand ? "text-brand" : "text-white/50"
            }`}
          >
            {eyebrow || (
              <span
                className={
                  lightBand ? "italic opacity-60" : "italic text-white/35"
                }
              >
                Add eyebrow…
              </span>
            )}
          </p>
        </CmsEditable>
      }
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          {section_title ? (
            <h2
              className={
                lightBand
                  ? "section-theme-heading m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl"
                  : "m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-4xl"
              }
            >
              {section_title}
            </h2>
          ) : (
            <h2
              className={
                lightBand
                  ? "section-theme-placeholder m-0 text-3xl font-semibold italic sm:text-4xl"
                  : "m-0 text-3xl font-semibold text-white/40 italic sm:text-4xl"
              }
            >
              Add title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
          inverted={onDarkBand}
        >
          {sub_title ? (
            <p
              className={
                lightBand
                  ? "section-theme-muted m-0 max-w-2xl text-base leading-relaxed"
                  : "m-0 max-w-2xl text-base leading-relaxed text-white/72"
              }
            >
              {sub_title}
            </p>
          ) : (
            <p
              className={
                lightBand
                  ? "section-theme-placeholder m-0 text-base italic"
                  : "m-0 text-base text-white/35 italic"
              }
            >
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
      items={items}
      itemsBar={
        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode
          onEditField={onEditField}
          itemCount={items.length}
          className={
            lightBand
              ? undefined
              : "[&_p]:text-white/60 [&_button]:border-white/30 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:bg-white/20"
          }
        />
      }
      emptyState={
        <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
      }
      footer={
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted={onDarkBand}
          className="mt-8 sm:mt-10"
        />
      }
    />
  );
}
