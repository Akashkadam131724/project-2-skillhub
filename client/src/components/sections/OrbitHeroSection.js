"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Launch-UI / SaaS style hero — badge, display type, dual CTA, browser product frame.
 * Inspired by 2026 landing kits (Launch UI, saas-blocks) without purple glow tropes.
 */
export default function OrbitHeroSection({
  section_title,
  sub_title,
  section_img_url,
  data,
  buttons,
  button_title,
  target_url,
  cmsMode,
  onEditField,
  onFormOpen,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const img = mediaUrl(section_img_url || data?.image_url);
  const badge = data?.label || data?.eyebrow || "";
  const body = data?.body || "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!cmsMode && !section_title && !sub_title && !img) return null;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#f8fafc_0%,#ffffff_40%,#eef2f7_100%)] py-16 sm:py-20 lg:py-24 dark:bg-none dark:bg-slate-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto flex max-w-3xl flex-col items-center text-center transition duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {badge ? (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-ink shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <span className="size-1.5 rounded-full bg-brand" />
              {badge}
            </span>
          ) : null}

          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
            className="justify-center"
          >
            {section_title || cmsMode ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.5rem)] leading-[1.05] font-semibold tracking-tight text-ink dark:text-white">
                {section_title || "Headline"}
              </h1>
            ) : null}
          </CmsEditable>

          <CmsEditable
            cmsMode={cmsMode}
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
            className="justify-center"
          >
            {sub_title || cmsMode ? (
              <p className="mt-5 mb-0 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                {sub_title || "Supporting line"}
              </p>
            ) : null}
          </CmsEditable>

          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="mt-4 max-w-xl text-sm text-slate-500 dark:text-slate-400"
            />
          ) : null}

          <SectionButtonsFooter
            buttons={buttons}
            button_title={button_title}
            target_url={target_url}
            cmsMode={cmsMode}
            onEditField={onEditField}
            onFormOpen={onFormOpen}
            className="mt-8 flex flex-col items-center"
            buttonsClassName="flex flex-wrap items-center justify-center gap-3"
          />
        </div>

        <div
          className={`relative mx-auto mt-12 max-w-5xl transition duration-1000 delay-150 sm:mt-16 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(11,31,77,0.35)] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                app.skillhub.io
              </span>
            </div>
            <div className="relative aspect-[16/9] bg-ink">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={mediaAlt(section_title, "Product preview")}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--ink),var(--brand))]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
