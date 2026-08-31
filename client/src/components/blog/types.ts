import type {
  BlogSummary,
  BlogTocItem,
} from "@/lib/types/blog";

export type {
  BlogAuthor,
  BlogSummary,
  BlogTocItem,
  PrepareBlogContentResult,
} from "@/lib/types/blog";
export { asBlogSummary } from "@/lib/types/blog";

export type BlogCardProps = {
  blog: BlogSummary;
  featured?: boolean;
};

export type BlogArticleBodyProps = {
  html?: string;
  content?: string;
};

export type BlogTableOfContentsProps = {
  items?: BlogTocItem[];
};
