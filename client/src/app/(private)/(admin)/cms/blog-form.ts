import type { BlogRecord, BlogEditForm } from "./entity-types";

export function formFromBlog(data: BlogRecord): BlogEditForm {
  return {
    title: data.title || "",
    slug: data.slug || "",
    excerpt: data.excerpt || "",
    content: (data.content as string) || "",
    category: data.category || "insights",
    tags: (data.tags || []).join(", "),
    featuredImage: data.featuredImage || "",
    imageAlt: data.imageAlt || "",
    authorName: data.author?.name || "SkillHub Editorial",
    authorRole: data.author?.role || "",
    authorAvatar: (data.author as { avatar?: string } | undefined)?.avatar || "",
    status: data.status || "draft",
    featured: Boolean(data.featured),
    seoTitle: (data.seoTitle as string) || "",
    metaDescription: (data.metaDescription as string) || "",
  };
}
