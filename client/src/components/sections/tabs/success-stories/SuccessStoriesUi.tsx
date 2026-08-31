"use client";

import { useCallback, useState } from "react";
import { SectionLayoutRoot } from "@/components/sections/layout";
import SectionButtons from "@/components/ui/SectionButtons";
import YoutubeModal from "@/components/ui/YoutubeModal";
import PlayIcon from "@/components/icons/PlayIcon";
import SuccessStoryTabIcon from "@/components/icons/SuccessStoryTabIcon";
import { DS_RADIUS, sectionClassNames } from "@/lib/layout/section-layout-system";
import { mediaAlt } from "@/lib/utils/media-alt";
import {
  sortActiveButtons,
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/utils/button-types";
import type { SuccessStoriesUiProps, SuccessStoryUiItem } from "../shared/lib/types";

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, #2e1064 0%, #4c1d95 45%, #312e81 100%)";

function StoryTab({
  item,
  active,
  onClick,
}: {
  item: SuccessStoryUiItem;
  active: boolean;
  onClick: () => void;
}) {
  const label = item.label || item.title || "Story";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`section-tab section-tab--horizontal inline-flex items-center gap-2 text-sm font-semibold${
        active ? " is-active" : ""
      }`}
    >
      <SuccessStoryTabIcon name={item.icon} />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function StoryPanel({
  item,
  preview = false,
  onFormOpen,
}: {
  item?: SuccessStoryUiItem;
  preview?: boolean;
  onFormOpen?: (formKey: string, button?: unknown) => void;
}) {
  const [videoOpen, setVideoOpen] = useState(false);
  const photo = item?.imageUrl;
  const logo = item?.logoUrl;
  const gradient = item?.gradient || DEFAULT_GRADIENT;
  const videoUrl = item?.videoUrl || "";
  const embedSrc = videoUrl
    ? youtubeEmbedUrl(videoUrl, { autoplay: false })
    : null;
  const watchHref = videoUrl ? youtubeWatchUrl(videoUrl) || videoUrl : null;
  const buttons = sortActiveButtons(
    Array.isArray(item?.buttons) ? item.buttons : []
  );
  const partner = String(item?.subtitle || "").trim();

  const handlePlay = useCallback(() => {
    if (preview) return;
    if (embedSrc) {
      setVideoOpen(true);
      return;
    }
    if (watchHref) window.open(watchHref, "_blank", "noopener,noreferrer");
  }, [preview, embedSrc, watchHref]);

  if (!item) return null;

  return (
    <>
      <div
        className={sectionClassNames(
          DS_RADIUS.card,
          "overflow-hidden border border-slate-200 shadow-xl dark:border-slate-800"
        )}
      >
        <div className="grid lg:grid-cols-2">
          <div
            className="flex min-h-[280px] flex-col justify-center px-8 py-10 sm:px-10 sm:py-12 lg:min-h-[360px]"
            style={{ background: gradient }}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={mediaAlt(item, "Partner logo")}
                className="mb-6 h-8 w-auto max-w-[140px] object-contain object-left brightness-0 invert"
              />
            ) : partner ? (
              <p className="m-0 mb-6 text-lg font-bold tracking-tight text-white/90">
                {partner}
              </p>
            ) : null}

            {item.title ? (
              <h3 className="m-0 max-w-xl font-[family-name:var(--font-display)] text-2xl leading-snug font-semibold text-white sm:text-[1.65rem]">
                {item.title}
              </h3>
            ) : null}

            {buttons.length ? (
              <SectionButtons
                buttons={buttons}
                onFormOpen={onFormOpen}
                inverted
                className="mt-8 flex flex-wrap items-center gap-3"
              />
            ) : null}
          </div>

          <div className="relative min-h-[240px] bg-slate-900 lg:min-h-[360px]">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={mediaAlt(item, "Success story")}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-slate-800" />
            )}

            {videoUrl && photo ? (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 flex items-center justify-center border-0 bg-black/10 transition hover:bg-black/25"
                aria-label="Play video"
              >
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c3aed,#4f46e5)] text-white shadow-2xl ring-4 ring-white/20">
                  <PlayIcon className="size-7 translate-x-0.5" />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {embedSrc ? (
        <YoutubeModal
          open={videoOpen}
          title={item.title || "Success story"}
          embedSrc={embedSrc}
          watchHref={watchHref}
          onClose={() => setVideoOpen(false)}
        />
      ) : null}
    </>
  );
}

export default function SuccessStoriesUi({
  title,
  subtitle,
  titleSlot,
  subtitleSlot,
  itemsBar,
  emptyState = null,
  footer = null,
  stories = [],
  preview = false,
  onFormOpen,
  id,
  className = "",
}: SuccessStoriesUiProps) {
  const [active, setActive] = useState(0);
  const current = stories[Math.min(active, Math.max(stories.length - 1, 0))];

  const centeredTitleClass =
    "text-center font-[family-name:var(--font-display)] text-3xl leading-tight font-semibold tracking-tight sm:text-4xl";
  const centeredSubtitleClass =
    "m-0 mt-3 text-center text-base section-theme-muted";

  const showHeader = Boolean(
    titleSlot || title || subtitleSlot || subtitle
  );

  return (
    <SectionLayoutRoot
      id={id}
      className={className}
      itemsBar={itemsBar}
      emptyState={emptyState}
      footer={footer}
      items={stories}
      hasBodyContent
    >
      {showHeader ? (
        <header className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          {titleSlot != null ? (
            titleSlot
          ) : title ? (
            <h2
              className={`section-theme-heading m-0 ${centeredTitleClass}`}
            >
              {title}
            </h2>
          ) : null}
          {subtitleSlot != null ? (
            <div className="mt-3">{subtitleSlot}</div>
          ) : subtitle ? (
            <p className={centeredSubtitleClass}>{subtitle}</p>
          ) : null}
        </header>
      ) : null}

      {stories.length ? (
        <div className="space-y-6">
            <div
              role="tablist"
              aria-label="Success stories"
              className="section-tabs-list section-tabs-list--horizontal flex-wrap justify-center"
            >
              {stories.map((item, i) => (
                <StoryTab
                  key={item.id || i}
                  item={item}
                  active={i === active}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <StoryPanel
              item={current}
              preview={preview}
              onFormOpen={onFormOpen}
            />
          </div>
        ) : null}
    </SectionLayoutRoot>
  );
}
