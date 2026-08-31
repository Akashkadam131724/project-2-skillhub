/** Author metadata on blog posts */
export type BlogAuthor = {
  name?: string;
  role?: string;
};

/** Fields used by list cards, directory grids, and related posts */
export type BlogSummary = {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  featuredImage?: string;
  imageAlt?: string;
  publishedAt?: string;
  createdAt?: string;
  readingTime?: number;
  author?: BlogAuthor;
  status?: string;
  tags?: string[];
};

/** Single entry in the article table of contents */
export type BlogTocItem = {
  id: string;
  text: string;
  level: number;
};

export type PrepareBlogContentResult = {
  html: string;
  items: BlogTocItem[];
};

/** Coerce API / CMS rows into BlogSummary for typed cards */
export function asBlogSummary(value: unknown): BlogSummary | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const slug = String(row.slug || "").trim();
  const title = String(row.title || "").trim();
  if (!slug || !title) return null;

  const author =
    row.author && typeof row.author === "object"
      ? (row.author as BlogAuthor)
      : undefined;

  return {
    _id: row._id != null ? String(row._id) : undefined,
    id: row.id != null ? String(row.id) : undefined,
    slug,
    title,
    excerpt: row.excerpt != null ? String(row.excerpt) : undefined,
    category: row.category != null ? String(row.category) : undefined,
    featuredImage:
      row.featuredImage != null ? String(row.featuredImage) : undefined,
    imageAlt: row.imageAlt != null ? String(row.imageAlt) : undefined,
    publishedAt:
      row.publishedAt != null ? String(row.publishedAt) : undefined,
    createdAt: row.createdAt != null ? String(row.createdAt) : undefined,
    readingTime:
      typeof row.readingTime === "number" ? row.readingTime : undefined,
    author,
    status: row.status != null ? String(row.status) : undefined,
    tags: Array.isArray(row.tags)
      ? row.tags.map((tag) => String(tag))
      : undefined,
  };
}
