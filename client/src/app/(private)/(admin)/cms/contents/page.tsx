"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { fetchContents } from "@/lib/api";
import {
  createContent,
  deleteContent,
  restoreContent,
  updateContent,
} from "@/lib/api/entity-cms-api";
import {
  CONTENT_PAGE_KEY,
  contentCmsHref,
  contentPublicHref,
  normalizeContentPath,
  slugFromPath,
} from "@/lib/content/content-pages";
import { nextToggleStatus } from "@/lib/cms/cms-list-filters";
import { useCmsEntityList } from "@/hooks/useCmsEntityList";
import CmsEntityListPanel from "@/components/cms/admin/CmsEntityListPanel";
import CmsEntityRowActions, {
  CmsEntityStatusBadge,
} from "@/components/cms/admin/CmsEntityRowActions";
import { createContentPageSections, listSections } from "@/lib/api/cms-api";
import ContentPageSectionBuilder from "@/components/cms/sections/ContentPageSectionBuilder";
import type {
  ContentPageSectionRow,
} from "@/components/cms/sections/types";
import {
  cmsEntityListMetaClass,
  cmsEntityListPrimaryClass,
  cmsEntityListRowClass,
  cmsEntityListTitleClass,
} from "@/components/cms/admin/cms-entity-list-row";
import {
  CmsHeading,
  CmsPanel,
  Field,
  ErrorBanner,
  inputClass,
  btnPrimary,
  btnSecondary,
} from "@/components/cms/admin/CmsUi";
import type {
  ContentFormMode,
  ContentPageForm,
  ContentPageListItem,
  SectionCatalogDoc,
} from "../entity-types";

function pathifyFromName(text: string) {
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

const emptyForm: ContentPageForm = {
  name: "",
  path: "",
  description: "",
  status: "active",
};

export default function CmsContentsPage() {
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
  } = useCmsEntityList<ContentPageListItem>(fetchContents);
  const [saving, setSaving] = useState(false);
  const [formMode, setFormMode] = useState<ContentFormMode>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pathTouched, setPathTouched] = useState(false);
  const [sectionCatalog, setSectionCatalog] = useState<SectionCatalogDoc[]>([]);
  const [selectedSections, setSelectedSections] = useState<ContentPageSectionRow[]>(
    []
  );
  const [catalogLoading, setCatalogLoading] = useState(false);

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
      setSectionCatalog((res.data || []) as SectionCatalogDoc[]);
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

  function openEdit(item: ContentPageListItem) {
    setFormMode("edit");
    setEditingSlug(String(item.slug));
    setForm({
      name: item.name || "",
      path: item.path || contentPublicHref(item),
      description: String(item.description || ""),
      status: item.status || "active",
    });
    setPathTouched(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
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
        await reload();
      } else {
        const res = await createContent(payload);
        const content = res.data as ContentPageListItem;
        const entityId = String(content._id || content.id || "");
        if (entityId && selectedSections.length) {
          await createContentPageSections(
            CONTENT_PAGE_KEY,
            entityId,
            selectedSections.map((row) => row.section_key)
          );
        }
        closeForm();
        await reload();
        window.location.href = contentCmsHref(content);
      }
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(item: ContentPageListItem) {
    if (item.path === "/") return;
    try {
      await updateContent(String(item.slug), {
        status: nextToggleStatus(item.status),
      });
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onDelete(item: ContentPageListItem) {
    if (item.path === "/") return;
    const href = contentPublicHref(item);
    if (!confirm(`Delete page "${item.name}" (${href})?`)) return;
    try {
      if (editingSlug === item.slug) closeForm();
      await deleteContent(String(item.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  async function onRestore(item: ContentPageListItem) {
    try {
      await restoreContent(String(item.slug));
      await reload();
    } catch (err) {
      setError(err);
    }
  }

  const formOpen = formMode != null;

  return (
    <div className="w-full">
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

      <CmsEntityListPanel
        title="All content pages"
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
        searchPlaceholder="Search content pages…"
        renderItem={(item) => {
          const href = contentPublicHref(item);
          const cmsHref = contentCmsHref(item);
          const isRoot = item.path === "/";
          const isEditing = formMode === "edit" && editingSlug === item.slug;
          return (
            <li
              key={String(item._id || item.id || item.slug)}
              className={cmsEntityListRowClass(isEditing ? "bg-brand/5" : "")}
            >
              <div className={cmsEntityListPrimaryClass()}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cmsEntityListTitleClass()}>
                    {item.name}
                    {isRoot ? (
                      <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        System
                      </span>
                    ) : null}
                  </p>
                  <CmsEntityStatusBadge item={item} />
                </div>
                <p className={cmsEntityListMetaClass()}>
                  {item.path || href}
                  {isRoot ? " · home template (locked path)" : " · free-form"}
                </p>
              </div>
              <CmsEntityRowActions
                item={item}
                onEdit={(row) => openEdit(row as ContentPageListItem)}
                publicHref={href}
                liveEditHref={cmsHref}
                onToggleStatus={(row) => onToggleStatus(row as ContentPageListItem)}
                onDelete={(row) => onDelete(row as ContentPageListItem)}
                onRestore={(row) => onRestore(row as ContentPageListItem)}
                canToggle={!isRoot}
                canDelete={!isRoot}
              />
            </li>
          );
        }}
      />
    </div>
  );
}
