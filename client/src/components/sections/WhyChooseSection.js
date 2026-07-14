"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionItemCard from "@/components/sections/SectionItemCard";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaUrl } from "@/lib/cms-api";
import { resolveItemsForSection } from "@/lib/item-types";

/**
 * Navy “Why choose” band — centered title + white icon/title/body cards (2×3).
 * Items: icon/image_url, title, body.
 */
export default function WhyChooseSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "why_choose",
  cmsMode,
  onEditField,
  section_bg_img,
  buttons,
  button_title,
  target_url,
  onFormOpen,
  id,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  const bgUrl = mediaUrl(section_bg_img);

  return (
    <section
      id={id || undefined}
      className="relative w-full overflow-hidden bg-ink py-12 text-white sm:py-14 md:py-16"
    >
      {bgUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-ink/85" aria-hidden />
        </>
      ) : null}

      <SectionWrapper className="relative z-[1]">
        {(section_title || sub_title || cmsMode) && (
          <header className="mb-8 text-center sm:mb-10">
            {section_title || cmsMode ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
                inverted
                className="justify-center"
              >
                {section_title ? (
                  <h2 className="m-0 text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl md:text-[2rem]">
                    {section_title}
                  </h2>
                ) : (
                  <h2 className="m-0 text-2xl leading-tight font-bold text-white/40 italic sm:text-3xl">
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
                className="mt-3 justify-center"
              >
                {sub_title ? (
                  <p className="m-0 mx-auto max-w-2xl text-[15px] leading-relaxed text-white/80 sm:text-base">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-[15px] text-white/35 italic sm:text-base">
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
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {items.map((item, i) => (
              <li key={item._id || item.id || i} className="min-w-0">
                <SectionItemCard type="why_choose" item={item} />
              </li>
            ))}
          </ul>
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
          className="mt-8 justify-center sm:mt-10"
        />
      </SectionWrapper>
    </section>
  );
}
