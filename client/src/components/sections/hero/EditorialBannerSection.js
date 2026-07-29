"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Full-bleed editorial banner — large display type over a dominant image plane.
 */
export default function EditorialBannerSection({
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
  const body = data?.body || "";
  const fallbackBg = {
    backgroundImage:
      "radial-gradient(ellipse at 20% 20%, color-mix(in srgb, var(--brand) 78%, white 10%) 0%, transparent 45%), linear-gradient(160deg, var(--ink) 0%, color-mix(in srgb, var(--ink) 64%, var(--brand) 36%) 55%, var(--ink) 100%)",
  };
  const bottomOverlay = {
    backgroundImage:
      "linear-gradient(to top, color-mix(in srgb, var(--ink) 55%, transparent), transparent 45%)",
  };

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
      className="relative isolate min-h-[70vh] w-full overflow-hidden bg-ink text-white sm:min-h-[78vh]"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={mediaAlt(section_title, "Editorial banner")}
          className={`absolute inset-0 h-full w-full object-cover transition duration-[1.4s] ease-out ${
            visible ? "scale-100 opacity-100" : "scale-105 opacity-80"
          }`}
        />
      ) : (
        <div className="absolute inset-0" style={fallbackBg} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/70 to-ink/25" />
      <div className="absolute inset-0" style={bottomOverlay} />

      <div className="relative mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-4 py-16 sm:min-h-[78vh] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div
          className={`max-w-3xl transition duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title || cmsMode ? (
              <h1 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                {section_title || (cmsMode ? "Headline" : null)}
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
              <p className="mt-5 mb-0 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                {sub_title || (cmsMode ? "Supporting line" : null)}
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
                className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70"
                empty={
                  cmsMode ? (
                    <p className="m-0 text-white/40 italic">Add body copy…</p>
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
            className="mt-8"
          />
        </div>
      </div>
    </section>
  );
}
