import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroBody, HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import type { HeroAsymmetricUiProps } from "./lib/types";

/** Asymmetric hero — oversized title + side rail CTA. */
export default function HeroAsymmetricUi({
  id,
  title,
  subtitle,
  body,
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: HeroAsymmetricUiProps) {
  return (
    <section
      id={id || undefined}
      className="overflow-hidden border-b border-slate-200 dark:border-slate-800"
    >
      <SectionWrapper className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(14rem,0.8fr)] lg:gap-10">
          <div className="min-w-0">
            <div className="bg-brand mb-4 h-1.5 w-16" aria-hidden />
            {titleSlot ?? (
              <HeroTitle
                title={title}
                className="section-theme-heading m-0 text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
              />
            )}
            {subtitleSlot ?? (
              <HeroSubtitle
                subtitle={subtitle}
                className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
              />
            )}
            {bodySlot ?? (
              <HeroBody
                body={body}
                className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400"
              />
            )}
          </div>

          <aside className="flex flex-col justify-between gap-6 rounded-2xl bg-ink p-6 text-white sm:p-7">
            <p className="text-brand/80 m-0 text-xs font-semibold tracking-[0.16em] uppercase">
              Get started
            </p>
            {footer}
          </aside>
        </div>
      </SectionWrapper>
    </section>
  );
}
