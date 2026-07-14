"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createSection,
  listSections,
  setSectionStatus,
} from "@/lib/cms-api";
import { SECTION_CATALOG, isKnownSectionKey } from "@/lib/section-registry";
import {
  contentScopeLabel,
  normalizeContentScope,
} from "@/lib/content-scope";
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

const SCOPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "global", label: "Global" },
  { value: "template", label: "Template" },
  { value: "page", label: "Page" },
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
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

export default function CmsSectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState([]);
  const [pickKey, setPickKey] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scopeFilter, setScopeFilter] = useState("all");

  async function load() {
    setError(null);
    try {
      const res = await listSections();
      setSections(res.data || []);
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
        const res = await listSections();
        if (!alive) return;
        setSections(res.data || []);
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

  const scopeCounts = useMemo(() => {
    const counts = { all: sections.length, global: 0, template: 0, page: 0 };
    for (const section of sections) {
      const scope = normalizeContentScope(section.content_scope);
      counts[scope] += 1;
    }
    return counts;
  }, [sections]);

  const filteredSections = useMemo(() => {
    if (scopeFilter === "all") return sections;
    return sections.filter(
      (s) => normalizeContentScope(s.content_scope) === scopeFilter
    );
  }, [sections, scopeFilter]);

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
        subtitle="Reusable section types for page templates. Keys are fixed to frontend components."
        actions={
          <button
            type="button"
            className={btnPrimary}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Cancel" : "Add section"}
          </button>
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

      <CmsPanel title="All content sections">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Scope
          </span>
          {SCOPE_FILTERS.map((opt) => {
            const active = scopeFilter === opt.value;
            const count = scopeCounts[opt.value] ?? 0;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setScopeFilter(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {opt.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : !sections.length ? (
          <EmptyState message='No sections yet. Click "Add section" to register a component type.' />
        ) : !filteredSections.length ? (
          <EmptyState
            message={`No ${scopeFilter} sections. Try another scope filter.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-slate-800">
                  <th className="py-2 pr-3 font-semibold">Preview</th>
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Component key</th>
                  <th className="py-2 pr-3 font-semibold">Scope</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.map((section) => (
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
                      {!isKnownSectionKey(section.key) ? (
                        <span className="mt-0.5 block text-amber-600">
                          no component
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3">
                      <ScopeBadge scope={section.content_scope} />
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CmsPanel>
    </div>
  );
}
