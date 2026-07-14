"use client";

import SectionWrapper from "../SectionWrapper";
import SectionButtonsFooter from "../SectionButtonsFooter";
import {
  HeroTitle,
  HeroSubtitle,
  HeroBody,
  HeroImage,
  hasMediaUrl,
  shouldHideEmptyHero,
} from "./HeroFields";

/** Dual-panel hero — soft wash; image only when set. */
export default function HeroDualCtaSection({
  section_title,
  sub_title,
  data,
  section_img_url,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  if (
    shouldHideEmptyHero("hero_dual_cta", {
      section_title,
      sub_title,
      data,
      section_img_url,
      buttons,
      button_title,
      target_url,
      cmsMode,
    })
  ) {
    return null;
  }

  const hasImage = hasMediaUrl(section_img_url);

  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-brand-soft dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
              : "flex flex-col"
          }
        >
          <div className="flex flex-col gap-4">
            <p className="m-0 text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">
              SkillHub
            </p>
            <HeroTitle
              section_title={section_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="m-0 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl dark:text-white"
            />
            <HeroSubtitle
              sub_title={sub_title}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
            />
            <HeroBody
              data={data}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
            />
            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              className="mt-3"
            />
            {cmsMode && !hasImage ? (
              <HeroImage
                section_img_url={section_img_url}
                cmsMode={cmsMode}
                onEditField={onEditField}
              />
            ) : null}
          </div>
          {hasImage ? (
            <HeroImage
              section_img_url={section_img_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              className="w-full"
              imgClassName="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg shadow-slate-200/60 dark:shadow-none"
            />
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
