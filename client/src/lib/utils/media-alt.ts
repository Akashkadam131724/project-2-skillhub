/**
 * Accessible alt text for CMS media.
 * Prefer explicit title/name; never return empty for content photos.
 */
export function mediaAlt(
  source:
    | string
    | {
        alt?: string;
        imageAlt?: string;
        title?: string;
        name?: string;
        label?: string;
        subtitle?: string;
        value?: string;
      }
    | null
    | undefined,
  fallback = "Image"
) {
  if (source == null) return fallback;
  if (typeof source === "string") {
    const s = source.trim();
    return s || fallback;
  }
  const text =
    source.alt ||
    source.imageAlt ||
    source.title ||
    source.name ||
    source.label ||
    source.subtitle ||
    source.value ||
    "";
  const s = String(text).trim();
  return s || fallback;
}
