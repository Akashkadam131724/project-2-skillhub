import { sanitizeRichHtml } from "@/lib/rich-text";

function stripTags(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugifyHeading(text) {
  const base = String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "section";
}

/**
 * Sanitize article HTML, inject stable heading ids, and return TOC entries.
 * Uses h2–h4 from the shared rich-text editor.
 */
export function prepareBlogContentWithToc(html) {
  const clean = sanitizeRichHtml(html);
  if (!clean) return { html: "", items: [] };

  const used = new Map();
  const items = [];

  const withIds = clean.replace(
    /<(h[2-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi,
    (_match, tag, attrs = "", inner) => {
      const level = Number(tag.slice(1));
      const text = stripTags(inner);
      if (!text) return `<${tag}${attrs || ""}>${inner}</${tag}>`;

      const existingId = String(attrs || "").match(/\sid\s*=\s*(["'])(.*?)\1/i)?.[2];
      let id = existingId || slugifyHeading(text);
      const count = used.get(id) || 0;
      used.set(id, count + 1);
      if (count > 0) id = `${id}-${count + 1}`;

      const attrsWithoutId = String(attrs || "").replace(/\s*id\s*=\s*(["'])[\s\S]*?\1/gi, "");
      items.push({ id, text, level });
      return `<${tag}${attrsWithoutId} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: withIds, items };
}
