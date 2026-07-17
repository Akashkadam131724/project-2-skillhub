"use client";

import { useEffect, useRef, useState } from "react";
import CmsEditable from "@/components/cms/CmsEditable";
import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtonsFooter from "@/components/sections/SectionButtonsFooter";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { isRichTextEmpty } from "@/lib/rich-text";

/**
 * Full-bleed ink CTA band — strong close for marketing pages.
 */
export default function CtaBandSection({
  section_title,
  sub_title,
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
  const body = data?.body || "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (
    !cmsMode &&
    !section_title &&
    !sub_title &&
    isRichTextEmpty(body)
  ) {
    return null;
  }

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-ink py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-brand/25 to-transparent"
      />

      <SectionWrapper>
        <div
          className={`relative mx-auto flex max-w-3xl flex-col items-center text-center transition duration-700 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <CmsEditable
            cmsMode={cmsMode}
            field="section_title"
            label="Title"
            onEditField={onEditField}
          >
            {section_title || cmsMode ? (
              <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {section_title || (cmsMode ? "Call to action" : null)}
              </h2>
            ) : null}
          </CmsEditable>

          <CmsEditable
            cmsMode={cmsMode}
            field="sub_title"
            label="Subtitle"
            onEditField={onEditField}
          >
            {sub_title || cmsMode ? (
              <p className="mt-4 mb-0 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
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
                className="mt-3 max-w-xl text-sm leading-relaxed text-white/65"
                empty={
                  cmsMode ? (
                    <p className="m-0 text-white/35 italic">Optional body…</p>
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
            className="mt-8 justify-center"
          />
        </div>
      </SectionWrapper>
    </section>
  );
}
