"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Oversized typographic statement over a soft image wash — modern manifesto band.
 */
export default function StatementBandSection({
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
  const eyebrow = data?.eyebrow || data?.label || "";
  const body = data?.body || "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (
    !cmsMode &&
    !section_title &&
    !sub_title &&
    isRichTextEmpty(body) &&
    !img
  ) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[85vh] w-full overflow-hidden bg-ink text-white"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={mediaAlt(section_title, "Statement background")}
          className={`absolute inset-0 h-full w-full object-cover transition duration-[1.6s] ease-out ${
            visible ? "scale-100 opacity-40" : "scale-110 opacity-20"
          }`}
        />
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_srgb,var(--brand)_35%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-[1400px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div
          className={`max-w-5xl transition duration-800 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {eyebrow ? (
            <p className="m-0 mb-5 text-xs font-semibold tracking-[0.28em] text-white/55 uppercase">
              {eyebrow}
            </p>
          ) : null}

          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title || cmsMode ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight text-white">
                {section_title || "Statement"}
              </h1>
            ) : null}
          </CmsEditable>

          <CmsEditable
            cmsMode={cmsMode}
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title || cmsMode ? (
              <p className="mt-8 mb-0 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                {sub_title || "Supporting line"}
              </p>
            ) : null}
          </CmsEditable>

          {!isRichTextEmpty(body) || cmsMode ? (
            <CmsEditable
              cmsMode={cmsMode}
              field="body"
              label="Body"
              onEditField={onEditField}
            >
              <CmsRichText
                html={body}
                className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60"
                empty={
                  cmsMode ? (
                    <p className="m-0 text-white/35 italic">Add body…</p>
                  ) : null
                }
              />
            </CmsEditable>
          ) : null}

          <SectionButtonsFooter
            buttons={buttons}
            button_title={button_title}
            target_url={target_url}
            cmsMode={cmsMode}
            onEditField={onEditField}
            onFormOpen={onFormOpen}
            inverted
            className="mt-10"
          />
        </div>
      </div>
    </section>
  );
}
