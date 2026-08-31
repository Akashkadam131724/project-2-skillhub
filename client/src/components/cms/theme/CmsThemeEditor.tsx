"use client";

import { useState } from "react";
import { btnPrimary, btnSecondary } from "@/components/cms/admin/CmsUi";
import CmsOverrideGuide from "@/components/cms/theme/CmsOverrideGuide";
import {
  CmsThemeEditorProvider,
  useCmsThemeEditor,
} from "@/components/cms/theme/editor-tabs/CmsThemeEditorContext";
import ColorsTab from "@/components/cms/theme/editor-tabs/ColorsTab";
import SurfaceTab from "@/components/cms/theme/editor-tabs/SurfaceTab";
import BackgroundTab from "@/components/cms/theme/editor-tabs/BackgroundTab";
import type { CmsThemeEditorProps, CmsThemeEditorShellProps } from "./types";

const THEME_TABS = [
  { key: "colors", label: "Colors" },
  { key: "surface", label: "Surface" },
  { key: "background", label: "Background" },
];

function CmsThemeEditorShell({
  onSave,
  saving = false,
  saveLabel = "Save theme",
  hideGuide = false,
}: CmsThemeEditorShellProps) {
  const [activeTab, setActiveTab] = useState("colors");
  const { isPage, inheritNoun, inheritShort, clearToInherit } =
    useCmsThemeEditor();

  return (
    <div className="space-y-4">
      {isPage ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="m-0 text-xs text-slate-500">
            Leave fields empty to inherit the {inheritNoun}. Set a value to
            override only at this level.
          </p>
          <button type="button" className={btnSecondary} onClick={clearToInherit}>
            Reset to inherit {inheritShort}
          </button>
        </div>
      ) : (
        <p className="m-0 text-xs text-slate-500">
          Global defaults for the whole site. Page templates can override any
          field on the Themes screen.
        </p>
      )}

      {!hideGuide ? <CmsOverrideGuide variant="compact" /> : null}

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
        {THEME_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:text-xs ${
              activeTab === tab.key
                ? "bg-white text-brand shadow-sm dark:bg-slate-950 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "colors" ? <ColorsTab /> : null}
      {activeTab === "surface" ? <SurfaceTab /> : null}
      {activeTab === "background" ? <BackgroundTab /> : null}

      {onSave ? (
        <button
          type="button"
          className={btnPrimary}
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Saving…" : saveLabel}
        </button>
      ) : null}
    </div>
  );
}

/**
 * Shared theme editor for Site Theme (global), Page template overrides,
 * and entity page overrides.
 */
export default function CmsThemeEditor({
  mode = "site",
  inheritFrom = "site",
  inheritedTheme = null,
  value,
  onChange,
  onSave,
  saving = false,
  saveLabel = "Save theme",
  hideGuide = false,
}: CmsThemeEditorProps) {
  return (
    <CmsThemeEditorProvider
      mode={mode}
      inheritFrom={inheritFrom}
      inheritedTheme={inheritedTheme}
      value={value}
      onChange={onChange}
    >
      <CmsThemeEditorShell
        onSave={onSave}
        saving={saving}
        saveLabel={saveLabel}
        hideGuide={hideGuide}
      />
    </CmsThemeEditorProvider>
  );
}
