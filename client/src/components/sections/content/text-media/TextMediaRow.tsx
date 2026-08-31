"use client";

import { useEffect, useRef, useState } from "react";
import CmsRichText from "@/components/cms/primitives/CmsRichText";
import { SectionSplit, SectionStack } from "@/components/sections/layout";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import {
  DS_TYPE,
  DS_RADIUS,
  sectionClassNames,
} from "@/lib/layout/section-layout-system";
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
    <SectionStack
      gap="stackSm"
      className={sectionClassNames(
        "transition duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      )}
    >
      <p className={DS_TYPE.eyebrow}>Path {String(index + 1).padStart(2, "0")}</p>
      {title || preview ? (
        <h2
          className={sectionClassNames(
            DS_TYPE.displayTitle,
            "sm:text-[2.1rem]"
          )}
        >
          {title || (preview ? <CardPlaceholder>Headline…</CardPlaceholder> : null)}
        </h2>
      ) : null}
      {subtitle ? (
        <p className={`m-0 text-base font-medium ${DS_TYPE.subtitle}`}>{subtitle}</p>
      ) : null}
      {!isRichTextEmpty(body) || preview ? (
        <CmsRichText
          html={body}
          className={DS_TYPE.bodyBlock}
          empty={
            preview ? (
              <p className={`m-0 ${DS_TYPE.body}`}>
                <CardPlaceholder>Body…</CardPlaceholder>
              </p>
            ) : null
          }
        />
      ) : null}
    </SectionStack>
  );

  const mediaCol = (
    <div
      className={sectionClassNames(
        "min-w-0 w-full transition duration-700 delay-100 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      {imgUrl ? (
        <div
          className={sectionClassNames(
            DS_RADIUS.media,
            "overflow-hidden shadow-[0_36px_80px_-42px_color-mix(in_srgb,var(--ink)_50%,transparent)] ring-1 ring-slate-200/70 dark:ring-slate-800"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt={mediaAlt({ title }, "Media")}
            loading="lazy"
            className="aspect-[5/4] h-auto w-full object-cover"
          />
        </div>
      ) : preview ? (
        <div
          className={sectionClassNames(
            DS_RADIUS.media,
            "flex aspect-[5/4] w-full items-center justify-center border border-dashed border-slate-300 text-sm text-slate-400 italic dark:border-slate-700 dark:text-slate-600"
          )}
        >
          Add media image…
        </div>
      ) : null}
    </div>
  );

  return (
    <div ref={ref}>
      <SectionSplit
        variant="rail"
        ratio="50-50"
        gap="md"
        left={mediaEnd ? textCol : mediaCol}
        right={mediaEnd ? mediaCol : textCol}
      />
    </div>
  );
}
