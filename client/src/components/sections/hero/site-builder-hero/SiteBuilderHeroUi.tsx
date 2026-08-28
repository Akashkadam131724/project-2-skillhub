import CmsRichText from "@/components/cms/primitives/CmsRichText";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { SiteBuilderHeroUiProps } from "./lib/types";

/**
 * Editorial website-builder hero inspired by Squarespace's bold homepage.
 */
export default function SiteBuilderHeroUi({
  id,
  imageUrl,
  imageAlt,
  badge,
  title,
  subtitle,
  body = "",
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: SiteBuilderHeroUiProps) {
  const showTitle = titleSlot != null || Boolean(title);
  const showSubtitle = subtitleSlot != null || Boolean(subtitle);
  const showBody = bodySlot != null || !isRichTextEmpty(body);

  return (
    <section
      id={id || undefined}
      className="relative isolate overflow-hidden bg-[#0b0b0a] text-white"
    >
      <div className="absolute inset-x-0 top-0 z-[1] border-b border-white/10 bg-[#0b0b0a]/85 backdrop-blur">
        <SectionWrapper className="flex h-14 items-center justify-between text-xs font-semibold tracking-[0.18em] uppercase">
          <span>{badge || "Build Studio"}</span>
          <span className="hidden text-white/55 sm:inline">
            Websites · Stores · Domains
          </span>
        </SectionWrapper>
      </div>

      <SectionWrapper className="grid min-h-[92vh] items-end gap-10 pt-28 pb-8 lg:grid-cols-12 lg:pt-32 lg:pb-12">
        <div className="relative z-[2] lg:col-span-7">
          {titleSlot ??
            (showTitle ? (
              <h1 className="m-0 max-w-4xl font-[family-name:var(--font-display)] text-[clamp(3.5rem,10vw,8.8rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-white">
                {title}
              </h1>
            ) : null)}

          {subtitleSlot ??
            (showSubtitle ? (
              <p className="mt-7 mb-0 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl">
                {subtitle}
              </p>
            ) : null)}

          {bodySlot ??
            (showBody ? (
              <CmsRichText
                html={body}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/55"
              />
            ) : null)}

          {footer}
        </div>

        <div className="relative min-h-[24rem] lg:col-span-5 lg:min-h-[34rem]">
          <div className="absolute -right-10 bottom-0 w-[80%] rotate-3 overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-2xl">
            <div className="aspect-[3/4] bg-slate-200">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={imageAlt || mediaAlt(title, "Site preview")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(145deg,#f4efe8,#b5c7bc)]" />
              )}
            </div>
          </div>
          <div className="absolute bottom-14 left-0 w-[72%] -rotate-2 overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#f5f0e8] p-4 shadow-2xl">
            <div className="grid gap-3">
              <div className="h-24 rounded-xl bg-[#1f1f1b]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-28 rounded-xl bg-[#d8cbbb]" />
                <div className="h-28 rounded-xl bg-[#a7b5a7]" />
              </div>
              <div className="h-3 w-2/3 rounded-full bg-[#1f1f1b]/30" />
            </div>
          </div>
          <div className="absolute top-10 right-10 hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase backdrop-blur sm:block">
            No code needed
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
