"use client";

import { useState } from "react";
import Link from "next/link";
import {
  resolveButtonAction,
  resolveButtonIcon,
  youtubeEmbedUrl,
} from "@/lib/utils/button-types";
import YoutubeModal from "./YoutubeModal";
import ButtonIcon from "@/components/icons/ButtonIcon";

const BASE_CLASS = "section-btn";

const VARIANT_CLASS = {
  primary: "section-btn--primary",
  secondary: "section-btn--secondary",
  outline: "section-btn--outline",
  ghost: "section-btn--ghost",
  link: "section-btn--link",
  inverse: "section-btn--inverse",
};

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
