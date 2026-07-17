"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createSection,
  listPages,
  listSections,
  mediaUrl,
  setSectionStatus,
} from "@/lib/cms-api";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  isKnownSectionKey,
} from "@/lib/section-registry";
import { contentScopeLabel } from "@/lib/content-scope";
import {
  FilterGroup,
  FilterChipRow,
  buildCategoryOptions,
  buildScopeOptions,
  sectionCategory,
  sectionScope,
  ScopeBadge,
} from "@/components/cms/CmsSectionFilters";
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
} from "@/components/cms/CmsUi";

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

function CategoryBadge({ category }) {
  const label =
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
  const [pages, setPages] = useState([]);
  const [pickKey, setPickKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  async function load() {
    setError(null);
    try {
      const [secRes, pageRes] = await Promise.all([
        listSections(),
        listPages(),
      ]);
      setSections(secRes.data || []);
      setPages(pageRes.data || []);
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
        const [secRes, pageRes] = await Promise.all([
          listSections(),
          listPages(),
        ]);
        if (!alive) return;
        setSections(secRes.data || []);
        setPages(pageRes.data || []);
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
    () => buildCategoryOptions(sections),
    [sections]
  );

  const scopeOptions = useMemo(
    () => buildScopeOptions(sections),
    [sections]
  );

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
        category: meta?.category || "",
        tags: meta?.tags || [],
        render_key: meta?.render_key || "",
        content_scope: meta?.content_scope || "page",
        status: true,
      });
      setPickKey("");
      setShowForm(false);
      router.push(`/cms/pages-content-sections/${res.data.key}`);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(section) {
    try {
      await setSectionStatus(section.key, !section.status);
      await load();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <div>
      <CmsHeading
        title="All content sections"
        subtitle="Reusable section types for page templates. Filter by category or content scope."
        actions={
          <>
            <button
              type="button"
              onClick={toggleShowFilters}
              aria-pressed={showFilters}
              title={
                showFilters ? "Hide category filters" : "Show category filters"
              }
              className={`${btnSecondary} ${
                showFilters
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
              className={`${btnSecondary} ${
                showSectionPreviews
                  ? "!bg-brand !text-white hover:!bg-brand-hover"
                  : ""
              }`}
            >
              {showSectionPreviews ? "Previews on" : "Previews off"}
            </button>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "Cancel" : "Add section"}
            </button>
          </>
        }
      />

      <ErrorBanner error={error} />

      {showForm ? (
        <CmsPanel title="Add section" className="mb-4">
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
                        className={`rounded-lg border px-3 py-3 text-left transition ${
                          selected
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
                  ? ` · category: ${
                      SECTION_CATEGORIES.find(
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
              <EmptyState message='No sections yet. Click "Add section" to register a component type.' />
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
                              <CategoryBadge category={category} />
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
                                Edit content
                              </Link>
                              {usedOn[0] ? (
                                <Link
                                  href={`/cms/pages/${usedOn[0]}`}
                                  className={btnSecondary}
                                >
                                  Open template
                                </Link>
                              ) : null}
                              <button
                                type="button"
                                className={btnSecondary}
                                onClick={() => toggleStatus(section)}
                              >
                                {section.status ? "Disable" : "Enable"}
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
