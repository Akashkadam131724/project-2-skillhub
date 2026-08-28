export function resolveLatestBlogsLimit(
  data?: { limit?: number | string }
): number {
  return Math.min(Math.max(Number(data?.limit) || 3, 1), 6);
}

export function resolveLatestBlogsCategory(
  data?: { category?: string }
): string {
  return String(data?.category || "").trim();
}

export function resolveLatestBlogsTitle(sectionTitle?: string): string {
  return String(sectionTitle || "").trim() || "Latest insights";
}

export function resolveLatestBlogsSubtitle(subTitle?: string): string {
  return String(subTitle || "").trim();
}
