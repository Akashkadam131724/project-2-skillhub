"use client";

import CmsEditable from "@/components/cms/primitives/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import WhyChooseItemCard from "@/components/sections/cards/WhyChooseItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection } from "@/lib/sections/item-types";
import { isPlacementDarkBand } from "@/lib/sections/section-theme";

/**
 * “Why choose” band — glass cards on dark bands; white cards on light bands.
 */
export default function WhyChooseSection({
  section_title,
  sub_title,
  in_page_nav_title,
  items: mappingItems,
  section_key = "why_choose",
  section_theme,
  sectionTheme: sectionThemeProp,
  surfaceTone,
  surfaceBand,
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const onDarkBand = isPlacementDarkBand({
    section_theme: section_theme ?? sectionThemeProp,
    surfaceTone,
    surfaceBand,
  });
  const lightBand = !onDarkBand;
  const eyebrow = (in_page_nav_title || "").trim();

  if (!items.length && !cmsMode) return null;

  return (
    <section
      id={id || undefined}
      className={`relative w-full overflow-hidden py-16 sm:py-20 ${
        lightBand ? "text-ink" : "text-white"
      }`}
    >
      {!lightBand ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand) 45%, transparent), transparent 42%), radial-gradient(circle at 85% 70%, color-mix(in srgb, white 18%, transparent), transparent 40%)",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 0%, color-mix(in srgb, var(--brand-soft) 80%, transparent), transparent 45%)",
          }}
        />
      )}
      <SectionWrapper className="relative z-[1]">
        {(section_title || sub_title || eyebrow || cmsMode) && (
          <header className="mb-10 flex max-w-3xl flex-col gap-3 sm:mb-12">
            {eyebrow || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
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
                    <span className={lightBand ? "italic opacity-60" : "italic text-white/35"}>
                      Add eyebrow…
                    </span>
                  )}
                </p>
              </CmsEditable>
            ) : null}
            {section_title || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
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
            ) : null}
            {sub_title || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
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
            ) : null}
          </header>
        )}

        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className={
            lightBand
              ? undefined
              : "[&_p]:text-white/60 [&_button]:border-white/30 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:bg-white/20"
          }
        />

        {items.length ? (
          <MobileCardPeekRow
            gapClassName="gap-4 sm:gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <WhyChooseItemCard
                key={item._id || item.id || i}
                item={item}
                index={i}
                variant={lightBand ? "light" : "dark"}
              />
            ))}
          </MobileCardPeekRow>
        ) : (
          <EmptyItemsHint sectionKey={section_key} onEditField={onEditField} />
        )}

        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          inverted={!lightBand}
          className="mt-8 sm:mt-10"
        />
      </SectionWrapper>
    </section>
  );
}
