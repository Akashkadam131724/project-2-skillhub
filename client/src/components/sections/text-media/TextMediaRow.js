"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import { mediaUrl } from "@/lib/cms-api";
import { isRichTextEmpty } from "@/lib/rich-text";

function resolveMediaPosition(item, index) {
  const raw = String(item?.value || "")
    .trim()
    .toLowerCase();
  if (raw === "start" || raw === "left") return "start";
  if (raw === "end" || raw === "right") return "end";
  // Alternate: first row media end (right), second media start (left)
  return index % 2 === 0 ? "end" : "start";
}

/**
 * One text + media row. `value` = media position: "start" | "end".
 * Links live in rich body (no separate link label / URL fields).
 */
export default function TextMediaRow({ item, index = 0 }) {
  const title = item?.title || "";
  const body = item?.body || "";
  const imgUrl = mediaUrl(item?.image_url);
  const mediaPosition = resolveMediaPosition(item, index);
  const mediaEnd = mediaPosition === "end";

  const textCol = (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
      {title ? (
        <h2 className="m-0 text-2xl leading-tight font-bold tracking-tight text-ink sm:text-[1.75rem] md:text-3xl dark:text-white">
          {title}
        </h2>
      ) : null}

      {!isRichTextEmpty(body) ? (
        <CmsRichText
          html={body}
          className="text-[15px] leading-relaxed text-slate-700 sm:text-base dark:text-slate-200"
        />
      ) : null}
    </div>
  );

  const mediaCol = imgUrl ? (
    <div
      className={`min-w-0 w-full overflow-hidden rounded-xl md:w-4/5 ${
        mediaEnd ? "md:ml-auto" : "md:mr-auto"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt=""
        loading="lazy"
        className="aspect-[4/3] h-auto max-h-64 w-full object-cover sm:max-h-72 md:max-h-80"
      />
    </div>
  ) : (
    <div
      className={`flex aspect-[4/3] w-full max-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 italic sm:max-h-72 md:w-4/5 md:max-h-80 dark:border-slate-700 dark:text-slate-600 ${
        mediaEnd ? "md:ml-auto" : "md:mr-auto"
      }`}
    >
      Add media image…
    </div>
  );

  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
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
