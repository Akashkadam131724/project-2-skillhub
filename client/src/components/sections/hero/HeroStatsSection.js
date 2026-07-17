"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import { HeroTitle, HeroSubtitle, shouldHideEmptyHero } from "./HeroFields";

/** Hero with inline proof stats — stats grid only when items exist. */
export default function HeroStatsSection({
  section_title,
  sub_title,
  items,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  if (
    shouldHideEmptyHero("hero_stats", {
      section_title,
      sub_title,
      items,
      buttons,
      button_title,
      target_url,
      cmsMode,
    })
  ) {
    return null;
  }

  const stats = Array.isArray(items)
    ? items.filter(
        (i) =>
          i?.status !== false &&
          Boolean(i?.value || i?.label || i?.title)
      )
    : [];
  const hasStats = stats.length > 0;

  return (
    <section className="border-b border-slate-200 text-white dark:border-slate-800">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasStats
              ? "grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14"
              : "flex flex-col gap-4"
          }
        >
          <div className="flex flex-col gap-4">
            <HeroTitle
              section_title={section_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              inverted
              className="m-0 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl"
            />
            <HeroSubtitle
              sub_title={sub_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              inverted
              className="max-w-xl text-base leading-relaxed text-slate-200"
            />
            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              inverted
              className="mt-2"
            />
            {cmsMode && !hasStats ? (
              <button
                type="button"
                onClick={() => onEditField?.("items")}
                className="mt-1 self-start rounded-md border border-dashed border-white/40 px-3 py-1.5 text-xs text-white/70"
              >
                Add stats…
              </button>
            ) : null}
          </div>

          {hasStats ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-4"
                >
                  <p className="m-0 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {item.value || "—"}
                  </p>
                  <p className="mt-1 mb-0 text-xs font-medium tracking-wide text-slate-300 uppercase">
                    {item.label || item.title || ""}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
