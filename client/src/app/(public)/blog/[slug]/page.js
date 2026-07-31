import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchBlogBySlug, fetchBlogs } from "@/lib/api";
import { getPageSectionsResolved, mediaUrl } from "@/lib/cms-api";
import BlogArticleBody from "@/components/blog/BlogArticleBody";
import BlogCard from "@/components/blog/BlogCard";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import CmsLivePageSections from "@/components/cms/CmsLivePageSections";
import SectionWrapper from "@/components/sections/SectionWrapper";
import { prepareBlogContentWithToc } from "@/lib/blog-toc";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const { data: blog } = await fetchBlogBySlug(slug);
    return {
      title: blog.seoTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      openGraph: {
        title: blog.seoTitle || blog.title,
        description: blog.metaDescription || blog.excerpt,
        type: "article",
        publishedTime: blog.publishedAt,
        images: blog.featuredImage ? [mediaUrl(blog.featuredImage)] : [],
      },
    };
  } catch {
    return { title: "Article not found" };
  }
}

export default async function BlogDetailPage({ params, searchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const cmsMode = String(query?.cms || "") === "true";
  let blog;

  try {
    const response = await fetchBlogBySlug(slug);
    blog = response.data;
  } catch {
    notFound();
  }

  if (blog.status !== "active" && !cmsMode) notFound();

  const blogId = String(blog._id || blog.id);
  const [sectionsResponse, relatedResponse] = await Promise.all([
    getPageSectionsResolved("blog", blogId).catch(() => ({
      sections: [],
      page: null,
    })),
    fetchBlogs({
      status: "active",
      category: blog.category,
      limit: 4,
    }).catch(() => ({ data: [] })),
  ]);
  const related = (relatedResponse.data || [])
    .filter((item) => item.slug !== blog.slug)
    .slice(0, 3);
  const image = mediaUrl(blog.featuredImage);
  const author = blog.author?.name || "SkillHub Editorial";
  const { html: articleHtml, items: tocItems } = prepareBlogContentWithToc(
    blog.content
  );

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <article>
        <header className="relative overflow-hidden bg-slate-950 text-white">
          <div
            className="absolute inset-0 opacity-75"
            style={{
              background:
                "radial-gradient(circle at 20% 10%, rgba(37,99,168,.32), transparent 34%), radial-gradient(circle at 90% 60%, rgba(45,138,110,.3), transparent 36%)",
            }}
            aria-hidden
          />
          <SectionWrapper className="relative pt-14 pb-20 sm:pt-20 sm:pb-28">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-slate-300 no-underline uppercase hover:text-white"
            >
              <span aria-hidden>←</span> All insights
            </Link>
            <div className="mt-10 max-w-4xl">
              <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-emerald-200 uppercase">
                {blog.category || "Insights"}
              </span>
              <h1 className="mt-5 mb-0 font-[family-name:var(--font-display)] text-4xl leading-[1.04] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
                {blog.title}
              </h1>
              <p className="mt-6 mb-0 max-w-3xl text-lg leading-8 text-slate-300">
                {blog.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-400">
                <span className="font-semibold text-white">{author}</span>
                {blog.author?.role ? <span>{blog.author.role}</span> : null}
                <span aria-hidden>·</span>
                <time dateTime={blog.publishedAt}>
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </time>
                <span aria-hidden>·</span>
                <span>{blog.readingTime || 1} min read</span>
              </div>
            </div>
          </SectionWrapper>
        </header>

        {image ? (
          <SectionWrapper className="-mt-12 relative z-10 sm:-mt-16">
            <div className="aspect-[16/8] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-100 shadow-2xl dark:bg-slate-900">
              <img
                src={image}
                alt={blog.imageAlt || blog.title}
                className="size-full object-cover"
              />
            </div>
          </SectionWrapper>
        ) : null}

        <SectionWrapper className="py-12 sm:py-16">
          <div
            className={
              tocItems.length
                ? "grid w-full lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-14"
                : "w-full min-w-0"
            }
          >
            {tocItems.length ? <BlogTableOfContents items={tocItems} /> : null}
            <div className="min-w-0">
              <div className="h-1 w-16 rounded-full bg-brand" aria-hidden />
              <BlogArticleBody html={articleHtml} />
              {blog.tags?.length ? (
                <div className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-8 dark:border-slate-800">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </SectionWrapper>
      </article>

      {related.length ? (
        <section className="border-y border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
          <SectionWrapper className="py-14 sm:py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="m-0 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
                  Keep exploring
                </p>
                <h2 className="mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink dark:text-white">
                  Related insights
                </h2>
              </div>
              <Link href="/blogs" className="text-sm font-semibold text-brand no-underline">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item._id || item.id || item.slug} blog={item} />
              ))}
            </div>
          </SectionWrapper>
        </section>
      ) : null}

      <Suspense fallback={null}>
        <CmsLivePageSections
          pageKey="blog"
          entityId={blogId}
          entityLabel={blog.title}
          initialSections={sectionsResponse.sections || []}
          initialTheme={sectionsResponse.page?.theme || null}
          pageContext={{
            entityType: "blog",
            entityId: blogId,
            entityName: blog.title,
            blogSlug: blog.slug,
          }}
        />
      </Suspense>
    </main>
  );
}
