"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchBlogBySlug } from "@/lib/api";
import { deleteBlog, updateBlog } from "@/lib/api/entity-cms-api";
import CmsRichTextEditor from "@/components/cms/editors/CmsRichTextEditor";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  Field,
  StatusBadge,
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
} from "@/components/cms/admin/CmsUi";
import { isRichTextEmpty, sanitizeRichHtml } from "@/lib/utils/rich-text";
import type { BlogEditForm, BlogRecord } from "../../entity-types";
import { formFromBlog } from "../../blog-form";
import { useSlugParam } from "@/hooks/useSlugParam";

export default function CmsBlogEditPage() {
  const blogSlug = useSlugParam();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogRecord | null>(null);
  const [form, setForm] = useState<BlogEditForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function load() {
    setError(null);
    try {
      const response = await fetchBlogBySlug(blogSlug);
      const data = response.data as BlogRecord;
      setBlog(data);
      setForm(formFromBlog(data));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogSlug]);

  function setField<K extends keyof BlogEditForm>(field: K, value: BlogEditForm[K]) {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const content = sanitizeRichHtml(form.content);
    if (isRichTextEmpty(content)) {
      setError({ message: "Article content is required" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await updateBlog(blogSlug, {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content,
        category: form.category.trim() || "insights",
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        featuredImage: form.featuredImage.trim(),
        imageAlt: form.imageAlt.trim(),
        author: {
          name: form.authorName.trim() || "SkillHub Editorial",
          role: form.authorRole.trim(),
          avatar: form.authorAvatar.trim(),
        },
        status: form.status,
        featured: form.featured,
        seoTitle: form.seoTitle.trim(),
        metaDescription: form.metaDescription.trim(),
      });
      const nextSlug = (response.data as BlogRecord).slug;
      if (nextSlug !== blogSlug) {
        router.replace(`/cms/blogs/${nextSlug}`);
        return;
      }
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete blog "${blog?.title}"?`)) return;
    try {
      await deleteBlog(blogSlug);
      router.push("/cms/blogs");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;
  if (!blog || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Blog not found" }} />
        <Link href="/cms/blogs" className={btnSecondary}>
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <CmsHeading
        title={blog.title}
        subtitle={`Slug: ${blog.slug} · ${blog.readingTime || 1} min read`}
        actions={
          <>
            <Link href="/cms/blogs" className={btnSecondary}>
              All blogs
            </Link>
            <Link href={`/cms/blog/edit/${blog.slug}`} className={btnPrimary}>
              Edit live sections
            </Link>
            <StatusBadge active={blog.status === "active"} />
          </>
        }
      />
      <ErrorBanner error={error} />

      <form onSubmit={onSave} className="space-y-4">
        <CmsPanel title="Article">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </Field>
            <Field label="Slug">
              <input
                required
                className={inputClass}
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              />
            </Field>
            <Field label="Tags" className="sm:col-span-2">
              <input
                className={inputClass}
                placeholder="leadership, ai, workforce"
                value={form.tags}
                onChange={(e) => setField("tags", e.target.value)}
              />
            </Field>
            <Field label="Excerpt" className="sm:col-span-2">
              <textarea
                required
                className={`${inputClass} min-h-24`}
                value={form.excerpt}
                onChange={(e) => setField("excerpt", e.target.value)}
              />
            </Field>
            <Field label="Content" className="sm:col-span-2">
              <CmsRichTextEditor
                key={`blog-content-${blog.slug}`}
                value={form.content}
                onChange={(html) => setField("content", html)}
                placeholder="Write the article…"
              />
              <p className="mt-1 mb-0 text-xs text-slate-500">
                Same rich editor used on section bodies — headings, lists, links,
                images, and colors.
              </p>
            </Field>
          </div>
        </CmsPanel>

        <CmsPanel title="Publishing and media">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>
            <Field label="Featured article">
              <label className="flex min-h-10 items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                Prioritize this story in listings
              </label>
            </Field>
            <Field label="Featured image URL">
              <input
                className={inputClass}
                value={form.featuredImage}
                onChange={(e) => setField("featuredImage", e.target.value)}
              />
            </Field>
            <Field label="Image alt text">
              <input
                className={inputClass}
                value={form.imageAlt}
                onChange={(e) => setField("imageAlt", e.target.value)}
              />
            </Field>
            <Field label="Author name">
              <input
                className={inputClass}
                value={form.authorName}
                onChange={(e) => setField("authorName", e.target.value)}
              />
            </Field>
            <Field label="Author role">
              <input
                className={inputClass}
                value={form.authorRole}
                onChange={(e) => setField("authorRole", e.target.value)}
              />
            </Field>
            <Field label="Author avatar URL" className="sm:col-span-2">
              <input
                className={inputClass}
                value={form.authorAvatar}
                onChange={(e) => setField("authorAvatar", e.target.value)}
              />
            </Field>
          </div>
        </CmsPanel>

        <CmsPanel title="Search metadata">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="SEO title">
              <input
                className={inputClass}
                value={form.seoTitle}
                onChange={(e) => setField("seoTitle", e.target.value)}
              />
            </Field>
            <Field label="Meta description">
              <textarea
                className={`${inputClass} min-h-20`}
                value={form.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
              />
            </Field>
          </div>
        </CmsPanel>

        <div className="flex flex-wrap gap-2">
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving…" : "Save blog"}
          </button>
          <button type="button" className={btnDanger} onClick={onDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
