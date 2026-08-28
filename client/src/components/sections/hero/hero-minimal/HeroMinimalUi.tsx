import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import type { HeroMinimalUiProps } from "./lib/types";

/** Minimal light hero — tight type, single accent rule. */
export default function HeroMinimalUi({
  id,
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  footer = null,
}: HeroMinimalUiProps) {
  return (
    <section
      id={id || undefined}
      className="border-b border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="py-10 sm:py-12">
        <div className="bg-brand h-1 w-12 rounded-full" aria-hidden />
        <div className="mt-5 flex max-w-xl flex-col gap-3">
          {titleSlot ?? (
            <HeroTitle
              title={title}
              className="section-theme-heading m-0 text-2xl leading-snug font-bold tracking-tight sm:text-3xl"
            />
          )}
          {subtitleSlot ?? (
            <HeroSubtitle
              subtitle={subtitle}
              className="section-theme-muted text-[15px] leading-relaxed"
            />
          )}
        </div>
        {footer}
      </SectionWrapper>
    </section>
  );
}
