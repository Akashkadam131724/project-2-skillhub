/** Keep in sync with server/src/modules/cms/button.schema.js */

import {
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
  BUTTON_ICON_PRESETS,
  isButtonIconPreset,
} from "@/lib/ui/button-icon-catalog";

export {
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
  BUTTON_ICON_PRESETS,
};

export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
  "inverse",
  "danger",
];

export const BUTTON_SIZES = ["sm", "md", "lg"];

export const BUTTON_SHAPES = ["rounded", "pill", "square"];

export const BUTTON_ICON_POSITIONS = ["start", "end"];

export const BUTTON_ACTION_TYPES = [
  "url",
  "anchor",
  "form",
  "youtube",
  "email",
  "phone",
  "download",
  "scroll_top",
];

export const BUTTON_VARIANT_LABELS = {
  primary: "Primary (white fill on dark)",
  secondary: "Secondary (glass on dark)",
  outline: "Outline (white border on dark)",
  ghost: "Ghost",
  link: "Link",
  inverse: "Inverse (white fill on dark)",
  danger: "Danger / destructive",
};

/** Dark-band CTAs — solid primary + white outline secondary */
export const BUTTON_DARK_CTA_PRESETS = [
  { variant: "primary", label: "Primary CTA" },
  { variant: "outline", label: "Secondary CTA" },
];

export const BUTTON_SIZE_LABELS = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

export const BUTTON_SHAPE_LABELS = {
  rounded: "Rounded",
  pill: "Pill",
  square: "Square",
};

export const BUTTON_ICON_POSITION_LABELS = {
  start: "Start (before label)",
  end: "End (after label)",
};

export const BUTTON_ACTION_LABELS = {
  url: "Link (URL)",
  anchor: "On-page target (#id)",
  form: "Open form",
  youtube: "YouTube video",
  email: "Send email",
  phone: "Call phone",
  download: "Download file",
  scroll_top: "Scroll to top",
};

const DEFAULT_BUTTON = {
  label: "",
  variant: "primary",
  size: "md",
  shape: "rounded",
  icon: "auto",
  icon_position: "start",
  action_type: "url",
  target_url: "",
  target_id: "",
  form_key: "",
  open_in_new_tab: false,
  full_width: false,
  aria_label: "",
  download_filename: "",
  cls_bg: "",
  cls_text: "",
  cls_border: "",
  cls_hover_bg: "",
  cls_hover_text: "",
  cls_hover_border: "",
  sort_order: 0,
  status: true,
};

/** Normalize CMS button object with design-system defaults. */
export function normalizeButton(button: Record<string, unknown> = {}) {
  let variant = String(button.variant || DEFAULT_BUTTON.variant).toLowerCase();
  if (variant === "inverse_outline") variant = "outline";
  const size = String(button.size || DEFAULT_BUTTON.size).toLowerCase();
  const shape = String(button.shape || DEFAULT_BUTTON.shape).toLowerCase();
  const icon = String(button.icon ?? DEFAULT_BUTTON.icon).trim() || "auto";
  const icon_position = String(
    button.icon_position || DEFAULT_BUTTON.icon_position
  ).toLowerCase();

  return {
    ...button,
    label: String(button.label || "").trim(),
    variant: BUTTON_VARIANTS.includes(variant) ? variant : "primary",
    size: BUTTON_SIZES.includes(size) ? size : "md",
    shape: BUTTON_SHAPES.includes(shape) ? shape : "rounded",
    icon: isButtonIconPreset(icon) ? icon : "auto",
    icon_position: BUTTON_ICON_POSITIONS.includes(icon_position)
      ? icon_position
      : "start",
    action_type: BUTTON_ACTION_TYPES.includes(
      String(button.action_type || "url").toLowerCase()
    )
      ? String(button.action_type || "url").toLowerCase()
      : "url",
    target_url: String(button.target_url || ""),
    target_id: String(button.target_id || "").replace(/^#/, ""),
    form_key: String(button.form_key || ""),
    open_in_new_tab: Boolean(button.open_in_new_tab),
    full_width: Boolean(button.full_width),
    aria_label: String(button.aria_label || "").trim(),
    download_filename: String(button.download_filename || "").trim(),
    cls_bg: String(button.cls_bg || "").trim(),
    cls_text: String(button.cls_text || "").trim(),
    cls_border: String(button.cls_border || "").trim(),
    cls_hover_bg: String(button.cls_hover_bg || "").trim(),
    cls_hover_text: String(button.cls_hover_text || "").trim(),
    cls_hover_border: String(button.cls_hover_border || "").trim(),
    sort_order:
      typeof button.sort_order === "number"
        ? button.sort_order
        : Number(button.sort_order) || 0,
    status: button.status !== false,
  };
}

/** Accessible label — explicit aria_label or visible label. */
export function buttonAriaLabel(button: Record<string, unknown>) {
  const b = normalizeButton(button);
  return b.aria_label || b.label || undefined;
}

/** Tailwind !-class overrides from CMS cls_* fields */
export function buttonAppearanceClasses(button: Record<string, unknown>) {
  const b = normalizeButton(button);
  return [
    b.cls_bg,
    b.cls_text,
    b.cls_border,
    b.cls_hover_bg,
    b.cls_hover_text,
    b.cls_hover_border,
  ]
    .filter((part) => String(part || "").trim())
    .join(" ");
}

/** Map stored variant → BEM modifier class */
export function buttonVariantClass(variant: string) {
  return `section-btn--${variant}`;
}

/** CSS class list for the design-system button shell. */
export function buttonDesignClasses(
  button: Record<string, unknown>,
  extraClass = ""
) {
  const b = normalizeButton(button);
  const size = b.size === "md" ? "" : `section-btn--${b.size}`;
  const shape = b.shape === "rounded" ? "" : `section-btn--${b.shape}`;
  const width = b.full_width ? "section-btn--full" : "";
  return [
    "section-btn",
    buttonVariantClass(b.variant),
    size,
    shape,
    width,
    buttonAppearanceClasses(b),
    extraClass,
  ]
    .filter(Boolean)
    .join(" ");
}

export function buttonSurfaceProps(surface = "inherit") {
  if (surface === "light") return { "data-btn-surface": "light" };
  if (surface === "dark") return { "data-btn-surface": "dark" };
  return {};
}

/** Optional per-button color overrides — maps to --ds-btn-custom-* CSS variables. */
export const BUTTON_CUSTOM_STYLE_KEYS = {
  bg: "--ds-btn-custom-bg",
  fg: "--ds-btn-custom-fg",
  border: "--ds-btn-custom-border",
  hoverBg: "--ds-btn-custom-hover-bg",
  hoverFg: "--ds-btn-custom-hover-fg",
  hoverBorder: "--ds-btn-custom-hover-border",
};

/**
 * Inline style object for custom button colors (bg, text, border + hover).
 * @example buttonCustomStyle({ border: "#fff", fg: "#fff", hoverBg: "rgb(255 255 255 / 0.12)" })
 */
export function buttonCustomStyle(tokens: Record<string, unknown> = {}) {
  const out: Record<string, string> = {};
  const aliases = {
    bg: tokens.bg ?? tokens.background,
    fg: tokens.fg ?? tokens.color ?? tokens.text,
    border: tokens.border,
    hoverBg: tokens.hoverBg ?? tokens.hoverBackground,
    hoverFg: tokens.hoverFg ?? tokens.hoverColor ?? tokens.hoverText,
    hoverBorder: tokens.hoverBorder,
  };

  for (const [key, cssVar] of Object.entries(BUTTON_CUSTOM_STYLE_KEYS)) {
    const value = (aliases as Record<string, unknown>)[key];
    if (value != null && String(value).trim() !== "") {
      out[cssVar] = String(value).trim();
    }
  }

  return out;
}

/** Merge custom tokens + arbitrary style for DsButton. */
export function buttonMergedStyle(
  custom?: Record<string, unknown> | null,
  style?: Record<string, unknown> | import("react").CSSProperties
) {
  return { ...buttonCustomStyle(custom || {}), ...(style || {}) };
}

export function sortActiveButtons(buttons?: unknown[] | null) {
  if (!Array.isArray(buttons)) return [];
  return [...buttons]
    .filter(
      (b): b is Record<string, unknown> =>
        Boolean(b && typeof b === "object" && (b as Record<string, unknown>).status !== false && (b as Record<string, unknown>).label)
    )
    .sort(
      (a, b) =>
        Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
    );
}

export function buttonsFromLegacy(button_title?: string, target_url?: string) {
  const label = String(button_title || "").trim();
  const url = String(target_url || "").trim();
  if (!label || !url) return [];
  return [
    normalizeButton({
      label,
      variant: "primary",
      action_type: "url",
      target_url: url,
      sort_order: 0,
      status: true,
    }),
  ];
}

export function parseYoutubeVideoId(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      const v = url.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      if (
        parts.length >= 2 &&
        ["embed", "shorts", "live", "v"].includes(parts[0]) &&
        /^[\w-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeWatchUrl(videoIdOrUrl: string) {
  const id = parseYoutubeVideoId(videoIdOrUrl);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function youtubeEmbedUrl(
  videoIdOrUrl: string,
  { autoplay = true, mute = false }: { autoplay?: boolean; mute?: boolean } = {}
) {
  const id = parseYoutubeVideoId(videoIdOrUrl);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
    ...(mute || autoplay ? { mute: "1" } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function normalizeEmailHref(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return null;
  if (value.toLowerCase().startsWith("mailto:")) return value;
  return `mailto:${value.replace(/^mailto:/i, "")}`;
}

function normalizePhoneHref(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return null;
  if (value.toLowerCase().startsWith("tel:")) return value;
  const digits = value.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

/**
 * Resolve href / behavior for a CMS button.
 * Returns { kind, href, formKey, videoId, downloadName }
 */
export function resolveButtonAction(button: Record<string, unknown>) {
  const type = String(button?.action_type || "url").toLowerCase();

  if (type === "anchor") {
    const id = String(button?.target_id || "").replace(/^#/, "").trim();
    return {
      kind: "anchor",
      href: id ? `#${id}` : null,
      formKey: null,
      videoId: null,
      downloadName: null,
    };
  }

  if (type === "form") {
    const formKey = String(button?.form_key || "").trim();
    return {
      kind: "form",
      href: null,
      formKey: formKey || null,
      videoId: null,
      downloadName: null,
    };
  }

  if (type === "youtube") {
    const raw = String(button?.target_url || "").trim();
    const videoId = parseYoutubeVideoId(raw);
    return {
      kind: "youtube",
      href: youtubeWatchUrl(raw),
      formKey: null,
      videoId,
      downloadName: null,
    };
  }

  if (type === "email") {
    return {
      kind: "email",
      href: normalizeEmailHref(String(button?.target_url || "")),
      formKey: null,
      videoId: null,
      downloadName: null,
    };
  }

  if (type === "phone") {
    return {
      kind: "phone",
      href: normalizePhoneHref(String(button?.target_url || "")),
      formKey: null,
      videoId: null,
      downloadName: null,
    };
  }

  if (type === "download") {
    const href = String(button?.target_url || "").trim();
    const downloadName = String(button?.download_filename || "").trim() || null;
    return {
      kind: "download",
      href: href || null,
      formKey: null,
      videoId: null,
      downloadName,
    };
  }

  if (type === "scroll_top") {
    return {
      kind: "scroll_top",
      href: "#top",
      formKey: null,
      videoId: null,
      downloadName: null,
    };
  }

  const href = String(button?.target_url || "").trim();
  return { kind: "url", href: href || null, formKey: null, videoId: null, downloadName: null };
}

function urlExtension(href: string) {
  try {
    const path = String(href || "").split(/[?#]/)[0];
    const base = path.split("/").pop() || "";
    const m = base.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

export function resolveButtonIconAuto(
  button: Record<string, unknown>,
  action: ReturnType<typeof resolveButtonAction> | null = null
) {
  const resolved = action || resolveButtonAction(button);
  const kind = resolved.kind;

  if (kind === "youtube") return "youtube";
  if (kind === "form") return "form";
  if (kind === "anchor") return "anchor";
  if (kind === "email") return "mail";
  if (kind === "phone") return "phone";
  if (kind === "download") return "download";
  if (kind === "scroll_top") return "arrow-up";

  const href = String(resolved.href || button?.target_url || "");
  const ext = urlExtension(href);

  if (ext === "pdf") return "pdf";
  if (
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar"].includes(ext)
  ) {
    return "file";
  }
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";

  if (/^https?:\/\//i.test(href)) return "external";
  return "link";
}

export function resolveButtonIcon(
  button: Record<string, unknown>,
  action: ReturnType<typeof resolveButtonAction> | null = null
) {
  const preset = String(button?.icon ?? "auto").trim().toLowerCase();
  if (preset === "none") return null;
  if (preset && preset !== "auto" && isButtonIconPreset(preset)) {
    if (preset === "play" || preset === "youtube") return "youtube";
    return preset;
  }
  return resolveButtonIconAuto(button, action);
}

export { resolveButtonIconAuto as resolveButtonIconFromAction };
