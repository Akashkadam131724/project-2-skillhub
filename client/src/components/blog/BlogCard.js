import Link from "next/link";
import { mediaUrl } from "@/lib/cms-api";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function BlogCard({ blog, featured = false }) {
  const image = mediaUrl(blog.featuredImage);
  const author = blog.author?.name || "SkillHub Editorial";

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_16px_50px_-35px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-900 ${
        featured ? "grid min-h-full md:grid-cols-[1.08fr_0.92fr]" : "flex h-full flex-col"
      }`}
    >
      <Link
        href={`/blog/${blog.slug}`}
        className={`relative block overflow-hidden bg-slate-100 dark:bg-slate-800 ${
          featured ? "min-h-64 md:min-h-[25rem]" : "aspect-[16/10]"
        }`}
        aria-label={`Read ${blog.title}`}
      >
        {image ? (
          <img
            src={image}
            alt={blog.imageAlt || blog.title}
            className="absolute inset-0 size-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,138,110,0.32),transparent_42%),linear-gradient(135deg,#0f172a,#1e3a5f_55%,#0f766e)]">
            <div className="absolute right-8 bottom-8 size-24 rounded-full border border-white/15" />
            <div className="absolute right-16 bottom-16 size-24 rounded-full border border-white/10" />
          </div>
        )}
        <span className="absolute top-4 left-4 rounded-full border border-white/30 bg-slate-950/65 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md">
          {blog.category || "Insights"}
        </span>
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? "p-7 sm:p-9" : "p-6"}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{blog.readingTime || 1} min read</span>
        </div>
        <h3
          className={`m-0 font-[family-name:var(--font-display)] leading-tight font-semibold tracking-tight text-ink dark:text-white ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          <Link
            href={`/blog/${blog.slug}`}
            className="text-inherit no-underline transition-colors group-hover:text-brand"
          >
            {blog.title}
          </Link>
        </h3>
        {blog.excerpt ? (
          <p className="mt-4 mb-0 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {blog.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
            {author}
          </span>
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand no-underline"
          >
            Read article
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
