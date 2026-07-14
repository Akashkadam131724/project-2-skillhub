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

function Atmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute top-[6%] left-[8%] size-96 rounded-full bg-[#3B82F6]/20 blur-[42px]" />
      <div className="absolute right-[6%] bottom-0 size-[32rem] rounded-full bg-[#A855F7]/20 blur-[42px]" />
      <div className="absolute top-1/2 left-[35%] hidden h-80 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06B6D4]/15 blur-[56px] lg:block" />
    </div>
  );
}

/** Classic navy gradient hero — optional right-side image. */
export default function HeroClassicSection({
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
    shouldHideEmptyHero("hero_classic", {
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
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(157.967deg, rgb(15, 23, 42) 0%, rgb(0, 35, 109) 50%, rgb(15, 23, 42) 100%)",
      }}
    >
      <Atmosphere />
      <SectionWrapper className="relative z-10 py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasImage
              ? "grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12"
              : "flex flex-col"
          }
        >
          <div className="flex min-w-0 flex-col">
            <div className="flex max-w-2xl flex-col gap-4 sm:gap-5">
              <HeroTitle
                section_title={section_title}
                cmsMode={cmsMode}
                onEditField={onEditField}
                inverted
                className="m-0 text-[28px] leading-[1.15] font-semibold tracking-tight text-white sm:text-[34px] lg:text-[40px]"
              />
              <HeroSubtitle
                sub_title={sub_title}
                cmsMode={cmsMode}
                onEditField={onEditField}
                inverted
                className="text-[15px] leading-relaxed text-slate-200 sm:text-base"
              />
              <HeroBody
                data={data}
                cmsMode={cmsMode}
                onEditField={onEditField}
                inverted
                className="text-[15px] leading-relaxed text-slate-300 sm:text-base"
              />
            </div>
            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              inverted
              className="mt-7 sm:mt-8"
            />
            {cmsMode && !hasImage ? (
              <div className="mt-4">
                <HeroImage
                  section_img_url={section_img_url}
                  cmsMode={cmsMode}
                  onEditField={onEditField}
                  inverted
                />
              </div>
            ) : null}
          </div>

          {hasImage ? (
            <HeroImage
              section_img_url={section_img_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              inverted
              className="w-full"
              imgClassName="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg ring-1 ring-white/10"
            />
          ) : null}
        </div>
      </SectionWrapper>
    </section>
  );
}
