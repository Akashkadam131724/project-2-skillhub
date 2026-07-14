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
];

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
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
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
export function sanitizeRichHtml(html) {
  const raw = String(html || "").trim();
  if (!raw) return "";
  const input = looksLikeHtml(raw) ? raw : plainTextToHtml(raw);
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
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
