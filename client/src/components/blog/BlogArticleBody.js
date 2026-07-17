"use client";

/**
 * Public article body — sanitized rich HTML with heading anchors for TOC.
 * Prefer passing html already prepared by prepareBlogContentWithToc.
 */
export default function BlogArticleBody({ html, content }) {
  const markup = html || content || "";
  if (!markup) return null;

  return (
    <div
      className="cms-rich-body mt-8 text-[1.05rem] leading-8 text-slate-700 dark:text-slate-300 [&_h2]:scroll-mt-28 [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink dark:[&_h2]:text-white [&_h3]:scroll-mt-28 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:font-[family-name:var(--font-display)] [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink dark:[&_h3]:text-white [&_h4]:scroll-mt-28 [&_p]:my-6 [&_ul]:my-6 [&_ol]:my-6"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
