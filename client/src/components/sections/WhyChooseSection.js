"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import MobileCardPeekRow from "@/components/sections/MobileCardPeekRow";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { resolveItemsForSection } from "@/lib/item-types";

/**
 * Theme ink “Why choose” band — glass feature cards.
 */
export default function WhyChooseSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "why_choose",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden py-16 text-white sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand) 45%, transparent), transparent 42%), radial-gradient(circle at 85% 70%, color-mix(in srgb, white 18%, transparent), transparent 40%)",
        }}
      />
      <SectionWrapper className="relative z-[1]">
        {(section_title || sub_title || cmsMode) && (
          <header className="mb-10 flex max-w-3xl flex-col gap-3 sm:mb-12">
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-white/50 uppercase">
              Why choose us
            </p>
            {section_title || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
                inverted
              >
                {section_title ? (
                  <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight text-white sm:text-4xl">
                    {section_title}
                  </h2>
                ) : (
                  <h2 className="m-0 text-3xl font-semibold text-white/40 italic sm:text-4xl">
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
                inverted
              >
                {sub_title ? (
                  <p className="m-0 max-w-2xl text-base leading-relaxed text-white/72">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-base text-white/35 italic">
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
          className="[&_p]:text-white/60 [&_button]:border-white/30 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:bg-white/20"
        />

        {items.length ? (
          <MobileCardPeekRow
            gapClassName="gap-4 sm:gap-5 lg:gap-6"
            gridClassName="sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item, i) => (
              <SectionItemCard
                key={item._id || item.id || i}
                type="why_choose"
                item={item}
                index={i}
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
          inverted
          className="mt-8 sm:mt-10"
        />
      </SectionWrapper>
    </section>
  );
}
