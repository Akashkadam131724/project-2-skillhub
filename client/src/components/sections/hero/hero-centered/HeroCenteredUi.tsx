import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroBody, HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import type { HeroCenteredUiProps } from "./lib/types";

/** Centered editorial hero on a soft light surface. */
export default function HeroCenteredUi({
  id,
  title,
  subtitle,
  body,
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: HeroCenteredUiProps) {
  return (
    <section
      id={id || undefined}
      className="border-b border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="flex flex-col items-center py-14 text-center sm:py-16 lg:py-20">
        <div className="flex max-w-3xl flex-col items-center gap-4">
          {titleSlot ?? (
            <HeroTitle
              title={title}
              className="section-theme-heading m-0 text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl"
            />
          )}
          {subtitleSlot ?? (
            <HeroSubtitle
              subtitle={subtitle}
              className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
            />
          )}
          {bodySlot ?? (
            <HeroBody
              body={body}
              className="max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
            />
          )}
        </div>
        {footer}
      </SectionWrapper>
    </section>
  );
}
