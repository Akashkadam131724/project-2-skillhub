/** Shared ISR settings for public marketing routes. */
export const NAV_CACHE_REVALIDATE_SECONDS = 3600;
export const PUBLIC_PAGE_REVALIDATE_SECONDS = 60;
export const BLOG_REVALIDATE_SECONDS = 60;

export const NAVIGATION_CACHE_TAG = "navigation";
export const BLOG_LIST_CACHE_TAG = "blogs-list";

export function navFetchOptions() {
  return {
    next: {
      revalidate: NAV_CACHE_REVALIDATE_SECONDS,
      tags: [NAVIGATION_CACHE_TAG],
    },
  };
}

/** ISR fetch options for public entity/content pages (not no-store). */
export function isrFetchOptions({
  revalidate = PUBLIC_PAGE_REVALIDATE_SECONDS,
  tags = [],
}: {
  revalidate?: number;
  tags?: Array<string | null | undefined>;
} = {}) {
  return {
    next: {
      revalidate,
      tags: tags.filter(Boolean) as string[],
    },
  };
}

export function blogFetchOptions(
  slug: string | undefined,
  { list = false }: { list?: boolean } = {}
) {
  const tags = list
    ? [BLOG_LIST_CACHE_TAG]
    : ["blog", slug ? `blog:${slug}` : null, slug ? `blog-sections:${slug}` : null];

  return isrFetchOptions({
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags,
  });
}
