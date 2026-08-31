"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Drawer from "@/components/ui/Drawer";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";
import MappedSectionsTab from "@/components/cms/pages/live/settings-tabs/MappedSectionsTab";
import AddSectionTab from "@/components/cms/pages/live/settings-tabs/AddSectionTab";
import PreviewSectionsTab from "@/components/cms/pages/live/settings-tabs/PreviewSectionsTab";
import ThemeSettingsTab from "@/components/cms/pages/live/settings-tabs/ThemeSettingsTab";
import type { CmsLivePageSettingsDrawerProps } from "../types";

/**
 * Page settings drawer shell — each tab owns its own state/logic.
 */
export default function CmsLivePageSettingsDrawer({
  open,
  onClose,
}: CmsLivePageSettingsDrawerProps) {
  const router = useRouter();
  const { pageKey, entityLabel, publicHref } = useCmsLiveEdit();
  const {
    sections,
    fieldDrawerOpen,
    error: pageError,
    saving: busy,
  } = useCmsLivePagePlacements();
  const [panelTab, setPanelTab] = useState("mapped");
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || (!fieldDrawerOpen ? pageError : null);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      size="2xl"
      widthControl
      defaultWidthPct={75}
      title="Page settings"
    >
      <div className="space-y-4">
        <div>
          <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            {entityLabel || pageKey}
          </p>
          <p className="mt-0.5 mb-0 text-xs text-slate-500">
            Add, hide, remove page mappings · pencil on the page to edit fields
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
          {[
            {
              key: "mapped",
              label: `Mapped Sections (${sections.length})`,
            },
            { key: "add", label: "Add new Sections" },
            { key: "preview", label: "Preview" },
            { key: "theme", label: "Theme" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setLocalError(null);
                setPanelTab(tab.key);
              }}
              className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${panelTab === tab.key
                ? "bg-white text-brand shadow-sm dark:bg-slate-950 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {panelTab === "mapped" ? (
          <MappedSectionsTab onClose={onClose} />
        ) : null}

        {panelTab === "add" ? (
          <AddSectionTab onError={setLocalError} />
        ) : null}

        {panelTab === "preview" ? <PreviewSectionsTab /> : null}

        {panelTab === "theme" ? (
          <ThemeSettingsTab busy={busy} onError={setLocalError} />
        ) : null}
      </div>
    </Drawer>
  );
}
