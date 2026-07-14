/** Keep in sync with server/src/modules/cms/button.schema.js */

export const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "link",
  "inverse",
];

export const BUTTON_ACTION_TYPES = ["url", "anchor", "form", "youtube"];

export const BUTTON_VARIANT_LABELS = {
  primary: "Primary",
  secondary: "Secondary",
  outline: "Outline",
  ghost: "Ghost",
  link: "Link",
  inverse: "Inverse (on dark)",
};

export const BUTTON_ACTION_LABELS = {
  url: "Link (URL)",
  anchor: "On-page target (#id)",
  form: "Open form",
  youtube: "YouTube video",
};

/**
 * Extract a YouTube video id from common URL shapes:
 * watch?v=, youtu.be/, embed/, shorts/, live/
 */
export function parseYoutubeVideoId(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;

  // Bare 11-char id
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
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

export function youtubeWatchUrl(videoIdOrUrl) {
  const id = parseYoutubeVideoId(videoIdOrUrl);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function youtubeEmbedUrl(videoIdOrUrl, { autoplay = true } = {}) {
  const id = parseYoutubeVideoId(videoIdOrUrl);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

/**
 * Resolve href / behavior for a CMS button.
 * Returns { kind, href, formKey, videoId }
 */
export function resolveButtonAction(button) {
  const type = String(button?.action_type || "url").toLowerCase();

  if (type === "anchor") {
    const id = String(button?.target_id || "").replace(/^#/, "").trim();
    return {
      kind: "anchor",
      href: id ? `#${id}` : null,
      formKey: null,
      videoId: null,
    };
  }

  if (type === "form") {
    const formKey = String(button?.form_key || "").trim();
    return {
      kind: "form",
      href: null,
      formKey: formKey || null,
      videoId: null,
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
    };
  }

  const href = String(button?.target_url || "").trim();
  return { kind: "url", href: href || null, formKey: null, videoId: null };
}

/** File extension from a URL/path (ignores query/hash) */
function urlExtension(href) {
  try {
    const path = String(href || "").split(/[?#]/)[0];
    const base = path.split("/").pop() || "";
    const m = base.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

/**
 * Icon kind for a button — driven by action type + link shape.
 * youtube | video | pdf | file | form | anchor | external | link
 */
export function resolveButtonIcon(button, action = null) {
  const resolved = action || resolveButtonAction(button);
  const kind = resolved.kind;

  if (kind === "youtube") return "youtube";
  if (kind === "form") return "form";
  if (kind === "anchor") return "anchor";

  const href = resolved.href || button?.target_url || "";
  const ext = urlExtension(href);

  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar"].includes(ext)) {
    return "file";
  }
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";

  if (/^https?:\/\//i.test(href)) return "external";
  return "link";
}

/** Active buttons sorted by sort_order */
export function sortActiveButtons(buttons) {
  if (!Array.isArray(buttons)) return [];
  return [...buttons]
    .filter((b) => b && b.status !== false && b.label)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/**
 * Legacy fallback: single button_title + target_url → one primary url button.
 */
export function buttonsFromLegacy(button_title, target_url) {
  const label = String(button_title || "").trim();
  const url = String(target_url || "").trim();
  if (!label || !url) return [];
  return [
    {
      label,
      variant: "primary",
      action_type: "url",
      target_url: url,
      target_id: "",
      form_key: "",
      open_in_new_tab: false,
      sort_order: 0,
      status: true,
    },
  ];
}
