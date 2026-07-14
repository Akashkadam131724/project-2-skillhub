"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionItemCard from "@/components/sections/SectionItemCard";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaUrl } from "@/lib/cms-api";
import {
  bannerBgStyle,
  DEFAULT_STATS_BG,
  isBannerGradient,
} from "@/lib/banner-bg";
import { resolveItemsForSection } from "@/lib/item-types";

/**
 * Stats band — colored / gradient surface with white rounded divider grid.
 * Background: data.bg_color (solid or CSS gradient), optional section_bg_img.
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
  cmsMode,
  onEditField,
  section_bg_img,
  data,
  buttons,
  button_title,
  target_url,
  onFormOpen,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  const bgUrl = mediaUrl(section_bg_img);
  const bgValue = String(data?.bg_color || "").trim() || DEFAULT_STATS_BG;
  const showTitle = Boolean(section_title) || cmsMode;
  const showSubtitle = Boolean(sub_title) || cmsMode;

  return (
    <section
      className="relative w-full overflow-hidden py-10 sm:py-14"
      style={!bgUrl ? bannerBgStyle(bgValue) : undefined}
    >
      {bgUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              ...(isBannerGradient(bgValue)
                ? { backgroundImage: bgValue }
                : { backgroundColor: bgValue }),
              opacity: 0.88,
            }}
            aria-hidden
          />
        </>
      ) : null}

      <SectionWrapper className="relative z-[1]">
        {showTitle || showSubtitle ? (
          <header className="mb-6 flex flex-col items-center text-center sm:mb-8">
            {showTitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
                className="w-auto max-w-3xl justify-center text-center"
              >
                {section_title ? (
                  <h2 className="m-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {section_title}
                  </h2>
                ) : (
                  <h2 className="m-0 text-2xl font-bold text-white/40 italic sm:text-3xl">
                    Add title…
                  </h2>
                )}
              </CmsEditable>
            ) : null}
            {showSubtitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="sub_title"
                label="Subtitle"
                onEditField={onEditField}
                className="mt-2 w-auto max-w-2xl justify-center text-center"
              >
                {sub_title ? (
                  <p className="m-0 text-[15px] text-white/90 sm:text-base">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-[15px] text-white/40 italic sm:text-base">
                    Add subtitle…
                  </p>
                )}
              </CmsEditable>
            ) : null}
          </header>
        ) : null}

        <CmsSectionItemsBar
          sectionKey={section_key}
          cmsMode={cmsMode}
          onEditField={onEditField}
          itemCount={items.length}
          className="[&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:text-white"
        />

        {items.length ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-950 dark:ring-white/10">
            <ul className="m-0 grid list-none grid-cols-2 divide-x divide-y divide-[#c5ebf5] p-0 lg:grid-cols-4 dark:divide-slate-800">
              {items.map((item, i) => (
                <li key={item._id || item.id || i} className="min-w-0">
                  <SectionItemCard type="stat" item={item} />
                </li>
              ))}
            </ul>
          </div>
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
          className="mt-6 flex flex-col items-center sm:mt-8"
          buttonsClassName="flex flex-wrap items-center justify-center gap-3"
        />
      </SectionWrapper>
    </section>
  );
}
