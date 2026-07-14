"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import { HeroTitle, HeroSubtitle, HeroBody, shouldHideEmptyHero } from "./HeroFields";

/** Centered editorial hero on a soft light surface. */
export default function HeroCenteredSection({
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
    shouldHideEmptyHero("hero_centered", {
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
    <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <SectionWrapper className="flex flex-col items-center py-14 text-center sm:py-16 lg:py-20">
        <div className="flex max-w-3xl flex-col items-center gap-4">
          <HeroTitle
            section_title={section_title}
            cmsMode={cmsMode}
            onEditField={onEditField}
            className="m-0 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl dark:text-white"
          />
          <HeroSubtitle
            sub_title={sub_title}
            cmsMode={cmsMode}
            onEditField={onEditField}
            className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
          />
          <HeroBody
            data={data}
            cmsMode={cmsMode}
            onEditField={onEditField}
            className="max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
          />
        </div>
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-8 justify-center"
        />
      </SectionWrapper>
    </section>
  );
}
