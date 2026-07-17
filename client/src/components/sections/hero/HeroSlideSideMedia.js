"use client";

import { useCallback, useState } from "react";
import { mediaUrl } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/button-types";
import YoutubeModal from "@/components/ui/YoutubeModal";

function PlayIcon({ className = "size-8" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

/**
 * Full-height right-panel media — covers the right side of the banner.
 * item.icon = image, item.href = optional video URL (shows play icon → modal).
 */
export default function HeroSlideSideMedia({
  item,
  cmsMode = false,
  className = "",
  onVideoOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const sideImg = mediaUrl(item?.icon || "");
  const videoUrl = String(item?.href || "").trim();
  const embedSrc = videoUrl
    ? youtubeEmbedUrl(videoUrl, { autoplay: false })
    : null;
  const watchHref = videoUrl ? youtubeWatchUrl(videoUrl) || videoUrl : null;
  const hasVideo = Boolean(videoUrl);

  const setVideoOpen = useCallback(
    (next) => {
      setOpen(next);
      onVideoOpenChange?.(next);
    },
    [onVideoOpenChange]
  );

  function handlePlay() {
    if (cmsMode) return;
    if (embedSrc) {
      setVideoOpen(true);
      return;
    }
    if (watchHref) {
      window.open(watchHref, "_blank", "noopener,noreferrer");
    }
  }

  if (!sideImg && !cmsMode) return null;

  const panel = (
    <div
      className={`absolute inset-y-0 right-0 z-[3] hidden w-[40%] sm:block lg:w-[36%] ${className}`.trim()}
    >
      {sideImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sideImg}
          alt={mediaAlt(item, "Hero media")}
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border-l border-dashed border-white/30 bg-white/5 text-sm text-white/45 italic">
          Add side image…
        </div>
      )}

      {/* Soft edge into copy on the left */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/35 to-transparent sm:w-24"
        aria-hidden
      />

      {hasVideo && sideImg && !cmsMode ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePlay();
          }}
          className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center border-0 bg-black/0 transition hover:bg-black/20"
          aria-label="Play video"
        >
          <span className="pointer-events-none inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg ring-1 ring-black/5 transition group-hover:scale-105 sm:size-16">
            <PlayIcon className="size-7 translate-x-0.5 sm:size-8" />
          </span>
        </button>
      ) : null}

      {hasVideo && sideImg && cmsMode ? (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg ring-1 ring-black/5 sm:size-16">
            <PlayIcon className="size-7 translate-x-0.5 sm:size-8" />
          </span>
        </span>
      ) : null}

      {cmsMode && hasVideo ? (
        <p className="absolute bottom-3 left-3 right-3 m-0 truncate rounded bg-black/50 px-2 py-1 text-[11px] text-white/80">
          {sideImg ? `Video: ${videoUrl}` : "Video URL set — add side image"}
        </p>
      ) : null}

      <YoutubeModal
        open={open}
        title={item?.title || "Video"}
        embedSrc={embedSrc}
        watchHref={watchHref}
        onClose={() => setVideoOpen(false)}
      />
    </div>
  );

  return panel;
}
