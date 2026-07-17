"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  deletePage,
  getPage,
  listPageSections,
  listSections,
  mediaUrl,
  reorderPageSections,
  setPageStatus,
  tagSectionToPage,
  updatePage,
  updatePageSectionTag,
  deletePageSectionTag,
  setPageSectionTagStatus,
  uploadCmsImage,
  getSiteTheme,
} from "@/lib/cms-api";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  EmptyState,
  SectionPreviewThumb,
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "@/components/cms/CmsUi";
import {
  contentScopeLabel,
  normalizeContentScope,
} from "@/lib/content-scope";
import { emptyPageTheme, mergeTheme, normalizePageTheme } from "@/lib/theme";
import CmsThemeEditor from "@/components/cms/CmsThemeEditor";
import CmsPagePreviewStack from "@/components/cms/CmsPagePreviewStack";
import {
  FilterGroup,
  FilterChipRow,
  buildCategoryOptions,
  sectionCategory,
  sectionKind,
} from "@/components/cms/CmsSectionFilters";

const ENTITY_TYPES = [
  { value: "", label: "None (static)" },
  { value: "product", label: "product" },
  { value: "course", label: "course" },
  { value: "vendor", label: "vendor" },
  { value: "industry", label: "industry" },
  { value: "skilling_area", label: "skilling_area" },
  { value: "content", label: "content" },
];

const SCOPE_FILTERS = [
  { value: "all", label: "All scopes" },
  { value: "global", label: "Global" },
  { value: "template", label: "Template" },
  { value: "page", label: "Page" },
];

const KIND_FILTERS = [
  { value: "all", label: "All types" },
  { value: "hero", label: "Hero" },
  { value: "cards", label: "Cards" },
  { value: "content", label: "Content" },
  { value: "nav", label: "Nav" },
  { value: "other", label: "Other" },
];

const PLACED_FILTERS = [
  { value: "all", label: "All sections" },
  { value: "available", label: "Not on page" },
  { value: "placed", label: "Already on page" },
];

function ScopeBadge({ scope }) {
  const normalized = normalizeContentScope(scope);
  const label = contentScopeLabel(normalized);
  const styles =
    normalized === "global"
      ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
      : normalized === "template"
        ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

const emptyPlacement = {
  section_key: "",
  sort_order: 0,
  section_title: "",
  sub_title: "",
  in_page_nav_title: "",
  section_bg_img: "",
  section_img_url: "",
  status: true,
};

export default function CmsPageDetailPage() {
  const { key } = useParams();
  const router = useRouter();
  const pageKey = String(key || "");

  const [page, setPage] = useState(null);
  const [form, setForm] = useState(null);
  const [themeForm, setThemeForm] = useState(emptyPageTheme());
  const [siteTheme, setSiteTheme] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [addForm, setAddForm] = useState(emptyPlacement);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addScopeFilter, setAddScopeFilter] = useState("all");
  const [addKindFilter, setAddKindFilter] = useState("all");
  const [addPlacedFilter, setAddPlacedFilter] = useState("all");
  const [addCategoryFilter, setAddCategoryFilter] = useState("all");
  const [addCategorySearch, setAddCategorySearch] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [pageTab, setPageTab] = useState("mapped");

  async function load() {
    setError(null);
    try {
      const [pageRes, tagsRes, sectionsRes, siteRes] = await Promise.all([
        getPage(pageKey),
        listPageSections({ page_key: pageKey }),
        listSections(),
        getSiteTheme().catch(() => null),
      ]);
      setPage(pageRes.data);
      setForm({
        name: pageRes.data.name || "",
        description: pageRes.data.description || "",
        entity_type: pageRes.data.entity_type || "",
        status: pageRes.data.status !== false,
        is_sort_disabled: pageRes.data.is_sort_disabled !== false,
      });
      setThemeForm(normalizePageTheme(pageRes.data.theme));
      setSiteTheme(siteRes?.data || null);
      const tags = (tagsRes.data || [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order);
      setPlacements(tags);
      setAllSections(sectionsRes.data || []);
      setAddForm((f) => ({
        ...f,
        sort_order: tags.length
          ? Math.max(...tags.map((t) => t.sort_order)) + 1
          : 1,
      }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [pageRes, tagsRes, sectionsRes, siteRes] = await Promise.all([
          getPage(pageKey),
          listPageSections({ page_key: pageKey }),
          listSections(),
          getSiteTheme().catch(() => null),
        ]);
        if (!alive) return;
        setPage(pageRes.data);
        setForm({
          name: pageRes.data.name || "",
          description: pageRes.data.description || "",
          entity_type: pageRes.data.entity_type || "",
          status: pageRes.data.status !== false,
          is_sort_disabled: pageRes.data.is_sort_disabled !== false,
        });
        setThemeForm(normalizePageTheme(pageRes.data.theme));
        setSiteTheme(siteRes?.data || null);
        const tags = (tagsRes.data || [])
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order);
        setPlacements(tags);
        setAllSections(sectionsRes.data || []);
        setAddForm((f) => ({
          ...emptyPlacement,
          sort_order: tags.length
            ? Math.max(...tags.map((t) => t.sort_order)) + 1
            : 1,
        }));
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pageKey]);

  const sectionOptions = useMemo(
    () => allSections.filter((s) => s.status !== false),
    [allSections]
  );

  const placedKeys = useMemo(
    () => new Set(placements.map((t) => t.section_key)),
    [placements]
  );

  const filteredAddOptions = useMemo(() => {
    const q = addSearch.trim().toLowerCase();
    return sectionOptions.filter((s) => {
      const scope = normalizeContentScope(s.content_scope);
      if (addScopeFilter !== "all" && scope !== addScopeFilter) return false;
      if (addKindFilter !== "all" && sectionKind(s.key) !== addKindFilter) {
        return false;
      }
      if (
        addCategoryFilter !== "all" &&
        sectionCategory(s) !== addCategoryFilter
      ) {
        return false;
      }
      const onPage = placedKeys.has(s.key);
      if (addPlacedFilter === "available" && onPage) return false;
      if (addPlacedFilter === "placed" && !onPage) return false;
      if (!q) return true;
      return (
        String(s.name || "")
          .toLowerCase()
          .includes(q) ||
        String(s.key || "")
          .toLowerCase()
          .includes(q) ||
        String(s.section_title || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [
    sectionOptions,
    addScopeFilter,
    addKindFilter,
    addCategoryFilter,
    addPlacedFilter,
    addSearch,
    placedKeys,
  ]);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(sectionOptions),
    [sectionOptions]
  );

  const addFilterCounts = useMemo(() => {
    const scope = { all: sectionOptions.length, global: 0, template: 0, page: 0 };
    const kind = {
      all: sectionOptions.length,
      hero: 0,
      cards: 0,
      content: 0,
      nav: 0,
      other: 0,
    };
    let placed = 0;
    for (const s of sectionOptions) {
      scope[normalizeContentScope(s.content_scope)] += 1;
      kind[sectionKind(s.key)] += 1;
      if (placedKeys.has(s.key)) placed += 1;
    }
    return {
      scope,
      kind,
      placed: {
        all: sectionOptions.length,
        available: sectionOptions.length - placed,
        placed,
      },
    };
  }, [sectionOptions, placedKeys]);

  async function savePage(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updatePage(pageKey, {
        name: form.name,
        description: form.description,
        entity_type: form.entity_type || null,
        status: form.status,
        is_sort_disabled: form.is_sort_disabled !== false,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function saveTheme() {
    setSaving(true);
    setError(null);
    try {
      await updatePage(pageKey, { theme: themeForm });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function clearTemplateTheme() {
    setSaving(true);
    setError(null);
    try {
      const cleared = emptyPageTheme();
      setThemeForm(cleared);
      await updatePage(pageKey, { theme: cleared });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function addPlacement(e) {
    e.preventDefault();
    if (!addForm.section_key) return;
    setSaving(true);
    setError(null);
    try {
      await tagSectionToPage({
        page_key: pageKey,
        section_key: addForm.section_key,
        sort_order: Number(addForm.sort_order) || 0,
        section_title: addForm.section_title || null,
        sub_title: addForm.sub_title || null,
        in_page_nav_title: addForm.in_page_nav_title || null,
        section_bg_img: addForm.section_bg_img || null,
        section_img_url: addForm.section_img_url || null,
        status: addForm.status,
      });
      setAddForm({
        ...emptyPlacement,
        sort_order: (Number(addForm.sort_order) || 0) + 1,
      });
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function move(index, dir) {
    const next = placements.slice();
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    const items = next.map((t, i) => ({ id: t.id, sort_order: i + 1 }));
    setPlacements(next.map((t, i) => ({ ...t, sort_order: i + 1 })));
    try {
      await reorderPageSections(pageKey, items);
    } catch (err) {
      setError(err);
      await load();
    }
  }

  function startEdit(tag) {
    setEditingId(tag.id);
    setEditForm({
      section_title: tag.section_title || "",
      sub_title: tag.sub_title || "",
      in_page_nav_title: tag.in_page_nav_title || "",
      section_bg_img: tag.section_bg_img || "",
      section_img_url: tag.section_img_url || "",
      sort_order: tag.sort_order,
      status: tag.status !== false,
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updatePageSectionTag(editingId, {
        section_title: editForm.section_title || null,
        sub_title: editForm.sub_title || null,
        in_page_nav_title: editForm.in_page_nav_title || null,
        section_bg_img: editForm.section_bg_img || null,
        section_img_url: editForm.section_img_url || null,
        sort_order: Number(editForm.sort_order) || 0,
        status: editForm.status,
      });
      setEditingId(null);
      setEditForm(null);
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTag(tag) {
    try {
      await setPageSectionTagStatus(tag.id, !tag.status);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  async function removeTag(tag) {
    if (!confirm(`Remove ${tag.section_key} placement from ${pageKey}?`)) return;
    try {
      await deletePageSectionTag(tag.id);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  async function togglePageStatus() {
    try {
      await setPageStatus(pageKey, !page.status);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  async function onDeletePage() {
    if (!confirm(`Delete page "${pageKey}" permanently?`)) return;
    try {
      await deletePage(pageKey);
      router.push("/cms/pages");
    } catch (err) {
      setError(err);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (!page || !form) {
    return (
      <div>
        <ErrorBanner error={error || { message: "Page not found" }} />
        <Link href="/cms/pages" className={btnSecondary}>
          Back to pages
        </Link>
      </div>
    );
  }

  const isEntityTemplate = Boolean(page.entity_type);

  return (
    <div>
      <CmsHeading
        title={page.name}
        subtitle={
          isEntityTemplate
            ? `Template · key: ${page.key} · entity: ${page.entity_type}`
            : `Page key: ${page.key}`
        }
        actions={
          <>
            <Link href="/cms/pages" className={btnSecondary}>
              All pages
            </Link>
            <StatusBadge active={page.status} labelOn="Active" labelOff="Disabled" />
          </>
        }
      />

      <ErrorBanner error={error} />

      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
        {[
          {
            key: "mapped",
            label: `Mapped Sections (${placements.length})`,
          },
          { key: "add", label: "Add new Sections" },
          { key: "preview", label: "Preview" },
          { key: "theme", label: "Theme" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setPageTab(tab.key)}
            className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-sm ${
              pageTab === tab.key
                ? "bg-white text-brand shadow-sm dark:bg-slate-950 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {pageTab === "theme" ? (
          <>
        <CmsPanel title="Sort policy">
          <form
            onSubmit={savePage}
            className="flex flex-wrap items-end gap-4"
          >
            <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.is_sort_disabled !== false}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    is_sort_disabled: e.target.checked,
                  }))
                }
              />
              <span>
                <span className="font-semibold">Disable page-level sort</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  On (default): order only on this template. Off: live entity
                  CMS may reorder per page.
                </span>
              </span>
            </label>
            <button type="submit" className={btnPrimary} disabled={saving}>
              {saving ? "Saving…" : "Save sort policy"}
            </button>
          </form>
        </CmsPanel>

        <CmsPanel
          title="Template theme"
          actions={
            <Link href="/cms/site-theme" className={`${btnSecondary} text-xs`}>
              Edit global site theme
            </Link>
          }
        >
          <p className="mt-0 mb-3 text-xs text-slate-500">
            Overrides for every page using this template. Empty fields use the
            global site theme. Entity pages can override further.
          </p>
          <CmsThemeEditor
            mode="page"
            inheritFrom="site"
            inheritedTheme={mergeTheme(siteTheme)}
            value={themeForm}
            onChange={setThemeForm}
            onSave={saveTheme}
            saving={saving}
            saveLabel="Save template theme"
          />
          <button
            type="button"
            disabled={saving}
            onClick={clearTemplateTheme}
            className={`${btnSecondary} mt-3 w-full`}
          >
            Use site theme (clear template overrides)
          </button>
        </CmsPanel>

        {!isEntityTemplate ? (
          <CmsPanel title="Page settings">
            <form onSubmit={savePage} className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <input
                  className={inputClass}
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </Field>
              <Field label="Entity type">
                <select
                  className={inputClass}
                  value={form.entity_type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, entity_type: e.target.value }))
                  }
                >
                  {ENTITY_TYPES.map((t) => (
                    <option key={t.value || "none"} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description">
                <textarea
                  className={`${inputClass} min-h-[72px]`}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </Field>
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button type="submit" className={btnPrimary} disabled={saving}>
                  {saving ? "Saving…" : "Save page"}
                </button>
                <button type="button" className={btnSecondary} onClick={togglePageStatus}>
                  {page.status ? "Disable page" : "Enable page"}
                </button>
                <button type="button" className={btnDanger} onClick={onDeletePage}>
                  Delete page
                </button>
              </div>
            </form>
          </CmsPanel>
        ) : null}
          </>
        ) : null}

        {pageTab === "mapped" ? (
        <CmsPanel
          title="Sections on this page"
          actions={
            <span className="text-xs text-slate-500">
              {placements.length} placement{placements.length === 1 ? "" : "s"} · drag
              order via ↑ ↓
            </span>
          }
        >
          {!placements.length ? (
            <EmptyState message='No sections tagged yet. Use the "Add new Sections" tab.' />
          ) : (
            <ul className="m-0 list-none space-y-3 p-0">
              {placements.map((tag, index) => (
                <li
                  key={tag.id}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <SectionPreviewThumb
                        src={
                          tag.section_preview_img ||
                          allSections.find((s) => s.key === tag.section_key)
                            ?.section_preview_img
                        }
                        alt={tag.section_key}
                        className="size-14"
                      />
                      <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          #{tag.sort_order}
                        </span>
                        <Link
                          href={`/cms/pages-content-sections/${tag.section_key}`}
                          className="font-semibold text-slate-900 no-underline hover:text-brand dark:text-white"
                        >
                          {tag.section_key}
                        </Link>
                        <StatusBadge active={tag.status} />
                        {tag.content_scope &&
                        tag.content_scope !== "page" &&
                        tag.content_scope !== "cascading" ? (
                          <StatusBadge
                            active
                            labelOn={`Scope: ${tag.content_scope}`}
                            labelOff={`Scope: ${tag.content_scope}`}
                          />
                        ) : null}
                        {tag.section_global_status === false ? (
                          <StatusBadge active={false} labelOff="Global off" />
                        ) : null}
                      </div>
                      <p className="mt-1 mb-0 text-sm text-slate-600 dark:text-slate-300">
                        {tag.section_title || tag.section_name || "— inherits section defaults"}
                      </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        className={btnSecondary}
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={btnSecondary}
                        disabled={index === placements.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <Link
                        href={`/cms/pages/${pageKey}/placements/${tag.id}`}
                        className={btnSecondary}
                      >
                        Template content
                      </Link>
                      <button
                        type="button"
                        className={btnSecondary}
                        onClick={() =>
                          editingId === tag.id ? setEditingId(null) : startEdit(tag)
                        }
                      >
                        {editingId === tag.id ? "Close" : "Quick edit"}
                      </button>
                      <button
                        type="button"
                        className={btnSecondary}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag.status ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        className={btnDanger}
                        onClick={() => removeTag(tag)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {editingId === tag.id && editForm ? (
                    <form
                      onSubmit={saveEdit}
                      className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 dark:border-slate-900"
                    >
                      <Field label="Section title override">
                        <input
                          className={inputClass}
                          value={editForm.section_title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, section_title: e.target.value }))
                          }
                          placeholder="Inherit default"
                        />
                      </Field>
                      <Field label="Subtitle override">
                        <input
                          className={inputClass}
                          value={editForm.sub_title}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, sub_title: e.target.value }))
                          }
                        />
                      </Field>
                      <Field label="In-page nav title" hint="Sticky nav label">
                        <input
                          className={inputClass}
                          value={editForm.in_page_nav_title}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              in_page_nav_title: e.target.value,
                            }))
                          }
                          placeholder="Inherit default"
                        />
                      </Field>
                      <Field
                        label="Section image"
                        hint="Optional — only rendered if the section UI supports it"
                      >
                        <div className="space-y-2">
                          {editForm.section_img_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mediaUrl(editForm.section_img_url)}
                              alt=""
                              className="h-20 w-28 rounded-lg object-cover"
                            />
                          ) : null}
                          <input
                            className={inputClass}
                            value={editForm.section_img_url}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                section_img_url: e.target.value,
                              }))
                            }
                            placeholder="/uploads/… or https://…"
                          />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="block w-full text-xs"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              setSaving(true);
                              try {
                                const dataUrl = await new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result);
                                  reader.onerror = () =>
                                    reject(new Error("Could not read file"));
                                  reader.readAsDataURL(file);
                                });
                                const res = await uploadCmsImage(dataUrl, "sections");
                                setEditForm((f) => ({
                                  ...f,
                                  section_img_url: res.data?.url || "",
                                }));
                              } catch (err) {
                                setError(err);
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                        </div>
                      </Field>
                      <Field label="Background image" hint="URL or upload">
                        <div className="space-y-2">
                          {editForm.section_bg_img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mediaUrl(editForm.section_bg_img)}
                              alt=""
                              className="h-20 w-full rounded-lg object-cover"
                            />
                          ) : null}
                          <input
                            className={inputClass}
                            value={editForm.section_bg_img}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                section_bg_img: e.target.value,
                              }))
                            }
                            placeholder="/uploads/… or https://…"
                          />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="block w-full text-xs"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              setSaving(true);
                              try {
                                const dataUrl = await new Promise((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result);
                                  reader.onerror = () =>
                                    reject(new Error("Could not read file"));
                                  reader.readAsDataURL(file);
                                });
                                const res = await uploadCmsImage(dataUrl, "sections");
                                setEditForm((f) => ({
                                  ...f,
                                  section_bg_img: res.data?.url || "",
                                }));
                              } catch (err) {
                                setError(err);
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                        </div>
                      </Field>
                      <Field label="Sort order">
                        <input
                          type="number"
                          className={inputClass}
                          value={editForm.sort_order}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              sort_order: e.target.value,
                            }))
                          }
                        />
                      </Field>
                      <div className="flex items-end">
                        <button type="submit" className={btnPrimary} disabled={saving}>
                          Save placement
                        </button>
                      </div>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CmsPanel>
        ) : null}

        {pageTab === "add" ? (
        <CmsPanel title="Add section placement">
          <form onSubmit={addPlacement} className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Section"
              hint="Filter by category / scope / type, then pick a preview — same section can be added more than once"
              className="sm:col-span-2"
            >
              <div className="mb-3 space-y-2.5">
                <input
                  className={inputClass}
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Search by name or key…"
                />

                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                  <FilterGroup
                    title="Category"
                    search={addCategorySearch}
                    onSearch={setAddCategorySearch}
                    placeholder="Search Category"
                    options={categoryOptions}
                    value={addCategoryFilter}
                    onChange={setAddCategoryFilter}
                    maxHeightClass="max-h-40"
                  />
                </div>

                <FilterChipRow
                  label="Scope"
                  value={addScopeFilter}
                  onChange={setAddScopeFilter}
                  options={SCOPE_FILTERS.map((opt) => ({
                    ...opt,
                    count: addFilterCounts.scope[opt.value] ?? 0,
                  }))}
                />

                <FilterChipRow
                  label="Type"
                  value={addKindFilter}
                  onChange={setAddKindFilter}
                  activeClass="bg-ink text-white"
                  options={KIND_FILTERS.map((opt) => ({
                    ...opt,
                    count: addFilterCounts.kind[opt.value] ?? 0,
                  }))}
                />

                <FilterChipRow
                  label="On page"
                  value={addPlacedFilter}
                  onChange={setAddPlacedFilter}
                  activeClass="bg-teal-700 text-white"
                  options={PLACED_FILTERS.map((opt) => ({
                    ...opt,
                    count: addFilterCounts.placed[opt.value] ?? 0,
                  }))}
                />
              </div>

              {!filteredAddOptions.length ? (
                <EmptyState message="No sections match these filters." />
              ) : (
                <div className="max-h-[22rem] overflow-y-auto overscroll-contain rounded-lg border border-slate-200 p-2 dark:border-slate-800 sm:max-h-[28rem]">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {filteredAddOptions.map((s) => {
                      const selected = addForm.section_key === s.key;
                      const onPage = placedKeys.has(s.key);
                      return (
                        <div
                          key={s.key}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setAddForm((f) => ({ ...f, section_key: s.key }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setAddForm((f) => ({ ...f, section_key: s.key }));
                            }
                          }}
                          className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${
                            selected
                              ? "border-brand ring-2 ring-brand/30"
                              : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                          }`}
                        >
                          <SectionPreviewThumb
                            src={s.section_preview_img}
                            alt={s.name}
                            className="h-20 w-full"
                            rounded="rounded-none"
                          />
                          <div className="flex flex-wrap items-center gap-1 px-2 pt-1.5">
                            <ScopeBadge scope={s.content_scope} />
                            {onPage ? (
                              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                On page
                              </span>
                            ) : null}
                          </div>
                          <span className="truncate px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                            {s.name}
                          </span>
                          <span className="truncate px-2 pb-1.5 font-mono text-[10px] text-slate-400">
                            {s.key}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <p className="mt-2 mb-0 text-[11px] text-slate-500">
                Showing {filteredAddOptions.length} of {sectionOptions.length}
                {addForm.section_key
                  ? ` · selected: ${addForm.section_key}`
                  : ""}
              </p>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                className={inputClass}
                value={addForm.sort_order}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, sort_order: e.target.value }))
                }
              />
            </Field>
            <Field label="Title override">
              <input
                className={inputClass}
                value={addForm.section_title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, section_title: e.target.value }))
                }
                placeholder="Optional"
              />
            </Field>
            <Field label="Subtitle override">
              <input
                className={inputClass}
                value={addForm.sub_title}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, sub_title: e.target.value }))
                }
              />
            </Field>
            <Field label="In-page nav title">
              <input
                className={inputClass}
                value={addForm.in_page_nav_title}
                onChange={(e) =>
                  setAddForm((f) => ({
                    ...f,
                    in_page_nav_title: e.target.value,
                  }))
                }
                placeholder="Optional"
              />
            </Field>
            <Field
              label="Section image"
              hint="Optional — only rendered if the section UI supports it"
            >
              <div className="space-y-2">
                {addForm.section_img_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(addForm.section_img_url)}
                    alt=""
                    className="h-20 w-28 rounded-lg object-cover"
                  />
                ) : null}
                <input
                  className={inputClass}
                  value={addForm.section_img_url}
                  onChange={(e) =>
                    setAddForm((f) => ({
                      ...f,
                      section_img_url: e.target.value,
                    }))
                  }
                  placeholder="/uploads/… or https://…"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="block w-full text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    setSaving(true);
                    try {
                      const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () =>
                          reject(new Error("Could not read file"));
                        reader.readAsDataURL(file);
                      });
                      const res = await uploadCmsImage(dataUrl, "sections");
                      setAddForm((f) => ({
                        ...f,
                        section_img_url: res.data?.url || "",
                      }));
                    } catch (err) {
                      setError(err);
                    } finally {
                      setSaving(false);
                    }
                  }}
                />
              </div>
            </Field>
            <Field label="Background image" hint="Optional URL or upload">
              <div className="space-y-2 sm:col-span-2">
                {addForm.section_bg_img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(addForm.section_bg_img)}
                    alt=""
                    className="h-20 w-full rounded-lg object-cover"
                  />
                ) : null}
                <input
                  className={inputClass}
                  value={addForm.section_bg_img}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, section_bg_img: e.target.value }))
                  }
                  placeholder="/uploads/… or https://…"
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="block w-full text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    setSaving(true);
                    try {
                      const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = () =>
                          reject(new Error("Could not read file"));
                        reader.readAsDataURL(file);
                      });
                      const res = await uploadCmsImage(dataUrl, "sections");
                      setAddForm((f) => ({
                        ...f,
                        section_bg_img: res.data?.url || "",
                      }));
                    } catch (err) {
                      setError(err);
                    } finally {
                      setSaving(false);
                    }
                  }}
                />
              </div>
            </Field>
            <div className="sm:col-span-2">
              <button type="submit" className={btnPrimary} disabled={saving}>
                Add to page
              </button>
            </div>
          </form>
        </CmsPanel>
        ) : null}

        {pageTab === "preview" ? (
          <CmsPanel title="Page preview">
            <CmsPagePreviewStack
              emptyMessage='No sections mapped yet. Use the "Add new Sections" tab.'
              items={placements.map((tag) => ({
                id: tag.id,
                section_key: tag.section_key,
                sort_order: tag.sort_order,
                hidden: tag.status === false,
                preview:
                  tag.section_preview_img ||
                  allSections.find((s) => s.key === tag.section_key)
                    ?.section_preview_img ||
                  "",
              }))}
            />
          </CmsPanel>
        ) : null}
      </div>
    </div>
  );
}
