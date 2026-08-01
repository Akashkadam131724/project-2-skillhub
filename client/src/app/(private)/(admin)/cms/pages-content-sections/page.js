"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createSection,
  listPages,
  listSectionCategories,
  listSections,
  mediaUrl,
  setSectionStatus,
  updateSection,
} from "@/lib/api/cms-api";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  isKnownSectionKey,
} from "@/lib/sections/section-registry";
import {
  effectiveRenderKey,
  ensureSectionRenderKeySaved,
  variantRenderKeyForCreate,
} from "@/lib/sections/section-render-key";
import {
  CONTENT_SCOPES,
  contentScopeLabel,
  normalizeContentScope,
} from "@/lib/cms/content-scope";
import {
  FilterGroup,
  FilterChipRow,
  buildCategoryOptions,
  buildScopeOptions,
  sectionCategory,
  sectionScope,
  ScopeBadge,
} from "@/components/cms/sections/CmsSectionFilters";
import {
  CmsHeading,
  CmsPanel,
  StatusBadge,
  Field,
  ErrorBanner,
  EmptyState,
  SectionPreviewThumb,
  btnPrimary,
  btnSecondary,
  inputClass,
} from "@/components/cms/admin/CmsUi";

const SNAKE_KEY_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

function openVariantFromSection(section) {
  return {
    baseKey: section.key,
    scope: normalizeContentScope(section.content_scope),
    sectionTitle: section.section_title || section.name || "",
    navTitle: section.in_page_nav_title || section.name || "",
  };
}

const SHOW_SECTION_PREVIEWS_KEY = "cms-show-section-previews";
const SHOW_SECTION_FILTERS_KEY = "cms-show-section-filters";

function sectionPageKeys(section) {
  const keys = [];
  const seen = new Set();
  for (const tag of section.pages || []) {
    const key = String(tag.page_key || "").toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  return keys;
}

function CategoryBadge({ category, categories = [] }) {
  const label =
    categories.find((item) => item.key === category)?.name ||
    SECTION_CATEGORIES.find((item) => item.key === category)?.name ||
    "Uncategorized";
  return (
    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
      {label}
    </span>
  );
}

export default function CmsSectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [pickKey, setPickKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDevForm, setShowDevForm] = useState(false);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [variantBaseKey, setVariantBaseKey] = useState("");
  const [variantKey, setVariantKey] = useState("");
  const [variantScope, setVariantScope] = useState("page");
  const [variantSectionTitle, setVariantSectionTitle] = useState("");
  const [variantNavTitle, setVariantNavTitle] = useState("");
  const [variantCopyContent, setVariantCopyContent] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categorySearch, setCategorySearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [showSectionPreviews, setShowSectionPreviews] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    try {
      setShowSectionPreviews(
        localStorage.getItem(SHOW_SECTION_PREVIEWS_KEY) === "1"
      );
      const filtersStored = localStorage.getItem(SHOW_SECTION_FILTERS_KEY);
      if (filtersStored === "0") setShowFilters(false);
      else if (filtersStored === "1") setShowFilters(true);
    } catch {
      /* ignore */
    }
  }, []);

  function toggleShowSectionPreviews() {
    setShowSectionPreviews((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SHOW_SECTION_PREVIEWS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleShowFilters() {
    setShowFilters((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SHOW_SECTION_FILTERS_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }



  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [secRes, pageRes, catRes] = await Promise.all([
          listSections(),
          listPages(),
          listSectionCategories({ status: true }),
        ]);
        if (!alive) return;
        setSections(secRes.data || []);
        setPages(pageRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        if (alive) setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const existingKeys = useMemo(
    () => new Set(sections.map((s) => s.key)),
    [sections]
  );

  const availableToAdd = useMemo(
    () => SECTION_CATALOG.filter((s) => !existingKeys.has(s.key)),
    [existingKeys]
  );

  const pageByKey = useMemo(() => {
    const map = new Map();
    for (const page of pages) {
      map.set(page.key, page);
    }
    return map;
  }, [pages]);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(sections, categories),
    [sections, categories]
  );

  const scopeOptions = useMemo(
    () => buildScopeOptions(sections),
    [sections]
  );

  const variantBaseSection = useMemo(
    () => sections.find((s) => s.key === variantBaseKey) || null,
    [sections, variantBaseKey]
  );

  const sectionsForVariantBase = useMemo(
    () =>
      [...sections].sort((a, b) =>
        String(a.name || a.key).localeCompare(String(b.name || b.key))
      ),
    [sections]
  );

  function resetVariantForm() {
    setVariantBaseKey("");
    setVariantKey("");
    setVariantScope("page");
    setVariantSectionTitle("");
    setVariantNavTitle("");
    setVariantCopyContent(true);
  }

  function openVariantForm(section = null) {
    setShowDevForm(false);
    setShowVariantForm(true);
    setError(null);
    if (section) {
      const seed = openVariantFromSection(section);
      setVariantBaseKey(seed.baseKey);
      setVariantScope(seed.scope);
      setVariantSectionTitle(seed.sectionTitle);
      setVariantNavTitle(seed.navTitle);
      setVariantKey("");
    } else {
      resetVariantForm();
    }
  }

  function closeVariantForm() {
    setShowVariantForm(false);
    resetVariantForm();
  }

  useEffect(() => {
    if (!variantBaseSection || !showVariantForm) return;
    const seed = openVariantFromSection(variantBaseSection);
    setVariantScope(seed.scope);
    setVariantSectionTitle(seed.sectionTitle);
    setVariantNavTitle(seed.navTitle);
  }, [variantBaseKey, variantBaseSection, showVariantForm]);

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      if (categoryFilter !== "all" && sectionCategory(s) !== categoryFilter) {
        return false;
      }
      if (scopeFilter !== "all" && sectionScope(s) !== scopeFilter) {
        return false;
      }
      return true;
    });
  }, [sections, categoryFilter, scopeFilter]);

  const filtersActive =
    categoryFilter !== "all" || scopeFilter !== "all";

  async function onCreate(e) {
    e.preventDefault();
    if (!pickKey || !isKnownSectionKey(pickKey)) {
      setError({
        message: "Pick a section type from the list (maps to a component).",
      });
      return;
    }
    const meta = SECTION_CATALOG.find((s) => s.key === pickKey);
    setSaving(true);
    setError(null);
    try {
      const res = await createSection({
        key: pickKey,
        name: meta?.name || pickKey,
        section_title: meta?.name || pickKey,
        in_page_nav_title: meta?.name || pickKey,
        category_key: meta?.category || "",
        render_key: meta?.render_key || "",
        content_scope: meta?.content_scope || "page",
        status: true,
      });
      setPickKey("");
      setShowDevForm(false);
      router.push(`/cms/pages-content-sections/${res.data.key}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function onCreateVariant(e) {
    e.preventDefault();
    const key = variantKey.trim().toLowerCase();
    const sectionTitle = variantSectionTitle.trim();
    const navTitle = variantNavTitle.trim();

    if (!variantBaseSection) {
      setError({ message: "Pick an existing section to use as the template." });
      return;
    }
    if (!key || !SNAKE_KEY_RE.test(key)) {
      setError({
        message:
          "Section key is required and must be snake_case (letters, numbers, underscores).",
      });
      return;
    }
    if (existingKeys.has(key)) {
      setError({ message: `Section key "${key}" is already in use.` });
      return;
    }
    if (!sectionTitle) {
      setError({ message: "Section title is required." });
      return;
    }
    if (!navTitle) {
      setError({ message: "In-page nav label is required." });
      return;
    }

    const base = variantBaseSection;
    setSaving(true);
    setError(null);
    try {
      const { section: repairedBase, patched: basePatched } =
        await ensureSectionRenderKeySaved(base, updateSection);
      if (basePatched) {
        setSections((prev) =>
          prev.map((s) => (s.key === repairedBase.key ? repairedBase : s))
        );
      }

      const componentKey = effectiveRenderKey(repairedBase);
      const renderKey = variantRenderKeyForCreate(key, componentKey);

      if (!isKnownSectionKey(key, renderKey)) {
        setError({
          message:
            "The selected section has no registered UI component. Pick a different source section.",
        });
        setSaving(false);
        return;
      }

      const body = {
        key,
        name: sectionTitle,
        render_key: renderKey,
        content_scope: variantScope,
        category_key: sectionCategory(repairedBase),
        section_title: sectionTitle,
        in_page_nav_title: navTitle,
        status: true,
      };

      if (variantCopyContent) {
        if (repairedBase.sub_title) body.sub_title = repairedBase.sub_title;
        if (repairedBase.section_bg_img) body.section_bg_img = repairedBase.section_bg_img;
        if (repairedBase.section_bg_color) {
          body.section_bg_color = repairedBase.section_bg_color;
        }
        if (repairedBase.section_img_url) {
          body.section_img_url = repairedBase.section_img_url;
        }
        if (repairedBase.section_theme) body.section_theme = repairedBase.section_theme;
        if (repairedBase.section_preview_img) {
          body.section_preview_img = repairedBase.section_preview_img;
        }
        if (repairedBase.data && typeof repairedBase.data === "object") {
          body.data = JSON.parse(JSON.stringify(repairedBase.data));
        }
        if (Array.isArray(repairedBase.buttons) && repairedBase.buttons.length) {
          body.buttons = JSON.parse(JSON.stringify(repairedBase.buttons));
        }
        if (Array.isArray(repairedBase.items) && repairedBase.items.length) {
          body.items = JSON.parse(JSON.stringify(repairedBase.items));
        }
      }

      const res = await createSection(body);
      closeVariantForm();
      router.push(`/cms/pages-content-sections/${res.data.key}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <CmsHeading
        title="All content sections"
        subtitle="Reusable section types for page templates. Filter by category or content scope."
        actions={
          <>
            <Link href="/cms/section" className={btnSecondary}>
              Public previews
            </Link>
            <button
              type="button"
              onClick={toggleShowFilters}
              aria-pressed={showFilters}
              title={
                showFilters ? "Hide category filters" : "Show category filters"
              }
              className={`${btnSecondary} ${showFilters
                ? "!bg-brand !text-white hover:!bg-brand-hover"
                : ""
                }`}
            >
              {showFilters ? "Filters on" : "Filters off"}
            </button>
            <button
              type="button"
              onClick={toggleShowSectionPreviews}
              aria-pressed={showSectionPreviews}
              title={
                showSectionPreviews
                  ? "Showing preview images — click for table view"
                  : "Show section preview images"
              }
              className={`${btnSecondary} ${showSectionPreviews
                ? "!bg-brand !text-white hover:!bg-brand-hover"
                : ""
                }`}
            >
              {showSectionPreviews ? "Previews on" : "Previews off"}
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => {
                if (showDevForm) setShowDevForm(false);
                else {
                  setShowVariantForm(false);
                  resetVariantForm();
                  setShowDevForm(true);
                  setError(null);
                }
              }}
            >
              {showDevForm ? "Cancel" : "Add section type"}
            </button>
          </>
        }
      />

      <ErrorBanner error={error} />

      {showVariantForm ? (
        <CmsPanel title="New section from existing" className="mb-4">
          <p className="mt-0 mb-4 text-sm text-slate-600 dark:text-slate-400">
            Pick an existing section — UI and category are inherited automatically.
          </p>
          {sections.length ? (
            <form onSubmit={onCreateVariant} className="space-y-4">
              <Field
                label="Based on"
                hint="The UI component and defaults come from this section"
              >
                <select
                  className={inputClass}
                  value={variantBaseKey}
                  onChange={(e) => setVariantBaseKey(e.target.value)}
                  required
                >
                  <option value="">Select a section…</option>
                  {sectionsForVariantBase.map((section) => (
                    <option key={section.key} value={section.key}>
                      {section.name} ({section.key})
                    </option>
                  ))}
                </select>
              </Field>

              {variantBaseSection ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  <span>
                    UI:{" "}
                    <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                      {effectiveRenderKey(variantBaseSection)}
                    </code>
                  </span>
                  <CategoryBadge
                    category={sectionCategory(variantBaseSection)}
                    categories={categories}
                  />
                </div>
              ) : null}

              <Field
                label="New section key"
                hint="Unique snake_case ID — cannot be changed later"
              >
                <input
                  className={inputClass}
                  value={variantKey}
                  onChange={(e) => setVariantKey(e.target.value.toLowerCase())}
                  placeholder="e.g. odyssey_testimonials"
                  pattern="[a-z0-9]+(?:_[a-z0-9]+)*"
                  required
                />
              </Field>

              <Field label="Content scope">
                <select
                  className={inputClass}
                  value={variantScope}
                  onChange={(e) => setVariantScope(e.target.value)}
                  required
                >
                  {CONTENT_SCOPES.map((scope) => (
                    <option key={scope} value={scope}>
                      {contentScopeLabel(scope)}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Section title" hint="Default heading on the page">
                  <input
                    className={inputClass}
                    value={variantSectionTitle}
                    onChange={(e) => setVariantSectionTitle(e.target.value)}
                    placeholder="e.g. Odyssey testimonials"
                    maxLength={80}
                    required
                  />
                </Field>
                <Field label="In-page nav label" hint="Sticky nav link text">
                  <input
                    className={inputClass}
                    value={variantNavTitle}
                    onChange={(e) => setVariantNavTitle(e.target.value)}
                    placeholder="e.g. Testimonials"
                    maxLength={80}
                    required
                  />
                </Field>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={variantCopyContent}
                  onChange={(e) => setVariantCopyContent(e.target.checked)}
                />
                <span>
                  Copy default content from source (title fields, items, buttons,
                  images, and data)
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={closeVariantForm}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={btnPrimary}
                  disabled={
                    saving ||
                    !variantBaseKey ||
                    !variantKey ||
                    !variantSectionTitle ||
                    !variantNavTitle
                  }
                >
                  {saving ? "Creating…" : "Create section"}
                </button>
              </div>
            </form>
          ) : (
            <EmptyState message='No sections yet. Use "Add section type" to register a component first.' />
          )}
        </CmsPanel>
      ) : null}

      {showDevForm ? (
        <CmsPanel title="Add section type (developer)" className="mb-4">
          <p className="mt-0 mb-4 text-sm text-slate-600 dark:text-slate-400">
            Register a new React component from{" "}
            <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
              section-registry.js
            </code>
            .
          </p>
          {availableToAdd.length ? (
            <form onSubmit={onCreate} className="space-y-4">
              <Field
                label="Component type"
                hint="Key is locked to the React component — cannot be renamed later"
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {availableToAdd.map((s) => {
                    const selected = pickKey === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => setPickKey(s.key)}
                        className={`rounded-lg border px-3 py-3 text-left transition ${selected
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                          }`}
                      >
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                          {s.name}
                        </span>
                        <span className="mt-0.5 block font-mono text-[11px] text-slate-400">
                          {s.key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <button
                type="submit"
                className={btnPrimary}
                disabled={saving || !pickKey}
              >
                {saving ? "Adding…" : "Add section"}
              </button>
            </form>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <p className="m-0 font-medium text-slate-800 dark:text-slate-100">
                All registered section types are already added.
              </p>
              <p className="mt-1 mb-0 text-xs text-slate-500">
                To create a new type, add a React component and register its key
                in{" "}
                <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                  section-registry.js
                </code>
                , then return here to add it.
              </p>
            </div>
          )}
        </CmsPanel>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {showFilters ? (
          <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-64">
            <CmsPanel title="Filters">
              <div className="space-y-4">
                <FilterGroup
                  title="Category"
                  search={categorySearch}
                  onSearch={setCategorySearch}
                  placeholder="Search Category"
                  options={categoryOptions}
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                />

                <FilterChipRow
                  label="Scope"
                  value={scopeFilter}
                  onChange={setScopeFilter}
                  options={scopeOptions}
                />

                {filtersActive ? (
                  <button
                    type="button"
                    className={`${btnSecondary} w-full text-xs`}
                    onClick={() => {
                      setCategoryFilter("all");
                      setScopeFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            </CmsPanel>
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          <CmsPanel title="All content sections">
            {filtersActive ? (
              <p className="mb-3 mt-0 text-xs text-slate-500">
                Showing {filteredSections.length} section
                {filteredSections.length === 1 ? "" : "s"}
                {categoryFilter !== "all"
                  ? ` · category: ${SECTION_CATEGORIES.find(
                    (category) => category.key === categoryFilter
                  )?.name || "Uncategorized"
                  }`
                  : ""}
                {scopeFilter !== "all"
                  ? ` · scope: ${contentScopeLabel(scopeFilter)}`
                  : ""}
              </p>
            ) : null}

            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : !sections.length ? (
              <EmptyState message='No sections yet. Use "Add section type" to register a component first, then use "New from this" on a row to duplicate.' />
            ) : !filteredSections.length ? (
              <EmptyState message="No sections match these filters. Clear filters and try again." />
            ) : showSectionPreviews ? (
              <div className="space-y-6">
                {filteredSections.map((section) => {
                  const previewUrl = mediaUrl(section.section_preview_img);
                  return (
                    <div
                      key={section.key}
                      className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                        <div className="min-w-0">
                          <Link
                            href={`/cms/pages-content-sections/${section.key}`}
                            className="font-semibold text-slate-900 no-underline hover:text-brand dark:text-white"
                          >
                            {section.name}
                          </Link>
                          <p className="m-0 font-mono text-[11px] text-slate-500">
                            {section.key}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ScopeBadge scope={section.content_scope} />
                          <StatusBadge active={section.status} />
                          <Link
                            href={`/cms/pages-content-sections/${section.key}`}
                            className={btnSecondary}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className={btnPrimary}
                            onClick={() => openVariantForm(section)}
                          >
                            New from this
                          </button>
                        </div>
                      </div>
                      {previewUrl ? (
                        <SectionPreviewThumb
                          src={section.section_preview_img}
                          alt={section.name}
                          natural
                          rounded="rounded-none"
                        />
                      ) : (
                        <p className="m-0 px-4 py-10 text-center text-sm text-slate-500">
                          No preview image
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-slate-800">
                      <th className="py-2 pr-3 font-semibold">Preview</th>
                      <th className="py-2 pr-3 font-semibold">Name</th>
                      <th className="py-2 pr-3 font-semibold">Component key</th>
                      <th className="py-2 pr-3 font-semibold">Category</th>
                      <th className="py-2 pr-3 font-semibold">Used on</th>
                      <th className="py-2 pr-3 font-semibold">Scope</th>
                      <th className="py-2 pr-3 font-semibold">Status</th>
                      <th className="py-2 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSections.map((section) => {
                      const usedOn = sectionPageKeys(section);
                      const category = sectionCategory(section);
                      return (
                        <tr
                          key={section.key}
                          className="border-b border-slate-100 dark:border-slate-900"
                        >
                          <td className="py-3 pr-3">
                            <SectionPreviewThumb
                              src={section.section_preview_img}
                              alt={section.name}
                              className="h-14 w-20"
                            />
                          </td>
                          <td className="py-3 pr-3">
                            <Link
                              href={`/cms/pages-content-sections/${section.key}`}
                              className="font-semibold text-slate-900 no-underline hover:text-brand dark:text-white"
                            >
                              {section.name}
                            </Link>
                            {section.section_title ? (
                              <p className="mt-0.5 mb-0 text-xs text-slate-500">
                                {section.section_title}
                              </p>
                            ) : null}
                          </td>
                          <td className="py-3 pr-3 font-mono text-xs text-slate-500">
                            {section.key}
                            {section.render_key ? (
                              <span className="mt-0.5 block text-slate-400">
                                → {section.render_key}
                              </span>
                            ) : null}
                            {!isKnownSectionKey(section.key, section.render_key) ? (
                              <span className="mt-0.5 block text-amber-600">
                                no component
                              </span>
                            ) : null}
                          </td>
                          <td className="py-3 pr-3">
                            <button
                              type="button"
                              onClick={() => setCategoryFilter(category)}
                              title={`Filter by ${category}`}
                            >
                              <CategoryBadge
                                category={category}
                                categories={categories}
                              />
                            </button>
                          </td>
                          <td className="py-3 pr-3">
                            {usedOn.length ? (
                              <div className="flex flex-wrap gap-1">
                                {usedOn.map((key) => {
                                  const page = pageByKey.get(key);
                                  return (
                                    <Link
                                      key={key}
                                      href={`/cms/pages/${key}`}
                                      title={page?.name || key}
                                      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 no-underline hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                    >
                                      {key}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                Not placed
                              </span>
                            )}
                          </td>
                          <td className="py-3 pr-3">
                            <button
                              type="button"
                              onClick={() => setScopeFilter(sectionScope(section))}
                              title={`Filter by ${contentScopeLabel(section.content_scope)} scope`}
                            >
                              <ScopeBadge scope={section.content_scope} />
                            </button>
                          </td>
                          <td className="py-3 pr-3">
                            <StatusBadge active={section.status} />
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/cms/pages-content-sections/${section.key}`}
                                className={btnSecondary}
                              >
                                Edit Section
                              </Link>
                              <button
                                type="button"
                                className={btnPrimary}
                                onClick={() => openVariantForm(section)}
                              >
                                New from this
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CmsPanel>
        </div>
      </div>
    </div>
  );
}
