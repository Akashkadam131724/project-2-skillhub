"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import { HeroTitle, HeroSubtitle, HeroBody, shouldHideEmptyHero } from "./HeroFields";

/** Asymmetric hero — oversized title + side rail CTA. */
export default function HeroAsymmetricSection({
  section_title,
  sub_title,
  data,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  if (
    shouldHideEmptyHero("hero_asymmetric", {
      section_title,
      sub_title,
      data,
      buttons,
      button_title,
      target_url,
      cmsMode,
    })
  ) {
    return null;
  }

  return (
    <section className="overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(14rem,0.8fr)] lg:gap-10">
          <div className="min-w-0">
            <div className="mb-4 h-1.5 w-16 bg-brand" aria-hidden />
            <HeroTitle
              section_title={section_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="m-0 text-4xl leading-[1.05] font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl dark:text-white"
            />
            <HeroSubtitle
              sub_title={sub_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
            />
            <HeroBody
              data={data}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
            />
          </div>

          <aside className="flex flex-col justify-between gap-6 rounded-2xl bg-ink p-6 text-white sm:p-7">
            <p className="m-0 text-xs font-semibold tracking-[0.16em] text-brand/80 uppercase">
              Get started
            </p>
            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              inverted
              className="mt-0 flex-col items-stretch"
            />
          </aside>
        </div>
      </SectionWrapper>
    </section>
  );
}
