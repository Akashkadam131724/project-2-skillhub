"use client";

import CmsRichText from "@/components/cms/CmsRichText";
import SectionButtons from "@/components/ui/SectionButtons";
import { mediaUrl } from "@/lib/cms-api";
import { isRichTextEmpty } from "@/lib/rich-text";
import { itemTitle } from "@/lib/item-types";

function Placeholder({ children }) {
  return (
    <span className="text-slate-300 italic dark:text-slate-600">{children}</span>
  );
}

/** Photo card — image cover + title + body (training modalities) */
export function TrainingOptionCard({ item, preview = false }) {
  const title = itemTitle(item) || item?.title || "";
  const desc = item?.body || item?.subtitle || "";
  const imgSrc = mediaUrl(item?.image_url || item?.icon || "");
  const showImage = Boolean(imgSrc) || preview;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      {showImage ? (
        imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt=""
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-slate-100 text-xs text-slate-400 italic dark:bg-slate-900 dark:text-slate-600">
            Add image…
          </div>
        )
      ) : null}
      <div className="flex flex-1 flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="m-0 text-base font-bold leading-snug tracking-tight text-ink sm:text-[1.05rem] dark:text-white">
          {title || (preview ? <Placeholder>Option title…</Placeholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <Placeholder>Description…</Placeholder>
                </p>
              ) : null
            }
          />
        ) : null}
        {Array.isArray(item?.buttons) && item.buttons.length ? (
          <SectionButtons
            buttons={item.buttons}
            className="mt-auto flex flex-wrap items-center gap-2 pt-2"
          />
        ) : null}
      </div>
    </article>
  );
}

/** Award / recognition card — badge contain + title + body */
export function AwardCard({ item, preview = false }) {
  const title = itemTitle(item) || item?.title || "";
  const desc = item?.body || item?.subtitle || "";
  const imgSrc = mediaUrl(item?.image_url || item?.icon || "");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-44 w-full shrink-0 items-center justify-center bg-white px-6 py-5 sm:h-48 dark:bg-slate-950">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : preview ? (
          <span className="text-xs text-slate-400 italic dark:text-slate-600">
            Add award badge…
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="m-0 text-base font-bold leading-snug tracking-tight text-ink sm:text-[1.05rem] dark:text-white">
          {title || (preview ? <Placeholder>Award title…</Placeholder> : null)}
        </h3>
        {!isRichTextEmpty(desc) || preview ? (
          <CmsRichText
            html={desc}
            className="text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            empty={
              preview ? (
                <p className="m-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <Placeholder>Description…</Placeholder>
                </p>
              ) : null
            }
          />
        ) : null}
      </div>
    </article>
  );
}
