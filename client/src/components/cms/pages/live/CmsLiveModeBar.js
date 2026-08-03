"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SettingsIcon from "@/components/icons/SettingsIcon";
import { exitCmsLiveEdit } from "@/lib/cms/cms-edit-routes";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";
import CmsLivePageSettingsDrawer from "@/components/cms/pages/live/CmsLivePageSettingsDrawer";

/** Fixed emerald CMS bar + page settings drawer. */
export default function CmsLiveModeBar() {
  const router = useRouter();
  const { entityLabel, publicHref } = useCmsLiveEdit();
  const { fieldDrawerOpen, closeFieldEdit } = useCmsLivePagePlacements();
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (fieldDrawerOpen) setPanelOpen(false);
  }, [fieldDrawerOpen]);

  function openPanel() {
    closeFieldEdit();
    setPanelOpen(true);
  }

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-emerald-200/80 bg-emerald-50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold text-emerald-950 dark:text-emerald-50">
              CMS mode
              {entityLabel ? (
                <span className="font-normal text-emerald-800/80 dark:text-emerald-200/80">
                  {" "}
                  · {entityLabel}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 mb-0 text-[11px] text-emerald-800/70 dark:text-emerald-200/70">
              Edits save live · use ⋮ on each section to edit fields
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {publicHref ? (
              <Link
                href={publicHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-emerald-300/80 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 no-underline hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              >
                View public page
              </Link>
            ) : null}
            <Link
              href="/cms"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-900 no-underline hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={openPanel}
              className="inline-flex size-9 items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              aria-label="Open page settings"
              title="Page settings"
            >
              <SettingsIcon />
            </button>
            <button
              type="button"
              onClick={() => exitCmsLiveEdit(router, publicHref)}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      <CmsLivePageSettingsDrawer
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
      />
    </>
  );
}
