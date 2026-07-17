"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSiteTheme,
  updateSiteTheme,
} from "@/lib/cms-api";
import { defaultSiteTheme } from "@/lib/theme";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  btnSecondary,
} from "@/components/cms/CmsUi";
import CmsThemeEditor from "@/components/cms/CmsThemeEditor";
import PageThemeShell from "@/components/cms/PageThemeShell";

export default function CmsSiteThemePage() {
  const [theme, setTheme] = useState(defaultSiteTheme());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedMsg, setSavedMsg] = useState(null);

  async function load() {
    setError(null);
    try {
      const res = await getSiteTheme();
      setTheme({ ...defaultSiteTheme(), ...(res.data || {}) });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setSavedMsg(null);
    try {
      const res = await updateSiteTheme(theme);
      setTheme({ ...defaultSiteTheme(), ...(res.data || {}) });
      setSavedMsg("Site theme saved. Live pages pick it up on next load.");
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading site theme…</p>;
  }

  return (
    <div className="space-y-6">
      <CmsHeading
        title="Site theme"
        subtitle="Global look for the whole website. Page templates can override any field."
        actions={
          <Link href="/cms/pages" className={btnSecondary}>
            Page templates
          </Link>
        }
      />

      <ErrorBanner error={error} />
      {savedMsg ? (
        <p className="m-0 text-sm text-emerald-700 dark:text-emerald-400">
          {savedMsg}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <CmsPanel title="Global defaults">
          <CmsThemeEditor
            mode="site"
            value={theme}
            onChange={setTheme}
            onSave={save}
            saving={saving}
            saveLabel="Save site theme"
          />
        </CmsPanel>

        <CmsPanel title="Preview">
          <PageThemeShell theme={theme} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-0">
              <div className="bg-white px-4 py-6 dark:bg-slate-950">
                <p className="m-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Light surface
                </p>
                <p className="mt-2 mb-0 text-lg font-bold text-ink">
                  Brand & ink sample
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Primary button
                </button>
              </div>
              <div className="bg-slate-100 px-4 py-6 dark:bg-slate-900">
                <p className="m-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Muted surface
                </p>
                <p className="mt-2 mb-0 text-sm text-slate-600 dark:text-slate-300">
                  Alternating section band
                </p>
              </div>
              <div className="px-4 py-6">
                <p className="m-0 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  Transparent surface
                </p>
                <p className="mt-2 mb-0 text-sm text-slate-600 dark:text-slate-300">
                  No section bg — page background shows through
                </p>
              </div>
              <div className="bg-ink px-4 py-6 text-white">
                <p className="m-0 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  Dark / ink
                </p>
                <p className="mt-2 mb-0 text-sm text-white/90">
                  Used when surface mode is dark
                </p>
              </div>
            </div>
          </PageThemeShell>
        </CmsPanel>
      </div>
    </div>
  );
}
