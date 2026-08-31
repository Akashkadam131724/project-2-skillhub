"use client";

import CmsRichText from "@/components/cms/primitives/CmsRichText";
import ContactChannelCard from "@/components/sections/content/shared/ContactChannelCard";
import CardPlaceholder from "@/components/sections/shared/CardPlaceholder";
import { mediaUrl } from "@/lib/api/cms-api";
import { mediaAlt } from "@/lib/utils/media-alt";
import { isRichTextEmpty } from "@/lib/utils/rich-text";
import { itemTitle } from "@/lib/sections/item-types";
import type { ItemLike } from "@/lib/sections/item-types";

/**
 * CMS-only item previews that mirror public layouts when a dedicated
 * SectionItemCard type does not exist yet.
 */
export default function GenericItemPreviewCard({
  layout = "media",
  item,
  index = 0,
}: {
  layout?: string;
  item: ItemLike | null | undefined;
  index?: number;
}) {
  if (!item) return null;

  const title = itemTitle(item) || String(item.title || "");
  const subtitle = String(item.subtitle || item.label || "");
  const body = String(item.body || "");
  const value = String(item.value || "");
  const imgSrc = mediaUrl(String(item.image_url || item.image || item.icon || ""));
  const href = String(item.href || "").trim();
  const iconLabel = String(item.icon || "");
  const fieldLabel = String(item.label || "");

  if (layout === "contact") {
    return <ContactChannelCard item={item} />;
  }

  if (layout === "chip") {
    const label = value || subtitle || title || "Chip";
    return (
      <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        {label || <CardPlaceholder>Chip…</CardPlaceholder>}
      </span>
    );
  }

  if (layout === "step") {
    const step = value || String(index + 1);
    return (
      <article className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
          {step}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          {subtitle ? (
            <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              {subtitle}
            </p>
          ) : null}
          <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            {title || <CardPlaceholder>Step title…</CardPlaceholder>}
          </h3>
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
            />
          ) : (
            <p className="m-0 text-xs text-slate-400">
              <CardPlaceholder>Description…</CardPlaceholder>
            </p>
          )}
        </div>
      </article>
    );
  }

  if (layout === "pricing") {
    const popular = String(item.label || "").toLowerCase() === "popular";
    return (
      <article
        className={`rounded-xl border bg-white p-4 dark:bg-slate-950 ${
          popular
            ? "border-brand ring-2 ring-brand/20"
            : "border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="m-0 text-base font-semibold text-slate-900 dark:text-white">
            {title || <CardPlaceholder>Plan…</CardPlaceholder>}
          </h3>
          {popular ? (
            <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              Popular
            </span>
          ) : null}
        </div>
        <p className="mt-2 mb-0 font-[family-name:var(--font-display)] text-2xl font-semibold text-slate-900 dark:text-white">
          {value || <CardPlaceholder>$0</CardPlaceholder>}
          {subtitle ? (
            <span className="ml-1 text-sm font-medium text-slate-500">
              {subtitle}
            </span>
          ) : null}
        </p>
        {!isRichTextEmpty(body) ? (
          <CmsRichText
            html={body}
            className="mt-3 text-xs leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300"
          />
        ) : null}
        {href || iconLabel ? (
          <p className="mt-3 mb-0 text-xs font-semibold text-brand">
            {iconLabel || "Get started"} →
          </p>
        ) : null}
      </article>
    );
  }

  if (layout === "comparison") {
    return (
      <article className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="min-w-0">
          <p className="m-0 font-semibold text-slate-900 dark:text-white">
            {title || <CardPlaceholder>Option…</CardPlaceholder>}
          </p>
          {subtitle ? (
            <p className="m-0 text-xs text-slate-500">{subtitle}</p>
          ) : null}
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="mt-1 text-xs text-slate-600 dark:text-slate-300"
            />
          ) : null}
        </div>
        <span className="shrink-0 self-start rounded bg-brand/10 px-2 py-1 text-xs font-bold text-brand">
          {value || "—"}
        </span>
      </article>
    );
  }

  if (layout === "tab") {
    const isTab = item.item_type !== "item";
    if (isTab) {
      return (
        <div className="rounded-lg border border-brand/30 bg-brand/5 px-3 py-2">
          <p className="m-0 text-[10px] font-semibold tracking-wide text-brand uppercase">
            Tab
          </p>
          <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            {value || title || <CardPlaceholder>Tab label…</CardPlaceholder>}
          </p>
          {title && value ? (
            <p className="m-0 text-xs text-slate-500">{title}</p>
          ) : null}
        </div>
      );
    }
    return (
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={mediaAlt(item, "Tab card")}
            className="h-28 w-full object-cover"
          />
        ) : (
          <div className="flex h-20 items-center justify-center bg-slate-100 text-xs text-slate-400 dark:bg-slate-900">
            Card image…
          </div>
        )}
        <div className="space-y-1 p-3">
          <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            {title || <CardPlaceholder>Card title…</CardPlaceholder>}
          </h3>
          {subtitle ? (
            <p className="m-0 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </article>
    );
  }

  if (layout === "portrait") {
    return (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-900">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item, "Profile")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Photo…
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
            {value ? (
              <span className="mb-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                {value}
              </span>
            ) : null}
            <h3 className="m-0 text-base font-semibold">
              {title || <CardPlaceholder>Name…</CardPlaceholder>}
            </h3>
            {subtitle ? (
              <p className="m-0 text-xs text-white/80">as {subtitle}</p>
            ) : null}
          </div>
        </div>
        {!isRichTextEmpty(body) ? (
          <div className="p-3">
            <CmsRichText
              html={body}
              className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
            />
          </div>
        ) : null}
      </article>
    );
  }

  if (layout === "team") {
    return (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="aspect-[4/5] w-full bg-slate-100 dark:bg-slate-900">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item, "Team")}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Photo…
            </div>
          )}
        </div>
        <div className="space-y-1 p-3">
          <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            {title || <CardPlaceholder>Name…</CardPlaceholder>}
          </h3>
          {subtitle ? (
            <p className="m-0 text-xs font-medium text-brand">{subtitle}</p>
          ) : null}
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
            />
          ) : null}
        </div>
      </article>
    );
  }

  if (layout === "overlay") {
    return (
      <article className="relative flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white dark:border-slate-800">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={mediaAlt(item, "Card")}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#0b1f4d,#1b4de4)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-[1] space-y-1 p-4">
          {value ? (
            <p className="m-0 font-[family-name:var(--font-display)] text-2xl font-semibold">
              {value}
            </p>
          ) : null}
          <h3 className="m-0 text-base font-semibold">
            {title || <CardPlaceholder>Title…</CardPlaceholder>}
          </h3>
          {subtitle ? (
            <p className="m-0 text-xs text-white/70">{subtitle}</p>
          ) : null}
          {!isRichTextEmpty(body) ? (
            <CmsRichText
              html={body}
              className="text-xs leading-relaxed text-white/75"
            />
          ) : null}
        </div>
      </article>
    );
  }

  if (layout === "success_story") {
    return (
      <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="relative h-32 bg-slate-100 dark:bg-slate-900">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={mediaAlt(item, "Story")}
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <p className="m-0 text-[10px] font-semibold tracking-wide uppercase opacity-80">
              {fieldLabel || iconLabel || "Story"}
            </p>
            <h3 className="m-0 text-sm font-semibold">
              {title || <CardPlaceholder>Headline…</CardPlaceholder>}
            </h3>
          </div>
        </div>
        <div className="space-y-1 p-3">
          {subtitle ? (
            <p className="m-0 text-xs font-medium text-slate-600 dark:text-slate-300">
              {subtitle}
            </p>
          ) : null}
          {value ? (
            <p className="m-0 text-[11px] text-slate-500">Logo: {value}</p>
          ) : null}
        </div>
      </article>
    );
  }

  // default: media card (image + title + body)
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-900">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={mediaAlt(item, "Item")}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400 italic">
            Add image…
          </div>
        )}
      </div>
      <div className="space-y-1 p-3">
        {value ? (
          <p className="m-0 text-[10px] font-semibold tracking-wide text-brand uppercase">
            {value}
          </p>
        ) : null}
        <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
          {title || <CardPlaceholder>Title…</CardPlaceholder>}
        </h3>
        {subtitle ? (
          <p className="m-0 text-xs text-slate-500">{subtitle}</p>
        ) : null}
        {!isRichTextEmpty(body) ? (
          <CmsRichText
            html={body}
            className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
          />
        ) : null}
      </div>
    </article>
  );
}
