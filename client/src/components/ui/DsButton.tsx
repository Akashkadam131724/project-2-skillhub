"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  buttonAriaLabel,
  buttonDesignClasses,
  buttonSurfaceProps,
  buttonMergedStyle,
  normalizeButton,
  resolveButtonAction,
  resolveButtonIcon,
  youtubeEmbedUrl,
} from "@/lib/utils/button-types";
import YoutubeModal from "./YoutubeModal";
import ButtonIcon from "@/components/icons/ButtonIcon";
import type { CmsButtonData, DsButtonProps } from "./types";

type ButtonContentProps = {
  button: CmsButtonData;
  showIcon?: boolean;
};

function ButtonContent({ button, showIcon = true }: ButtonContentProps) {
  const normalized = normalizeButton(button);
  const action = resolveButtonAction(normalized);
  const iconKind = showIcon ? resolveButtonIcon(normalized, action as never) : null;
  const iconAtEnd = normalized.icon_position === "end";

  const iconEl = iconKind ? (
    <span
      className={`section-btn__icon ${iconAtEnd ? "section-btn__icon--end" : ""}`}
      aria-hidden
    >
      <ButtonIcon kind={iconKind} />
    </span>
  ) : null;

  return (
    <>
      {!iconAtEnd ? iconEl : null}
      <span className="section-btn__label">{normalized.label}</span>
      {iconAtEnd ? iconEl : null}
    </>
  );
}

function wantsNewTab(button: CmsButtonData) {
  const v = button?.open_in_new_tab;
  return v === true || v === "true" || v === 1 || v === "1";
}

type NavHref =
  | { mode: "anchor"; href: string }
  | { mode: "internal"; href: string }
  | { mode: "external"; href: string };

function resolveNavHref(href: string): NavHref | null {
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

function resolveSurface(inverted: boolean, surface: DsButtonProps["surface"]) {
  if (surface === "light" || surface === "dark") return surface;
  if (inverted === true) return "dark";
  return "inherit";
}

function commonAttrs(
  button: CmsButtonData,
  surfaceAttrs: Record<string, unknown>,
  customStyle: CSSProperties | undefined
) {
  const aria = buttonAriaLabel(button);
  return {
    ...surfaceAttrs,
    style: customStyle,
    ...(aria ? { "aria-label": aria } : {}),
  };
}

/**
 * Design-system button — CMS data object or direct props.
 */
export default function DsButton({
  button: buttonProp,
  label,
  variant,
  size,
  shape,
  icon,
  icon_position,
  action_type,
  target_url,
  target_id,
  form_key,
  open_in_new_tab,
  full_width,
  aria_label,
  download_filename,
  className = "",
  onFormOpen,
  inverted = false,
  surface = "inherit",
  showIcon = true,
  preview = false,
  children,
  onClick,
  disabled = false,
  htmlType,
  custom,
  style,
}: DsButtonProps) {
  const [youtubeOpen, setYoutubeOpen] = useState(false);

  const button = normalizeButton(
    buttonProp || {
      label: label ?? (typeof children === "string" ? children : ""),
      variant,
      size,
      shape,
      icon,
      icon_position,
      action_type,
      target_url,
      target_id,
      form_key,
      open_in_new_tab,
      full_width,
      aria_label,
      download_filename,
    }
  );

  if (!button.label) return null;

  const classes = buttonDesignClasses(button, className);
  const surfaceKey = resolveSurface(inverted, surface);
  const surfaceAttrs = commonAttrs(
    button,
    surfaceKey === "inherit" ? {} : buttonSurfaceProps(surfaceKey),
    buttonMergedStyle(custom, style)
  );
  const action = resolveButtonAction(button);
  const content = <ButtonContent button={button} showIcon={showIcon} />;
  const nativeType = htmlType || (onClick ? "button" : undefined);

  if (preview) {
    return (
      <span className={classes} {...surfaceAttrs} aria-hidden>
        {content}
      </span>
    );
  }

  if (nativeType === "submit" || (onClick && !action.href && action.kind === "url")) {
    return (
      <button
        type={nativeType === "submit" ? "submit" : "button"}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...surfaceAttrs}
      >
        {content}
      </button>
    );
  }

  if (action.kind === "scroll_top") {
    return (
      <button
        type="button"
        className={classes}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        {...surfaceAttrs}
      >
        {content}
      </button>
    );
  }

  if (action.kind === "form") {
    if (!action.formKey) return null;
    return (
      <button
        type="button"
        className={classes}
        onClick={() => onFormOpen?.(String(action.formKey), button)}
        {...surfaceAttrs}
      >
        {content}
      </button>
    );
  }

  if (action.kind === "youtube") {
    if (!action.videoId && !action.href) return null;
    const embedSrc = youtubeEmbedUrl(String(action.videoId || action.href || ""));
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
          {...surfaceAttrs}
        >
          {content}
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

  if (action.kind === "anchor" || action.kind === "email" || action.kind === "phone") {
    return (
      <a href={action.href} className={classes} onClick={onClick} {...surfaceAttrs}>
        {content}
      </a>
    );
  }

  if (action.kind === "download") {
    return (
      <a
        href={action.href}
        className={classes}
        download={action.downloadName || true}
        {...surfaceAttrs}
        {...(openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : { rel: "noopener noreferrer" })}
      >
        {content}
      </a>
    );
  }

  if (action.kind === "url") {
    const nav = resolveNavHref(action.href);
    if (!nav) return null;

    if (nav.mode === "internal" && !openInNewTab) {
      return (
        <Link href={nav.href} className={classes} onClick={onClick} {...surfaceAttrs}>
          {content}
        </Link>
      );
    }

    return (
      <a
        href={nav.href}
        className={classes}
        onClick={onClick}
        {...surfaceAttrs}
        {...(openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : nav.mode === "external"
            ? { rel: "noopener noreferrer" }
            : {})}
      >
        {content}
      </a>
    );
  }

  return null;
}
