"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchContents } from "@/lib/api";
import {
  createContent,
  deleteContent,
  updateContent,
} from "@/lib/entity-cms-api";
import {
  CONTENT_PAGE_KEY,
  contentCmsHref,
  contentPublicHref,
  normalizeContentPath,
  slugFromPath,
} from "@/lib/content-pages";
import { createContentPageSections, listSections } from "@/lib/cms-api";
import ContentPageSectionBuilder from "@/components/cms/ContentPageSectionBuilder";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  EmptyState,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/CmsUi";

function pathifyFromName(text) {
  const kebab = String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s/-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
  return normalizeContentPath(kebab);
}

const emptyForm = {
  name: "",
  path: "",
  description: "",
  status: "active",
};

export default function CmsContentsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  /** null = closed, "new" = create, or original slug when editing */
  const [formMode, setFormMode] = useState(null);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [pathTouched, setPathTouched] = useState(false);
  const [sectionCatalog, setSectionCatalog] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  async function load(search = q) {
    setLoading(true);
    try {
      const res = await fetchContents({
        limit: 100,
        ...(search.trim() ? { q: search.trim() } : {}),
      });
      setItems(res.data || []);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetchContents({
          limit: 100,
          ...(q.trim() ? { q: q.trim() } : {}),
        });
        if (!alive) return;
        setItems(res.data || []);
        setError(null);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    }, q ? 250 : 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q]);

  function closeForm() {
    setFormMode(null);
    setEditingSlug(null);
    setForm(emptyForm);
    setPathTouched(false);
    setSelectedSections([]);
  }

  async function loadSectionCatalog() {
    setCatalogLoading(true);
    try {
      const res = await listSections({ status: true, limit: 200 });
      setSectionCatalog(res.data || []);
    } catch {
      setSectionCatalog([]);
    } finally {
      setCatalogLoading(false);
    }
  }

  function openCreate() {
    setFormMode("new");
    setEditingSlug(null);
    setForm(emptyForm);
    setPathTouched(false);
    setSelectedSections([]);
    setError(null);
    loadSectionCatalog();
  }

  function openEdit(item) {
    setFormMode("edit");
    setEditingSlug(item.slug);
    setForm({
      name: item.name || "",
      path: item.path || contentPublicHref(item),
      description: item.description || "",
      status: item.status || "active",
    });
    setPathTouched(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const editingHome = formMode === "edit" && editingSlug === "home";
      const path = editingHome
        ? "/"
        : normalizeContentPath(form.path.trim() || pathifyFromName(form.name));
      if (!editingHome && path === "/") {
        setError({
          message:
            "Path / is reserved for the homepage. Create another path (e.g. /about-us).",
        });
        setSaving(false);
        return;
      }
      const payload = {
        name: form.name.trim(),
        path,
        slug: slugFromPath(path),
        description: form.description.trim(),
        status: editingHome ? "active" : form.status,
      };

      if (formMode === "edit" && editingSlug) {
        await updateContent(editingSlug, payload);
        closeForm();
        await load();
      } else {
        const res = await createContent(payload);
        const content = res.data;
        const entityId = String(content._id || content.id || "");
        if (entityId && selectedSections.length) {
          await createContentPageSections(
            CONTENT_PAGE_KEY,
            entityId,
            selectedSections.map((row) => row.section_key)
          );
        }
        closeForm();
        await load();
        window.location.href = contentCmsHref(content);
      }
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(item) {
    if (item.path === "/") return;
    try {
      const next = item.status === "active" ? "inactive" : "active";
      await updateContent(item.slug, { status: next });
      await load();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item) {
    if (item.path === "/") return;
    const href = contentPublicHref(item);
    if (!confirm(`Delete page "${item.name}" (${href})?`)) return;
    try {
      if (editingSlug === item.slug) closeForm();
      await deleteContent(item.slug);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  const formOpen = formMode != null;

  return (
    <div>
      <CmsHeading
        title="Content pages"
        subtitle="Create a URL, pick sections locally, then publish — or open live CMS to edit an existing page."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => (formOpen ? closeForm() : openCreate())}
          >
            {formOpen ? "Cancel" : "Add page"}
          </button>
        }
      />

      <ErrorBanner error={error} />

      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Path is the real URL (e.g.{" "}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">
          /about-us
        </code>
        ). The homepage row (
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">/</code>
        ) is <strong>system</strong> — path cannot change or be deleted. It uses
        the{" "}
        <Link href="/cms/pages/home" className="text-brand">
          home
        </Link>{" "}
        template; other pages use{" "}
        <Link href="/cms/pages/content" className="text-brand">
          content
        </Link>
        . Later you can restrict who edits home vs free-form pages by Page key.
      </p>

      {formOpen ? (
        <CmsPanel
          title={
            formMode === "edit" && editingSlug === "home"
              ? "Homepage (system)"
              : formMode === "edit"
                ? "Edit content page"
                : "New content page"
          }
          className="mb-4"
        >
          {formMode === "edit" && editingSlug === "home" ? (
            <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
              Path stays <code className="rounded bg-amber-100 px-1 dark:bg-amber-950">/</code>.
              Use Edit live to change sections — not Delete or Disable.
            </p>
          ) : null}
          <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                required
                maxLength={80}
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    path:
                      editingSlug === "home"
                        ? "/"
                        : pathTouched
                          ? f.path
                          : pathifyFromName(name),
                  }));
                }}
              />
            </Field>
            <Field
              label="Path (URL)"
              hint={
                editingSlug === "home"
                  ? "Locked — homepage always uses /"
                  : "e.g. /about-us or /company/careers"
              }
            >
              <input
                className={inputClass}
                required
                disabled={editingSlug === "home"}
                pattern="/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*)?"
                placeholder="/company/careers"
                value={form.path}
                onChange={(e) => {
                  setPathTouched(true);
                  setForm((f) => ({
                    ...f,
                    path: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9/-]/g, "")
                      .replace(/\/+/g, "/"),
                  }));
                }}
              />
            </Field>
            <Field label="Status">
              <select
                className={inputClass}
                disabled={editingSlug === "home"}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>
            {formMode === "edit" && editingSlug ? (
              <Field label="API slug" hint="Updates automatically from path">
                <input
                  className={inputClass}
                  disabled
                  value={slugFromPath(form.path || "/")}
                />
              </Field>
            ) : null}
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className={inputClass}
                rows={2}
                maxLength={500}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                {saving
                  ? "Saving…"
                  : formMode === "edit"
                    ? "Save changes"
                    : selectedSections.length
                      ? `Create page (${selectedSections.length} sections)`
                      : "Create blank page"}
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
          {formMode === "new" ? (
            catalogLoading ? (
              <p className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800">
                Loading section library…
              </p>
            ) : (
              <ContentPageSectionBuilder
                catalog={sectionCatalog}
                value={selectedSections}
                onChange={setSelectedSections}
                disabled={saving}
              />
            )
          ) : null}
        </CmsPanel>
      ) : null}

      <CmsPanel
        title="All content pages"
        actions={
          <input
            className={`${inputClass} max-w-xs`}
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        }
      >
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !items.length ? (
          <EmptyState message="No content pages yet. Add one to get a public URL." />
        ) : (
          <ul className="m-0 divide-y divide-slate-200 p-0 dark:divide-slate-800">
            {items.map((item) => {
              const href = contentPublicHref(item);
              const cmsHref = contentCmsHref(item);
              const isRoot = item.path === "/";
              const isEditing = formMode === "edit" && editingSlug === item.slug;
              return (
                <li
                  key={item._id || item.id || item.slug}
                  className={`flex flex-wrap items-center justify-between gap-3 py-3 ${
                    isEditing ? "bg-brand/5" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="m-0 font-semibold text-slate-900 dark:text-white">
                      {item.name}
                      {isRoot ? (
                        <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          System
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 mb-0 text-xs text-slate-500">
                      {item.path || href}
                      {isRoot ? " · home template (locked path)" : " · free-form"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      active={item.status === "active"}
                      labelOn="active"
                      labelOff="inactive"
                    />
                    <button
                      type="button"
                      className={`${btnSecondary} text-xs`}
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
                    <Link href={href} className={`${btnSecondary} text-xs`}>
                      View
                    </Link>
                    <Link href={cmsHref} className={`${btnPrimary} text-xs`}>
                      Edit live
                    </Link>
                    {!isRoot ? (
                      <>
                        <button
                          type="button"
                          className={`${btnSecondary} text-xs`}
                          onClick={() => onToggleStatus(item)}
                        >
                          {item.status === "active" ? "Disable" : "Enable"}
                        </button>
                        <button
                          type="button"
                          className={`${btnDanger} text-xs`}
                          onClick={() => onDelete(item)}
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CmsPanel>
    </div>
  );
}
