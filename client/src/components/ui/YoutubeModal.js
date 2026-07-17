"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Full-screen YouTube embed dialog (used by CmsButton + hero media).
 * Portaled to document.body so overflow/transform ancestors cannot clip it.
 */
export default function YoutubeModal({ open, title, embedSrc, watchHref, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open || !embedSrc) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-black/70"
        aria-label="Close video"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "YouTube video"}
        className="relative z-[1] w-full max-w-3xl overflow-hidden rounded-xl bg-black shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 bg-slate-950 px-3 py-2">
          <p className="m-0 truncate text-sm font-medium text-white">
            {title || "YouTube video"}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {watchHref ? (
              <a
                href={watchHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-300 no-underline hover:text-white"
              >
                Open on YouTube
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            title={title || "YouTube video"}
            src={embedSrc}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
