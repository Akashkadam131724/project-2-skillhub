"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import type { TextMediaUiItem } from "./lib/types";

export default function TextMediaRow({
  item,
  index = 0,
  preview = false,
}: {
  item: TextMediaUiItem;
  index?: number;
  preview?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const title = item.title || "";
  const subtitle = item.subtitle || "";
  const body = item.body || "";
  const imgUrl = mediaUrl(item.imageUrl || "");
  const mediaEnd = item.mediaPosition !== "start";

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

  const textCol = (
    <div
      className={`flex min-w-0 flex-col gap-4 transition duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      <p className="m-0 text-[11px] font-semibold tracking-[0.2em] text-brand uppercase">
        Path {String(index + 1).padStart(2, "0")}
      </p>
      {title || preview ? (
        <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.12] font-semibold tracking-tight section-theme-heading sm:text-[2.1rem]">
          {title || (preview ? <CardPlaceholder>Headline…</CardPlaceholder> : null)}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="m-0 text-base font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      ) : null}
      {!isRichTextEmpty(body) || preview ? (
        <CmsRichText
          html={body}
          className="text-[15px] leading-relaxed text-slate-700 sm:text-base dark:text-slate-200"
          empty={
            preview ? (
              <p className="m-0 text-[15px] leading-relaxed text-slate-500">
                <CardPlaceholder>Body…</CardPlaceholder>
              </p>
            ) : null
          }
        />
      ) : null}
    </div>
  );

  const mediaCol = (
    <div
      className={`min-w-0 w-full transition duration-700 delay-100 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {imgUrl ? (
        <div className="overflow-hidden rounded-[1.75rem] shadow-[0_36px_80px_-42px_color-mix(in_srgb,var(--ink)_50%,transparent)] ring-1 ring-slate-200/70 dark:ring-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={mediaAlt({ title }, "Media")}
            loading="lazy"
            className="aspect-[5/4] h-auto w-full object-cover"
          />
        </div>
      ) : preview ? (
        <div className="flex aspect-[5/4] w-full items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 text-sm text-slate-400 italic dark:border-slate-700 dark:text-slate-600">
          Add media image…
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
    >
      {mediaEnd ? (
        <>
          {textCol}
          {mediaCol}
        </>
      ) : (
        <>
          {mediaCol}
          {textCol}
        </>
      )}
    </div>
  );
}
