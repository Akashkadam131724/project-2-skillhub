"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionLayoutRoot } from "@/components/sections/layout";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { CtaBandUiProps } from "./lib/types";

export default function CtaBandUi({
  id,
  title,
  subtitle,
  body = "",
  titleSlot,
  subtitleSlot,
  bodySlot,
  footer = null,
}: CtaBandUiProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  const decor = (
    <>
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
    </>
  );

  return (
    <SectionLayoutRoot
      id={id}
      className="isolate bg-ink text-white"
      padding="lg"
      decor={decor}
      footer={footer}
      hasBodyContent
    >
      <div
        ref={ref}
        className={`relative mx-auto flex max-w-3xl flex-col items-center text-center transition duration-700 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        {titleSlot ??
          (title ? (
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null)}

        {subtitleSlot ??
          (subtitle ? (
            <p className="mt-4 mb-0 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {subtitle}
            </p>
          ) : null)}

        {bodySlot ??
          (!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="mt-3 max-w-xl text-sm leading-relaxed text-white/65"
            />
          ) : null)}
      </div>
    </SectionLayoutRoot>
  );
}
