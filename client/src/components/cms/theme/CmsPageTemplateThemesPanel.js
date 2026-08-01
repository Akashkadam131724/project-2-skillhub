"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getPage, listPages, updatePage } from "@/lib/api/cms-api";
import {
  emptyPageTheme,
  mergeTheme,
  normalizePageTheme,
  surfacePatternLabel,
  themeForApiSave,
} from "@/lib/theme";
import CmsThemeEditor from "@/components/cms/theme/CmsThemeEditor";
import CmsOverrideGuide from "@/components/cms/theme/CmsOverrideGuide";
import { btnSecondary } from "@/components/cms/admin/CmsUi";

function hasTemplateOverrides(theme) {
  const t = normalizePageTheme(theme);
  return Object.entries(t).some(([key, v]) => {
    if (v === null || v === undefined) return false;
    if (key === "surface_pattern" && typeof v === "object") return true;
    return String(v).trim() !== "";
  });
}

function surfaceLabel(theme, siteTheme) {
  const resolved = mergeTheme(siteTheme, theme);
  return surfacePatternLabel(resolved);
}

/**
 * Edit page template theme overrides for every CMS page template.
 */
export default function CmsPageTemplateThemesPanel({ siteTheme }) {
  const [pages, setPages] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [error, setError] = useState(null);
  const [savedKey, setSavedKey] = useState(null);
  const dirtyKeysRef = useRef(new Set());

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await listPages();
      const rows = res.data || [];
      setPages(rows);
      const serverDrafts = {};
      await Promise.all(
        rows.map(async (row) => {
          try {
            const detail = await getPage(row.key);
            serverDrafts[row.key] = normalizePageTheme(detail?.data?.theme);
          } catch {
            serverDrafts[row.key] = emptyPageTheme();
          }
        })
      );
      setDrafts((prev) => {
        const merged = { ...serverDrafts };
        for (const key of dirtyKeysRef.current) {
          if (prev[key]) merged[key] = prev[key];
        }
        return merged;
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const overrideCount = useMemo(
    () => pages.filter((p) => hasTemplateOverrides(drafts[p.key])).length,
    [pages, drafts]
  );

  async function saveTemplate(key) {
    setSavingKey(key);
    setError(null);
    setSavedKey(null);
    try {
      const res = await updatePage(key, {
        theme: themeForApiSave(drafts[key] || emptyPageTheme()),
      });
      dirtyKeysRef.current.delete(key);
      const saved = normalizePageTheme(res?.data?.theme);
      setDrafts((d) => ({ ...d, [key]: saved }));
      setSavedKey(key);
    } catch (err) {
      setError(err);
    } finally {
      setSavingKey(null);
    }
  }

  async function clearTemplate(key) {
    const cleared = emptyPageTheme();
    setDrafts((d) => ({ ...d, [key]: cleared }));
    setSavingKey(key);
    setError(null);
    try {
      const res = await updatePage(key, { theme: themeForApiSave(cleared) });
      dirtyKeysRef.current.delete(key);
      const saved = normalizePageTheme(res?.data?.theme);
      setDrafts((d) => ({ ...d, [key]: saved }));
      setSavedKey(key);
    } catch (err) {
      setError(err);
    } finally {
      setSavingKey(null);
    }
  }

  async function clearAllTemplates() {
    if (
      !confirm(
        "Clear template theme overrides on every page? All templates will inherit the site theme."
      )
    ) {
      return;
    }
    setClearingAll(true);
    setError(null);
    try {
      const cleared = emptyPageTheme();
      await Promise.all(
        pages.map((p) => updatePage(p.key, { theme: themeForApiSave(cleared) }))
      );
      dirtyKeysRef.current.clear();
      setDrafts(
        Object.fromEntries(pages.map((p) => [p.key, { ...cleared }]))
      );
      setSavedKey("__all__");
    } catch (err) {
      setError(err);
    } finally {
      setClearingAll(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading page templates…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="m-0 max-w-2xl text-xs text-slate-500">
          Optional overrides per page template (home, course, product, …). Empty
          fields inherit the{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            site theme
          </span>
          . Applies to every live page using that template.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CmsOverrideGuide variant="drawer-button" />
          <button
            type="button"
            className={btnSecondary}
            disabled={clearingAll || !pages.length}
            onClick={clearAllTemplates}
          >
            {clearingAll ? "Clearing…" : "Clear all template overrides"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="m-0 text-xs text-rose-600 dark:text-rose-400">
          {error.message || "Could not save template theme"}
        </p>
      ) : null}

      {savedKey ? (
        <p className="m-0 text-xs text-emerald-700 dark:text-emerald-400">
          {savedKey === "__all__"
            ? "All template overrides cleared."
            : `Template “${savedKey}” theme saved.`}
        </p>
      ) : null}

      <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        {overrideCount} of {pages.length} templates with overrides
      </p>

      <div className="space-y-2">
        {pages.map((page) => {
          const key = page.key;
          const isOpen = openKey === key;
          const draft = drafts[key] || emptyPageTheme();
          const hasOverrides = hasTemplateOverrides(draft);
          return (
            <div
              key={key}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                className="flex w-full items-center justify-between gap-3 bg-slate-50/80 px-3 py-2.5 text-left transition hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {page.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500">
                    <code className="text-[10px]">{key}</code>
                    {page.entity_type ? ` · ${page.entity_type}` : ""}
                    {" · "}
                    {surfaceLabel(draft, siteTheme)}
                    {hasOverrides ? " · overrides" : " · inherits site"}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-slate-200 p-3 dark:border-slate-800">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Link
                      href={`/cms/pages/${key}`}
                      className="text-[11px] font-semibold text-brand no-underline hover:underline"
                    >
                      Manage sections →
                    </Link>
                  </div>
                  <CmsThemeEditor
                    mode="page"
                    inheritFrom="site"
                    inheritedTheme={mergeTheme(siteTheme)}
                    value={draft}
                    onChange={(next) => {
                      dirtyKeysRef.current.add(key);
                      setDrafts((d) => ({ ...d, [key]: next }));
                    }}
                    onSave={() => saveTemplate(key)}
                    saving={savingKey === key}
                    saveLabel={`Save ${key} template theme`}
                  />
                  <button
                    type="button"
                    disabled={savingKey === key}
                    onClick={() => clearTemplate(key)}
                    className={`${btnSecondary} mt-3 w-full text-xs`}
                  >
                    Use site theme only (clear {key} overrides)
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
