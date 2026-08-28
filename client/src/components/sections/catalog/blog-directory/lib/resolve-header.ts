export const BLOG_DIRECTORY_DEFAULT_LIMIT = 10;
export const BLOG_DIRECTORY_MAX_LIMIT = 24;

export function resolveBlogDirectoryLimit(data?: { limit?: number } | null): number {
  return Math.min(
    Math.max(Number(data?.limit) || BLOG_DIRECTORY_DEFAULT_LIMIT, 1),
    BLOG_DIRECTORY_MAX_LIMIT
  );
}

export function resolveBlogDirectoryTitle(sectionTitle?: string): string {
  return (sectionTitle && String(sectionTitle).trim()) || "Latest thinking";
}

export function resolveBlogDirectorySubtitle(sectionSubtitle?: string): string {
  return (sectionSubtitle && String(sectionSubtitle).trim()) || "";
}
