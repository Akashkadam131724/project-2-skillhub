"use client";

import { useEffect, useRef, useState } from "react";
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
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=80";

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
          <dd className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-ink sm:text-2xl dark:text-white">
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

function HeroVisualPanel({ imageUrl, cmsMode, onEditField, section_img_url, section_title }) {
  const resolved = imageUrl || DEFAULT_HERO_IMAGE;

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div
        aria-hidden
        className="absolute -right-6 -bottom-8 size-48 rounded-full bg-brand/15 blur-3xl sm:size-56"
      />
      <div
        aria-hidden
        className="absolute top-8 -left-6 size-36 rounded-full bg-ink/5 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_32px_80px_-32px_color-mix(in_srgb,var(--ink)_28%,transparent)] dark:border-slate-800 dark:bg-slate-950">
        {cmsMode && !hasMediaUrl(section_img_url) ? (
          <div className="absolute top-4 left-4 z-10">
            <HeroImage
              section_img_url={section_img_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
            />
          </div>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolved}
          alt={mediaAlt(section_title, "Hero image")}
          className="aspect-[5/4] w-full rounded-[1.35rem] object-cover"
        />

        <div className="absolute inset-x-4 bottom-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-950/90">
            <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Active paths
            </p>
            <p className="mt-1 mb-0 text-sm font-semibold text-ink dark:text-white">
              Cloud · Security · Data
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-950/90">
            <p className="m-0 text-[10px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Outcome focus
            </p>
            <p className="mt-1 mb-0 text-sm font-semibold text-ink dark:text-white">
              Role-based learning tracks
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -top-3 -right-2 hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-md sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-white">
        <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-500" />
        Live catalog
      </div>
    </div>
  );
}

/** Modern editorial hero — light surface, image panel, trust stats. */
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
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  const cmsImageUrl = mediaUrl(section_img_url);
  const hasImage = hasMediaUrl(section_img_url);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <Atmosphere />
      <SectionWrapper className="relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-16">
          <div
            className={`flex min-w-0 flex-col transition duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <p className="m-0 mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
              <span className="size-1.5 rounded-full bg-brand" />
              Workforce learning platform
            </p>

            <div className="flex max-w-2xl flex-col gap-5 sm:gap-6">
              <HeroTitle
                section_title={section_title}
                cmsMode={cmsMode}
                onEditField={onEditField}
                className="m-0 font-[family-name:var(--font-display)] text-[2.15rem] leading-[1.06] font-semibold tracking-tight text-ink sm:text-[2.75rem] lg:text-[3.5rem] dark:text-white"
              />
              <HeroSubtitle
                sub_title={sub_title}
                cmsMode={cmsMode}
                onEditField={onEditField}
                className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300"
              />
              <HeroBody
                data={data}
                cmsMode={cmsMode}
                onEditField={onEditField}
                className="max-w-xl text-[15px] leading-relaxed text-slate-500 sm:text-base dark:text-slate-400"
              />
            </div>

            <SectionButtonsFooter
              buttons={buttons}
              button_title={button_title}
              target_url={target_url}
              cmsMode={cmsMode}
              onEditField={onEditField}
              onFormOpen={onFormOpen}
              className="mt-7 sm:mt-8"
              buttonsClassName="flex flex-wrap items-center gap-3"
            />

            <TrustRow />
          </div>

          <div
            className={`transition duration-700 delay-150 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            {hasImage ? (
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <HeroImage
                  section_img_url={section_img_url}
                  cmsMode={cmsMode}
                  onEditField={onEditField}
                  title={section_title}
                  className="w-full"
                  imgClassName="aspect-[5/4] w-full rounded-[1.75rem] object-cover shadow-[0_32px_80px_-32px_color-mix(in_srgb,var(--ink)_28%,transparent)] ring-1 ring-slate-200/80 dark:ring-slate-800"
                />
              </div>
            ) : (
              <HeroVisualPanel
                imageUrl={cmsImageUrl}
                cmsMode={cmsMode}
                onEditField={onEditField}
                section_img_url={section_img_url}
                section_title={section_title}
              />
            )}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
