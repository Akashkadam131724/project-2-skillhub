"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  resolveButtonAction,
  resolveButtonIcon,
  youtubeEmbedUrl,
} from "@/lib/button-types";

const VARIANT_CLASS = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-brand-hover",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 no-underline transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand bg-transparent px-5 py-2.5 text-sm font-semibold text-brand no-underline transition hover:bg-brand/10",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
  link: "inline-flex items-center justify-center gap-1.5 px-1 py-0.5 text-sm font-semibold text-brand no-underline transition hover:underline",
  inverse:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-ink no-underline transition hover:bg-slate-100",
};

/** Variants remapped for dark surfaces (CTA strip, etc.) */
const INVERTED_VARIANT_CLASS = {
  primary: VARIANT_CLASS.inverse,
  inverse: VARIANT_CLASS.inverse,
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-white/50 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-white/20",
  outline:
    "inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-white/10",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-white/10",
  link: "inline-flex items-center justify-center gap-1.5 px-1 py-0.5 text-sm font-semibold text-white no-underline transition hover:underline",
};

function ButtonIcon({ kind, className = "size-4 shrink-0" }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };

  switch (kind) {
    case "youtube":
    case "video":
      return (
        <svg {...props}>
          <path
            d="M8 5.5v13l11-6.5L8 5.5Z"
            fill="currentColor"
          />
        </svg>
      );
    case "pdf":
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
            strokeLinejoin="round"
          />
          <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M9 13h6M9 17h4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "file":
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
            strokeLinejoin="round"
          />
          <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "form":
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M8 6h8M8 10h8M8 14h5"
            strokeLinecap="round"
          />
          <rect x="4" y="3" width="16" height="18" rx="2" />
        </svg>
      );
    case "anchor":
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M12 5v14M12 19l-4-4M12 19l4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "external":
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M14 4h6v6M10 14 20 4M18 14v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "link":
    default:
      return (
        <svg {...props} stroke="currentColor" strokeWidth="1.75">
          <path
            d="M9 15l6-6M8.5 10.5l-1.2 1.2a3.5 3.5 0 0 0 5 5l1.2-1.2M15.5 13.5l1.2-1.2a3.5 3.5 0 0 0-5-5L10.5 8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function ButtonLabel({ icon, children }) {
  return (
    <>
      {icon ? <ButtonIcon kind={icon} /> : null}
      <span>{children}</span>
    </>
  );
}

function wantsNewTab(button) {
  const v = button?.open_in_new_tab;
  return v === true || v === "true" || v === 1 || v === "1";
}

/**
 * Normalize CMS button href into { mode: "internal"|"external"|"anchor", href }.
 */
function resolveNavHref(href) {
  const raw = String(href || "").trim();
  if (!raw) return null;

  if (raw.startsWith("#")) {
    return { mode: "anchor", href: raw };
  }

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return { mode: "internal", href: raw };
  }

  // Absolute http(s), mailto:, tel:, //cdn… → external <a>
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) {
    return { mode: "external", href: raw };
  }

  // Slash-less app path: "course-catalog" → "/course-catalog"
  return { mode: "internal", href: `/${raw.replace(/^\.\//, "")}` };
}

function YoutubeModal({ open, title, embedSrc, watchHref, onClose }) {
  useEffect(() => {
    if (!open) return;
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

  if (!open || !embedSrc) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
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
    </div>
  );
}

/**
 * One CMS-driven button. Handles url / anchor / form / youtube.
 * Icons are inferred from action type and link (pdf, video, external, …).
 */
export default function CmsButton({
  button,
  className = "",
  onFormOpen,
  inverted = false,
  showIcon = true,
}) {
  const [youtubeOpen, setYoutubeOpen] = useState(false);

  if (!button?.label) return null;

  const variant = String(button.variant || "primary").toLowerCase();
  const baseClass = inverted
    ? INVERTED_VARIANT_CLASS[variant] || INVERTED_VARIANT_CLASS.primary
    : VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
  const action = resolveButtonAction(button);
  const icon = showIcon ? resolveButtonIcon(button, action) : null;
  const classes = `${baseClass} ${className}`.trim();

  if (action.kind === "form") {
    if (!action.formKey) return null;
    return (
      <button
        type="button"
        className={classes}
        onClick={() => onFormOpen?.(action.formKey, button)}
      >
        <ButtonLabel icon={icon}>{button.label}</ButtonLabel>
      </button>
    );
  }

  if (action.kind === "youtube") {
    if (!action.videoId && !action.href) return null;
    const embedSrc = youtubeEmbedUrl(action.videoId || action.href);
    return (
      <>
        <button
          type="button"
          className={classes}
          onClick={() => {
            if (embedSrc) setYoutubeOpen(true);
            else if (action.href)
              window.open(action.href, "_blank", "noopener,noreferrer");
          }}
        >
          <ButtonLabel icon={icon}>{button.label}</ButtonLabel>
        </button>
        <YoutubeModal
          open={youtubeOpen}
          title={button.label}
          embedSrc={embedSrc}
          watchHref={action.href}
          onClose={() => setYoutubeOpen(false)}
        />
      </>
    );
  }

  if (!action.href) return null;

  const openInNewTab = wantsNewTab(button);
  const label = <ButtonLabel icon={icon}>{button.label}</ButtonLabel>;

  if (action.kind === "anchor") {
    return (
      <a href={action.href} className={classes}>
        {label}
      </a>
    );
  }

  const nav = resolveNavHref(action.href);
  if (!nav) return null;

  // Soft client navigation for in-app routes (unless "open in new tab")
  if (nav.mode === "internal" && !openInNewTab) {
    return (
      <Link href={nav.href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={nav.href}
      className={classes}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : nav.mode === "external"
          ? { rel: "noopener noreferrer" }
          : {})}
    >
      {label}
    </a>
  );
}
