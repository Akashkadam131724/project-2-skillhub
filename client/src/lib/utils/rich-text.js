import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "strong",
  "em",
  "u",
  "s",
  "h2",
  "h3",
  "h4",
  "span",
  "blockquote",
  "div",
  "iframe",
  "video",
  "source",
];

const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "class",
  "style",
  "title",
  "id",
  "controls",
  "playsinline",
  "allow",
  "allowfullscreen",
  "frameborder",
  "loading",
  "data-video-embed",
  "data-provider",
  "data-src",
];

const VIDEO_HOST_ALLOWLIST = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
  "www.vimeo.com",
]);

function isSafeMediaSrc(src) {
  try {
    const parsed = new URL(String(src || "").trim());
    if (!/^https?:$/i.test(parsed.protocol)) return false;
    const host = parsed.hostname.toLowerCase();
    if (VIDEO_HOST_ALLOWLIST.has(host)) return true;
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(parsed.pathname + parsed.search);
  } catch {
    return false;
  }
}

/** True when the string looks like HTML markup (not plain paragraphs). */
export function looksLikeHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(String(value || ""));
}

/** Convert legacy plain text (blank-line paragraphs) into simple HTML. */
export function plainTextToHtml(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (looksLikeHtml(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (/^###\s+/.test(block)) {
        return `<h3>${escapeHtml(block.replace(/^###\s+/, ""))}</h3>`;
      }
      if (/^##\s+/.test(block)) {
        return `<h2>${escapeHtml(block.replace(/^##\s+/, ""))}</h2>`;
      }
      const lines = block.split("\n");
      // Only multi-line markdown lists — a single "- foo" / "* foo" line stays a paragraph
      // so focusing/syncing never turns normal prose into accidental <li> nodes.
      if (
        lines.length >= 2 &&
        lines.every((line) => /^[-*]\s+\S/.test(line.trim()))
      ) {
        const items = lines
          .map((line) => `<li><p>${escapeHtml(line.trim().replace(/^[-*]\s+/, ""))}</p></li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sanitize rich HTML for storage / display.
 * Prefer calling on save and always on render.
 */
/**
 * Sanitize rich HTML for storage / display.
 * Prefer calling on save and always on render.
 */
export function sanitizeRichHtml(html) {
  const raw = String(html || "").trim();
  if (!raw) return "";
  const input = looksLikeHtml(raw) ? raw : plainTextToHtml(raw);
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["allowfullscreen", "playsinline"],
  });
  return String(clean)
    .replace(/youtube\.com\/embed\//gi, "youtube-nocookie.com/embed/")
    .replace(/www\.youtube\.com\/embed\//gi, "www.youtube-nocookie.com/embed/")
    .replace(/<iframe\b[^>]*>\s*<\/iframe>/gi, (match) => {
      const src = match.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "";
      return isSafeMediaSrc(src) ? match : "";
    })
    .replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, (match) => {
      const src = match.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "";
      return isSafeMediaSrc(src) ? match : "";
    });
}

/** Drop class / id junk pasted from Word, Docs, websites, etc. */
export function stripHtmlClasses(html) {
  return String(html || "")
    .replace(/\s*class\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/\s*id\s*=\s*(["'])[\s\S]*?\1/gi, "")
    .replace(/\s*className\s*=\s*(["'])[\s\S]*?\1/gi, "");
}

/**
 * Strip inline styles from HTML.
 * When keepColors is true, only `color` / `background-color` survive.
 */
export function stripHtmlStyles(html, { keepColors = false } = {}) {
  const raw = String(html || "");
  if (!raw) return "";

  if (!keepColors) {
    return raw
      .replace(/\s*style\s*=\s*(["'])[\s\S]*?\1/gi, "")
      .replace(/\s*color\s*=\s*(["'])[\s\S]*?\1/gi, "")
      .replace(/\s*bgcolor\s*=\s*(["'])[\s\S]*?\1/gi, "");
  }

  let out = raw.replace(/\s*style\s*=\s*(["'])([\s\S]*?)\1/gi, (_, quote, style) => {
    const kept = String(style)
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter((part) => /^(color|background-color)\s*:/i.test(part))
      .join("; ");
    return kept ? ` style=${quote}${kept}${quote}` : "";
  });

  // Drop non-color legacy attrs; keep HTML color= as color is desired when keepColors
  out = out.replace(/\s*bgcolor\s*=\s*(["'])[\s\S]*?\1/gi, "");
  return out;
}

/** Unwrap bare <span>…</span> left after class/style stripping. */
function unwrapEmptySpans(html) {
  let out = String(html || "");
  let prev = "";
  while (out !== prev) {
    prev = out;
    out = out.replace(/<span\s*>([\s\S]*?)<\/span>/gi, "$1");
  }
  return out;
}

/**
 * Sanitize paste HTML: always strip classes / ids / Office junk styles.
 * Optionally keep text/background colors only.
 */
export function sanitizePastedHtml(html, { keepColors = false } = {}) {
  let clean = sanitizeRichHtml(html);
  clean = stripHtmlClasses(clean);
  clean = stripHtmlStyles(clean, { keepColors });
  clean = unwrapEmptySpans(clean);
  return clean;
}

/** @deprecated use stripHtmlStyles — kept for older imports */
export function stripHtmlColors(html) {
  return stripHtmlStyles(html, { keepColors: false });
}

/** Strip tags for short previews / empty checks. */
export function richTextPlainPreview(html, max = 160) {
  const text = String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function isRichTextEmpty(html) {
  return !richTextPlainPreview(html, 10_000);
}
