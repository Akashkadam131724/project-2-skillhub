"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import { HeroTitle, HeroSubtitle, shouldHideEmptyHero } from "./HeroFields";

/** Minimal light hero — tight type, single accent rule. */
export default function HeroMinimalSection({
  section_title,
  sub_title,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  if (
    shouldHideEmptyHero("hero_minimal", {
      section_title,
      sub_title,
      buttons,
      button_title,
      target_url,
      cmsMode,
    })
  ) {
    return null;
  }

  return (
    <section className="border-b border-slate-200 dark:border-slate-800">
      <SectionWrapper className="py-10 sm:py-12">
        <div className="h-1 w-12 rounded-full bg-brand" aria-hidden />
        <div className="mt-5 flex max-w-xl flex-col gap-3">
          <HeroTitle
            section_title={section_title}
            cmsMode={cmsMode}
            onEditField={onEditField}
            className="m-0 text-2xl leading-snug font-bold tracking-tight section-theme-heading sm:text-3xl"
          />
          <HeroSubtitle
            sub_title={sub_title}
            cmsMode={cmsMode}
            onEditField={onEditField}
            className="text-[15px] leading-relaxed section-theme-muted"
          />
        </div>
        <SectionButtonsFooter
          buttons={buttons}
          button_title={button_title}
          target_url={target_url}
          cmsMode={cmsMode}
          onEditField={onEditField}
          onFormOpen={onFormOpen}
          className="mt-6"
        />
      </SectionWrapper>
    </section>
  );
}
