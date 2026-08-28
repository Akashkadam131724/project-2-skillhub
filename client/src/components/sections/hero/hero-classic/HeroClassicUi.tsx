import SectionWrapper from "@/components/sections/SectionWrapper";
import { HeroBody, HeroImage, HeroSubtitle, HeroTitle } from "../shared/hero-fields";
import { mediaAlt } from "@/lib/utils/media-alt";
import { lcpImgProps } from "@/components/sections/hero/shared/lib/lcp-image";
import type { HeroClassicUiProps } from "./lib/types";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=75";

const TRUST_STATS = [
  { value: "8,500+", label: "Learners yearly" },
  { value: "120+", label: "Enterprise clients" },
  { value: "40+", label: "Countries" },
];

function Atmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_-10%,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,color-mix(in_srgb,var(--ink)_6%,transparent),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 0%, black, transparent)",
        }}
      />
    </div>
  );
}

function TrustRow() {
  return (
    <dl className="m-0 mt-8 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6 sm:mt-10 sm:gap-6 dark:border-slate-800">
      {TRUST_STATS.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight sm:text-2xl">
            {stat.value}
          </dd>
          <dd className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:text-xs dark:text-slate-400">
            {stat.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function HeroVisualPanel({
  imageUrl,
  sectionTitle,
  imageAddSlot = null,
}: {
  imageUrl: string;
  sectionTitle?: string;
  imageAddSlot?: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden
        className="bg-brand/15 absolute -right-6 -bottom-8 size-48 rounded-full blur-3xl sm:size-56"
      />
      <div
        aria-hidden
        className="absolute top-8 -left-6 size-36 rounded-full bg-ink/5 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_32px_80px_-32px_color-mix(in_srgb,var(--ink)_28%,transparent)]">
        {imageAddSlot ? (
          <div className="absolute top-4 left-4 z-10">{imageAddSlot}</div>
        ) : null}
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.35rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={mediaAlt(sectionTitle, "Hero image")}
            className="absolute inset-0 h-full w-full object-cover"
            {...lcpImgProps()}
          />
        </div>

        <div className="absolute inset-x-4 bottom-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md">
            <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Active paths
            </p>
            <p className="section-theme-heading mt-1 mb-0 text-sm font-semibold">
              Cloud · Security · Data
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md">
            <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Outcome focus
            </p>
            <p className="section-theme-heading mt-1 mb-0 text-sm font-semibold">
              Role-based learning tracks
            </p>
          </div>
        </div>
      </div>

      <div className="section-ui-card section-theme-heading absolute -top-3 -right-2 hidden rounded-full border px-3 py-1.5 text-xs font-semibold shadow-md sm:inline-flex">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-500" />
        Live catalog
      </div>
    </div>
  );
}

/** Modern editorial hero — light surface, image panel, trust stats. */
export default function HeroClassicUi({
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
  visualSlot,
  footer = null,
}: HeroClassicUiProps) {
  const resolvedVisual =
    visualSlot ??
    (imageSlot ? (
      <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
        {imageSlot}
      </div>
    ) : imageUrl ? (
      <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
        <HeroImage imageUrl={imageUrl} title={title} className="w-full" />
      </div>
    ) : (
      <HeroVisualPanel
        imageUrl={DEFAULT_HERO_IMAGE}
        sectionTitle={title}
        imageAddSlot={imageAddSlot}
      />
    ));

  return (
    <section id={id || undefined} className="relative overflow-hidden">
      <Atmosphere />
      <SectionWrapper className="relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <p className="section-ui-card m-0 mb-4 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase shadow-sm backdrop-blur-sm dark:text-slate-300">
              <span className="bg-brand size-1.5 rounded-full" />
              Workforce learning platform
            </p>

            <div className="flex max-w-2xl flex-col gap-5 sm:gap-6">
              {titleSlot ?? (
                <HeroTitle
                  title={title}
                  className="section-theme-heading m-0 font-[family-name:var(--font-display)] text-[2.15rem] leading-[1.06] font-semibold tracking-tight sm:text-[2.75rem] lg:text-[3.5rem]"
                />
              )}
              {subtitleSlot ?? (
                <HeroSubtitle
                  subtitle={subtitle}
                  className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
                />
              )}
              {bodySlot ?? (
                <HeroBody
                  body={body}
                  className="max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-base dark:text-slate-400"
                />
              )}
            </div>

            {footer}
            <TrustRow />
          </div>

          <div>{resolvedVisual}</div>
        </div>
      </SectionWrapper>
    </section>
  );
}
