"use client";

import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { mediaUrl } from "@/lib/api/cms-api";
import { itemTitle } from "@/lib/sections/item-types";
import { DS_RADIUS, sectionClassNames } from "@/lib/layout/section-layout-system";
import { DS_TEXT } from "@/lib/sections/section-design-system";
import type { TrustBadgeUiItem } from "./lib/types";

export type TrustBadgeItemCardProps = {
  badge?: TrustBadgeUiItem | null;
  item?: TrustBadgeUiItem | Record<string, unknown> | null;
  preview?: boolean;
};

function resolveBadge(
  badge?: TrustBadgeUiItem | null,
  item?: TrustBadgeUiItem | Record<string, unknown> | null
): TrustBadgeUiItem {
  const source = (badge || item || {}) as TrustBadgeUiItem &
    Record<string, unknown>;
  if (source.imageUrl !== undefined || source.title !== undefined) {
    return source;
  }
  return {
    title: itemTitle(source) || String(source.title || ""),
    subtitle: String(source.subtitle || ""),
    value: String(source.value || ""),
    imageUrl:
      mediaUrl(
        String(source.image_url || source.icon || "")
      ) || undefined,
  };
}

export default function TrustBadgeItemCard({
  badge,
  item,
  preview = false,
}: TrustBadgeItemCardProps) {
  const data = resolveBadge(badge, item);
  const showFallback = !data.imageUrl && (data.value || preview);

  return (
    <article
      data-section-surface="light-card"
      data-light-surface=""
      className={sectionClassNames(
        "section-light-card section-ui-card flex flex-col items-center justify-center border px-4 py-6 text-center",
        DS_RADIUS.card
      )}
    >
      {data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.imageUrl}
          alt={data.title || ""}
          className="mx-auto h-10 w-auto max-w-full object-contain opacity-90"
        />
      ) : showFallback ? (
        <span className={`text-2xl font-bold ${DS_TEXT.subtle}`}>
          {data.value || (preview ? <CardPlaceholder>✓</CardPlaceholder> : "✓")}
        </span>
      ) : preview ? (
        <span className={`text-2xl font-bold italic ${DS_TEXT.subtle}`}>
          <CardPlaceholder>Logo…</CardPlaceholder>
        </span>
      ) : null}
      {data.title ? (
        <p className={`m-0 mt-3 text-xs font-semibold ${DS_TEXT.heading}`}>
          {data.title}
        </p>
      ) : preview ? (
        <p className={`m-0 mt-3 text-xs font-semibold italic ${DS_TEXT.subtle}`}>
          <CardPlaceholder>Badge…</CardPlaceholder>
        </p>
      ) : null}
      {data.subtitle ? (
        <p className={`m-0 mt-1 text-[11px] ${DS_TEXT.muted}`}>
          {data.subtitle}
        </p>
      ) : null}
    </article>
  );
}
