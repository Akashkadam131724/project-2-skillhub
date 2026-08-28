import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroBody, HeroImage, HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import type { HeroDualCtaUiProps } from "./lib/types";

/** Dual-panel hero — soft wash; image only when set. */
export default function HeroDualCtaUi({
  id,
  title,
  subtitle,
  body,
  imageUrl,
  titleSlot,
  subtitleSlot,
  bodySlot,
  imageSlot,
  imageAddSlot = null,
  footer = null,
}: HeroDualCtaUiProps) {
  const hasImage = Boolean(imageUrl || imageSlot);

  return (
    <section
      id={id || undefined}
      className="border-b border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div
          className={
            hasImage
              ? "grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
              : "flex flex-col"
          }
        >
          <div className="flex flex-col gap-4">
            <p className="text-brand m-0 text-[11px] font-semibold tracking-[0.16em] uppercase">
              SkillHub
            </p>
            {titleSlot ?? (
              <HeroTitle
                title={title}
                className="section-theme-heading m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              />
            )}
            {subtitleSlot ?? (
              <HeroSubtitle
                subtitle={subtitle}
                className="section-theme-muted text-base leading-relaxed"
              />
            )}
            {bodySlot ?? (
              <HeroBody
                body={body}
                className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
              />
            )}
            {footer}
            {imageAddSlot}
          </div>
          {imageSlot ??
            (imageUrl ? (
              <HeroImage
                imageUrl={imageUrl}
                title={title}
                className="w-full"
                imgClassName="aspect-[5/4] w-full rounded-2xl object-cover shadow-lg shadow-slate-200/60 dark:shadow-none"
              />
            ) : null)}
        </div>
      </SectionWrapper>
    </section>
  );
}
