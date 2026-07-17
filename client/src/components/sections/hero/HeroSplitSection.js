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

/** Split layout — copy left, optional image right (hidden when empty). */
export default function HeroSplitSection({
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
    shouldHideEmptyHero("hero_split", {
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
    <section className="border-b border-slate-200 dark:border-slate-800">
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasImage
              ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              : "flex flex-col"
          }
        >
          <div className="flex min-w-0 flex-col gap-4">
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
              className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
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
              className="mt-2"
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
              imgClassName="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
