"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CmsThemeEditor from "@/components/cms/theme/CmsThemeEditor";
import {
  emptyPageTheme,
  mergeTheme,
  normalizePageTheme,
  surfacePatternLabel,
  themeForApiSave,
} from "@/lib/theme";
import { getPage, getSiteTheme, updatePage } from "@/lib/api/cms-api";
import { useCmsLiveEdit } from "@/context/CmsLiveEditContext";
import type { PageThemeDraft } from "@/components/cms/theme/types";
import type { ThemeSettingsTabProps } from "../../types";

/** Template theme editor — loads site/page theme only when this tab mounts. */
export default function ThemeSettingsTab({
  busy = false,
  onError,
}: ThemeSettingsTabProps) {
  const { pageKey, pageTheme, setPageTheme } = useCmsLiveEdit();
  const [templateThemeDraft, setTemplateThemeDraft] =
    useState<PageThemeDraft>(emptyPageTheme());
  const [siteThemeDoc, setSiteThemeDoc] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const templateThemeDirtyRef = useRef(false);
  const isBusy = busy || saving;

  async function loadThemes(
    pageDoc: Record<string, unknown> | null | undefined,
    { force = false }: { force?: boolean } = {}
  ) {
    const siteRes = await getSiteTheme().catch(() => null);
    const site = siteRes?.data || null;
    const tpl = normalizePageTheme(pageDoc?.theme);
    setSiteThemeDoc(site);
    if (force || !templateThemeDirtyRef.current) {
      setTemplateThemeDraft(tpl);
    }
  }

  useEffect(() => {
    if (!pageKey) return;
    let alive = true;
    (async () => {
      try {
        const pageRes = await getPage(pageKey).catch(() => null);
        if (!alive) return;
        await loadThemes(pageRes?.data);
      } catch {
        /* keep parent theme */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once when tab mounts
  }, [pageKey]);

  useEffect(() => {
    setPageTheme(mergeTheme(siteThemeDoc, templateThemeDraft));
  }, [siteThemeDoc, templateThemeDraft, setPageTheme]);

  function handleThemeChange(next: PageThemeDraft) {
    templateThemeDirtyRef.current = true;
    setTemplateThemeDraft(next);
  }

  async function saveTemplateTheme() {
    setSaving(true);
    onError?.(null);
    try {
      await updatePage(pageKey, {
        theme: themeForApiSave(templateThemeDraft),
      });
      templateThemeDirtyRef.current = false;
      const pageRes = await getPage(pageKey).catch(() => null);
      await loadThemes(pageRes?.data, { force: true });
    } catch (err) {
      onError?.((err as Error).message || "Could not save template theme");
    } finally {
      setSaving(false);
    }
  }

  async function clearTemplateTheme() {
    setSaving(true);
    onError?.(null);
    try {
      const cleared = emptyPageTheme();
      templateThemeDirtyRef.current = false;
      setTemplateThemeDraft(cleared);
      await updatePage(pageKey, {
        theme: themeForApiSave(cleared),
      });
      const pageRes = await getPage(pageKey).catch(() => null);
      await loadThemes(pageRes?.data, { force: true });
    } catch (err) {
      onError?.((err as Error).message || "Could not clear template theme");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div>
        <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          Template theme · {pageKey}
        </p>
        <p className="mt-1 mb-0 text-xs text-slate-500">
          Overrides for every{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {pageKey}
          </span>{" "}
          page. Empty fields inherit the site theme. Section bands set to Inherit
          follow surface mode below.
        </p>
      </div>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-slate-500">Resolved surface</dt>
        <dd className="m-0 font-semibold text-slate-800 dark:text-slate-100">
          {surfacePatternLabel(pageTheme) || "Repeating · White → Grey"}
        </dd>
      </dl>
      <CmsThemeEditor
        mode="page"
        inheritFrom="site"
        inheritedTheme={mergeTheme(siteThemeDoc)}
        value={templateThemeDraft}
        onChange={handleThemeChange}
        onSave={saveTemplateTheme}
        saving={isBusy}
        saveLabel={`Save ${pageKey} template theme`}
      />
      <button
        type="button"
        disabled={isBusy}
        onClick={clearTemplateTheme}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        Use site theme only (clear template overrides)
      </button>
      <Link
        href="/cms/site-theme"
        className="inline-block text-[11px] font-semibold text-brand no-underline hover:underline"
      >
        Edit site theme + all templates →
      </Link>
    </div>
  );
}
