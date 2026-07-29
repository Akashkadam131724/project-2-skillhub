"use client";

import { useState } from "react";
import Link from "next/link";
import {
  resolveButtonAction,
  resolveButtonIcon,
  youtubeEmbedUrl,
} from "@/lib/button-types";
import YoutubeModal from "./YoutubeModal";

const BASE_CLASS = "section-btn";

const VARIANT_CLASS = {
  primary: "section-btn--primary",
  secondary: "section-btn--secondary",
  outline: "section-btn--outline",
  ghost: "section-btn--ghost",
  link: "section-btn--link",
  inverse: "section-btn--inverse",
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

  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) {
    return { mode: "external", href: raw };
  }

  return { mode: "internal", href: `/${raw.replace(/^\.\//, "")}` };
}

function buttonSurfaceProps(inverted) {
  if (inverted === true) return { "data-btn-surface": "dark" };
  if (inverted === false) return {};
  return {};
}

/**
 * One CMS-driven button. Handles url / anchor / form / youtube.
 * Styling follows section theme (globals.css .section-btn) and optional inverted surface.
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
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary;
  const classes = `${BASE_CLASS} ${variantClass} ${className}`.trim();
  const surfaceProps = buttonSurfaceProps(inverted);
  const action = resolveButtonAction(button);
  const icon = showIcon ? resolveButtonIcon(button, action) : null;

  if (action.kind === "form") {
    if (!action.formKey) return null;
    return (
      <button
        type="button"
        className={classes}
        onClick={() => onFormOpen?.(action.formKey, button)}
        {...surfaceProps}
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
          {...surfaceProps}
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
      <a href={action.href} className={classes} {...surfaceProps}>
        {label}
      </a>
    );
  }

  const nav = resolveNavHref(action.href);
  if (!nav) return null;

  if (nav.mode === "internal" && !openInNewTab) {
    return (
      <Link href={nav.href} className={classes} {...surfaceProps}>
        {label}
      </Link>
    );
  }

  return (
    <a
      href={nav.href}
      className={classes}
      {...surfaceProps}
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
