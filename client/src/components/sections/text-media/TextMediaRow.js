"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { isRichTextEmpty } from "@/lib/rich-text";

function resolveMediaPosition(item, index) {
  const raw = String(item?.value || "")
    .trim()
    .toLowerCase();
  if (raw === "start" || raw === "left") return "start";
  if (raw === "end" || raw === "right") return "end";
  return index % 2 === 0 ? "end" : "start";
}

/**
 * One text + media row. `value` = media position: "start" | "end".
 */
export default function TextMediaRow({ item, index = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const title = item?.title || "";
  const subtitle = item?.subtitle || "";
  const body = item?.body || "";
  const imgUrl = mediaUrl(item?.image_url);
  const mediaPosition = resolveMediaPosition(item, index);
  const mediaEnd = mediaPosition === "end";

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
      {title ? (
        <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl leading-[1.12] font-semibold tracking-tight text-ink sm:text-[2.1rem] dark:text-white">
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p className="m-0 text-base font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      ) : null}
      {!isRichTextEmpty(body) ? (
        <CmsRichText
          html={body}
          className="text-[15px] leading-relaxed text-slate-700 sm:text-base dark:text-slate-200"
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
            alt={mediaAlt(item, "Media")}
            loading="lazy"
            className="aspect-[5/4] h-auto w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[5/4] w-full items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 text-sm text-slate-400 italic dark:border-slate-700 dark:text-slate-600">
          Add media image…
        </div>
      )}
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
