"use client";

import { useState, type FormEvent } from "react";
import { fetchBlogs } from "@/lib/api";
import {
  createBlog,
  deleteBlog,
  restoreBlog,
  updateBlog,
} from "@/lib/api/entity-cms-api";
import { cmsEditHref, cmsPublicHref } from "@/lib/cms/cms-edit-routes";
import { nextToggleStatus } from "@/lib/cms/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/admin/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/admin/CmsEntityRowActions";
import CmsRichTextEditor from "@/components/cms/editors/CmsRichTextEditor";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/admin/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  Field,
  inputClass,
  btnPrimary,
} from "@/components/cms/admin/CmsUi";
import { isRichTextEmpty, sanitizeRichHtml } from "@/lib/utils/rich-text";
import type { CmsEntityListItem } from "@/components/cms/admin/types";
import type { BlogCreateForm, BlogListItem } from "../entity-types";

const emptyForm: BlogCreateForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "insights",
  authorName: "SkillHub Editorial",
  featuredImage: "",
  status: "draft",
};

export default function CmsBlogsPage() {
  const {
    filter,
    setFilter,
    page,
    setPage,
    limit,
    totalPages,
    items,
    total,
    loading,
    error,
    setError,
    onSearchChange,
    reload,
  } = useCmsEntityList<BlogListItem>(fetchBlogs);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
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
      window.location.href = `/cms/blog/${(response.data as BlogListItem).slug}`;
    } catch (err) {
      setError(err);
      setSaving(false);
    }
  }

  async function onToggleStatus(item: CmsEntityListItem) {
    const blog = item as BlogListItem;
    try {
      await updateBlog(String(blog.slug), {
        status: nextToggleStatus(blog.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item: CmsEntityListItem) {
    const blog = item as BlogListItem;
    if (!confirm(`Delete blog "${blog.title}"?`)) return;
    try {
      await deleteBlog(String(blog.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(item: CmsEntityListItem) {
    const blog = item as BlogListItem;
    try {
      await restoreBlog(String(blog.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div className="w-full">
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
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </Field>
            <Field label="Category">
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </Field>
            <Field label="Author">
              <input
                className={inputClass}
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              />
            </Field>
            <Field label="Featured image URL">
              <input
                className={inputClass}
                value={form.featuredImage}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featuredImage: e.target.value }))
                }
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </Field>
            <Field label="Article content" className="sm:col-span-2">
              <CmsRichTextEditor
                value={form.content}
                onChange={(html) => setForm((f) => ({ ...f, content: html }))}
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

      <CmsEntityListPanel
        title="All blogs"
        items={items}
        loading={loading}
        total={total ?? 0}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={setPage}
        onSearchChange={onSearchChange}
        filter={filter}
        onFilterChange={setFilter}
        searchPlaceholder="Search blogs…"
        renderItem={(blog) => (
          <li key={blog.slug} className={cmsEntityListRowClass()}>
            <div className={cmsEntityListPrimaryClass()}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cmsEntityListTitleClass()}>{blog.title}</p>
                <CmsEntityStatusBadge item={blog} />
              </div>
              <p className={cmsEntityListMetaClass()}>
                {blog.category} · {blog.readingTime || 1} min · /blog/{blog.slug}
              </p>
            </div>
            <CmsEntityRowActions
              item={blog}
              editHref={`/cms/blog/${blog.slug}`}
              publicHref={cmsPublicHref("blog", String(blog.slug))}
              liveEditHref={cmsEditHref("blog", String(blog.slug))}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </li>
        )}
      />
    </div>
  );
}
