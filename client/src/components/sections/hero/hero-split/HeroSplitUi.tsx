import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroBody, HeroImage, HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import type { HeroSplitUiProps } from "./lib/types";

/** Split layout — copy left, optional image right (hidden when empty). */
export default function HeroSplitUi({
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
}: HeroSplitUiProps) {
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
              ? "grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              : "flex flex-col"
          }
        >
          <div className="flex min-w-0 flex-col gap-4">
            {titleSlot ?? (
              <HeroTitle
                title={title}
                className="section-theme-heading m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl"
              />
            )}
            {subtitleSlot ?? (
              <HeroSubtitle
                subtitle={subtitle}
                className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
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
                imgClassName="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            ) : null)}
        </div>
      </SectionWrapper>
    </section>
  );
}
