"use client";

import CmsEditable from "@/components/cms/CmsEditable";
import CmsSectionItemsBar from "@/components/sections/CmsSectionItemsBar";
import EmptyItemsHint from "@/components/sections/EmptyItemsHint";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {
  itemStatLabel,
  itemStatValue,
  resolveItemsForSection,
} from "@/lib/item-types";

function StatCell({ item, index }) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);

  return (
    <div className="group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1] sm:min-h-[10.5rem] sm:p-6">
      <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <p className="m-0 font-[family-name:var(--font-display)] text-3xl leading-none font-semibold tracking-tight text-white sm:text-4xl">
          {value}
        </p>
        <p className="mt-3 mb-0 max-w-[14rem] text-sm leading-snug text-white/70 sm:text-[15px]">
          {label}
        </p>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-8 size-24 rounded-full bg-brand/25 blur-2xl transition group-hover:bg-brand/40"
      />
    </div>
  );
}

/**
 * Stats band — open metric tiles on the theme ink surface.
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  if (!items.length && !cmsMode) return null;

  const showTitle = Boolean(section_title) || cmsMode;
  const showSubtitle = Boolean(sub_title) || cmsMode;

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand) 45%, transparent), transparent 42%), radial-gradient(circle at 85% 70%, color-mix(in srgb, white 18%, transparent), transparent 40%)",
        }}
      />
      <SectionWrapper className="relative z-[1]">
        {showTitle || showSubtitle ? (
          <header className="mb-10 flex max-w-3xl flex-col gap-3 sm:mb-12">
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-white/50 uppercase">
              Outcomes
            </p>
            {showTitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
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
            {showSubtitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="sub_title"
                label="Subtitle"
                onEditField={onEditField}
              >
                {sub_title ? (
                  <p className="m-0 text-base leading-relaxed text-white/72">
                    {sub_title}
                  </p>
                ) : (
                  <p className="m-0 text-base text-white/40 italic">
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
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
            {items.map((item, i) => (
              <li key={item._id || item.id || i} className="min-w-0">
                <StatCell item={item} index={i} />
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
          inverted
          className="mt-8 flex flex-col items-start sm:mt-10"
          buttonsClassName="flex flex-wrap items-center gap-3"
        />
      </SectionWrapper>
    </section>
  );
}
