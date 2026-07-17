"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBlogs } from "@/lib/api";
import { createBlog, deleteBlog } from "@/lib/entity-cms-api";
import CmsRichTextEditor from "@/components/cms/CmsRichTextEditor";
import {
  CmsHeading,
  CmsPanel,
  EmptyState,
  ErrorBanner,
  Field,
  StatusBadge,
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
} from "@/components/cms/CmsUi";
import { isRichTextEmpty, sanitizeRichHtml } from "@/lib/rich-text";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "insights",
  authorName: "SkillHub Editorial",
  featuredImage: "",
  status: "draft",
};

export default function CmsBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function load(search = q) {
    setLoading(true);
    try {
      const response = await fetchBlogs({
        limit: 100,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      setBlogs(response.data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => load(q), q ? 250 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function onCreate(event) {
    event.preventDefault();
    const content = sanitizeRichHtml(form.content);
    if (isRichTextEmpty(content)) {
      setError({ message: "Article content is required" });
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await createBlog({
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content,
        category: form.category.trim() || "insights",
        featuredImage: form.featuredImage.trim(),
        author: { name: form.authorName.trim() || "SkillHub Editorial" },
        status: form.status,
      });
      window.location.href = `/cms/blogs/${response.data.slug}`;
    } catch (err) {
      setError(err);
      setSaving(false);
    }
  }

  async function onDelete(blog) {
    if (!confirm(`Delete blog “${blog.title}”?`)) return;
    try {
      await deleteBlog(blog.slug);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="Blogs"
        subtitle="Create editorial stories, publish insights, and manage the public journal."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => {
              setShowForm((value) => !value);
              setForm(emptyForm);
            }}
          >
            {showForm ? "Cancel" : "New blog"}
          </button>
        }
      />
      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="New blog" className="mb-4">
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(event) =>
                  setForm((value) => ({ ...value, title: event.target.value }))
                }
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  setForm((value) => ({ ...value, category: event.target.value }))
                }
              />
            </Field>
            <Field label="Author">
              <input
                className={inputClass}
                value={form.authorName}
                onChange={(event) =>
                  setForm((value) => ({ ...value, authorName: event.target.value }))
                }
              />
            </Field>
            <Field label="Featured image URL">
              <input
                className={inputClass}
                value={form.featuredImage}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    featuredImage: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(event) =>
                  setForm((value) => ({ ...value, status: event.target.value }))
                }
              >
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>
            <Field label="Excerpt" className="sm:col-span-2">
              <textarea
                required
                className={`${inputClass} min-h-20`}
                value={form.excerpt}
                onChange={(event) =>
                  setForm((value) => ({ ...value, excerpt: event.target.value }))
                }
              />
            </Field>
            <Field label="Article content" className="sm:col-span-2">
              <CmsRichTextEditor
                value={form.content}
                onChange={(html) =>
                  setForm((value) => ({ ...value, content: html }))
                }
                placeholder="Write the article…"
              />
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving ? "Creating…" : "Create blog"}
              </button>
            </div>
          </form>
        </CmsPanel>
      ) : null}

      <CmsPanel title="All blogs">
        <input
          className={`${inputClass} mb-4`}
          placeholder="Search blogs…"
          value={q}
          onChange={(event) => setQ(event.target.value)}
        />
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !blogs.length ? (
          <EmptyState message="No blogs yet." />
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0 dark:divide-slate-900">
            {blogs.map((blog) => (
              <li
                key={blog._id || blog.id || blog.slug}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="m-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {blog.title}
                    </p>
                    <StatusBadge active={blog.status === "active"} />
                  </div>
                  <p className="mt-1 mb-0 text-xs text-slate-500">
                    {blog.category} · {blog.readingTime || 1} min · /blog/{blog.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/cms/blogs/${blog.slug}`} className={btnSecondary}>
                    Edit
                  </Link>
                  <Link href={`/blog/${blog.slug}?cms=true`} className={btnPrimary}>
                    Edit live
                  </Link>
                  <button
                    type="button"
                    className={btnDanger}
                    onClick={() => onDelete(blog)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CmsPanel>
    </div>
  );
}
