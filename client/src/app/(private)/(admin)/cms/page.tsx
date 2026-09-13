"use client";

import { useState } from "react";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  btnPrimary,
} from "@/components/cms/admin/CmsUi";

export default function CmsOverviewPage() {
  const [navBusy, setNavBusy] = useState(false);
  const [navMsg, setNavMsg] = useState<string | null>(null);
  const [navError, setNavError] = useState<unknown>(null);

  async function refreshNavigation() {
    setNavBusy(true);
    setNavMsg(null);
    setNavError(null);
    try {
      const res = await fetch("/api/publish/navigation", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Failed to refresh navigation");
      }
      setNavMsg("Navigation cache refreshed — header will reload on next visit.");
    } catch (err) {
      setNavError(err);
    } finally {
      setNavBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <CmsHeading
        title="SkillHub CMS"
        subtitle="Entity pages always load fresh (SSR). Only the site header navigation is cached — refresh it here after nav changes."
      />

      <CmsPanel title="Site navigation">
        <p className="m-0 mb-4 text-sm text-slate-600 dark:text-slate-300">
          The header menu is cached (ISR). After you change navigation on the
          nav service, refresh it here so the site picks up the new tree.
        </p>
        {navError ? <ErrorBanner error={navError} /> : null}
        {navMsg ? (
          <p className="mb-3 text-sm text-emerald-700 dark:text-emerald-400">
            {navMsg}
          </p>
        ) : null}
        <button
          type="button"
          disabled={navBusy}
          onClick={refreshNavigation}
          className={btnPrimary}
        >
          {navBusy ? "Refreshing…" : "Refresh navigation cache"}
        </button>
      </CmsPanel>
    </div>
  );
}
