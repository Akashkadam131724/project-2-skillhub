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
import { isSectionThemeLightBand } from "@/lib/section-theme";

function StatCell({ item, index, lightBand }) {
  const value = itemStatValue(item);
  const label = itemStatLabel(item);

  if (lightBand) {
    return (
      <div
        data-light-surface
        className="group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white p-5 shadow-[0_12px_40px_-28px_color-mix(in_srgb,var(--ink)_22%,transparent)] transition hover:border-brand/25 hover:shadow-md sm:min-h-[10.5rem] sm:p-6"
      >
        <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="m-0 font-[family-name:var(--font-display)] text-3xl leading-none font-semibold tracking-tight text-ink sm:text-4xl">
            {value}
          </p>
          <p className="mt-3 mb-0 max-w-[14rem] text-sm leading-snug text-slate-600 sm:text-[15px]">
            {label}
          </p>
        </div>
      </div>
    );
  }

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
 * Stats band — ink + glass tiles by default; light section theme uses white tiles.
 */
export default function StatsSection({
  section_title,
  sub_title,
  items: mappingItems,
  section_key = "stats",
  section_theme,
  sectionTheme: sectionThemeProp,
  cmsMode,
  onEditField,
  buttons,
  button_title,
  target_url,
  onFormOpen,
}) {
  const items = resolveItemsForSection(section_key, mappingItems);
  const lightBand = isSectionThemeLightBand({
    section_theme: section_theme ?? sectionThemeProp,
  });

  if (!items.length && !cmsMode) return null;

  const showTitle = Boolean(section_title) || cmsMode;
  const showSubtitle = Boolean(sub_title) || cmsMode;

  return (
    <section
      className={`relative w-full overflow-hidden py-16 sm:py-20 ${lightBand ? "text-ink" : "text-white"
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
        {showTitle || showSubtitle ? (
          <header className="mb-10 flex max-w-3xl flex-col gap-3 sm:mb-12">
            <p
              className={`m-0 text-[11px] font-semibold tracking-[0.22em] uppercase ${lightBand ? "text-brand" : "text-white/50"
                }`}
            >
              Outcomes
            </p>
            {showTitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="section_title"
                label="Title"
                onEditField={onEditField}
                inverted={!lightBand}
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
            {showSubtitle ? (
              <CmsEditable
                cmsMode={cmsMode}
                field="sub_title"
                label="Subtitle"
                onEditField={onEditField}
                inverted={!lightBand}
              >
                {sub_title ? (
                  <p
                    className={
                      lightBand
                        ? "section-theme-muted m-0 text-base leading-relaxed"
                        : "m-0 text-base leading-relaxed text-white/72"
                    }
                  >
                    {sub_title}
                  </p>
                ) : (
                  <p
                    className={
                      lightBand
                        ? "section-theme-placeholder m-0 text-base italic"
                        : "m-0 text-base text-white/40 italic"
                    }
                  >
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
          className={
            lightBand
              ? undefined
              : "[&_p]:text-white/70 [&_button]:border-white/40 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:text-white"
          }
        />

        {items.length ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
            {items.map((item, i) => (
              <li key={item._id || item.id || i} className="min-w-0">
                <StatCell item={item} index={i} lightBand={lightBand} />
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
          inverted={!lightBand}
          className="mt-8 flex flex-col items-start sm:mt-10"
          buttonsClassName="flex flex-wrap items-center gap-3"
        />
      </SectionWrapper>
    </section>
  );
}
