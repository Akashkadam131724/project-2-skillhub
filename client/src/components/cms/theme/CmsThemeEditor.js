"use client";

import { useState } from "react";
import {
  THEME_PRESETS,
  emptyPageTheme,
  defaultSiteTheme,
  applyPresetFill,
} from "@/lib/theme";
import { Field, inputClass, btnPrimary, btnSecondary } from "@/components/cms/admin/CmsUi";
import CmsBgColorPicker from "@/components/cms/editors/CmsBgColorPicker";
import CmsSurfacePatternEditor from "@/components/cms/theme/CmsSurfacePatternEditor";
import CmsOverrideGuide from "@/components/cms/theme/CmsOverrideGuide";

const THEME_TABS = [
  { key: "colors", label: "Colors" },
  { key: "surface", label: "Surface" },
  { key: "background", label: "Background" },
];

/**
 * Shared theme editor for Site Theme (global), Page template overrides,
 * and entity page overrides.
 *
 * @param {"site"|"page"} mode — page mode allows empty = inherit
 * @param {"site"|"template"} [inheritFrom] — what empty fields fall back to
 * @param {object} [inheritedTheme] — resolved parent theme for placeholders
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
}) {
  const [activeTab, setActiveTab] = useState("colors");
  const isPage = mode === "page";
  const theme = {
    ...(isPage ? emptyPageTheme() : defaultSiteTheme()),
    ...(value || {}),
  };
  const parent = applyPresetFill({
    ...defaultSiteTheme(),
    ...(inheritedTheme || {}),
  });

  const inheritNoun =
    inheritFrom === "template" ? "template theme" : "global site theme";
  const inheritShort =
    inheritFrom === "template" ? "template" : "site theme";

  function setField(key, next) {
    onChange?.({ ...theme, [key]: next });
  }

  function applyPreset(presetKey) {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    if (isPage) {
      // Preset only — leave colors empty so they follow this preset via merge,
      // and clearing the preset later truly inherits from the parent layer.
      onChange?.({
        ...theme,
        preset: presetKey,
        brand_primary: null,
        brand_hover: null,
        ink: null,
      });
      return;
    }
    onChange?.({
      ...theme,
      preset: presetKey,
      brand_primary: preset.brand_primary,
      brand_hover: preset.brand_hover,
      ink: preset.ink,
    });
  }

  function clearPresetToInherit() {
    setField("preset", null);
  }

  function clearToInherit() {
    onChange?.(emptyPageTheme());
  }

  function colorDisplay(key, fallback) {
    const raw = theme[key];
    if (/^#[0-9a-fA-F]{6}$/.test(String(raw || ""))) return raw;
    if (/^#[0-9a-fA-F]{6}$/.test(String(parent[key] || ""))) return parent[key];
    return fallback;
  }

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

      {activeTab === "colors" ? (
        <div className="space-y-4">
          <Field label="Color preset">
            <div className="flex flex-wrap gap-1.5">
              {isPage ? (
                <button
                  type="button"
                  onClick={clearPresetToInherit}
                  className={`rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                    !theme.preset
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-slate-200 text-slate-600 dark:border-slate-700"
                  }`}
                >
                  Inherit
                </button>
              ) : null}
              {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                const active = theme.preset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    title={preset.label}
                    onClick={() => applyPreset(key)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                      active
                        ? "border-brand ring-2 ring-brand/25"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: preset.brand_primary }}
                      aria-hidden
                    />
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: "brand_primary", label: "Brand", fallback: "#1b4de4" },
              { key: "brand_hover", label: "Brand hover", fallback: "#153fc0" },
              { key: "ink", label: "Ink", fallback: "#0b1f4d" },
            ].map(({ key, label, fallback }) => (
              <Field
                key={key}
                label={isPage ? `${label} (or inherit)` : label}
              >
                <input
                  type="color"
                  className="h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white dark:border-slate-700"
                  value={colorDisplay(key, fallback)}
                  onChange={(e) => setField(key, e.target.value)}
                />
                <input
                  className={`${inputClass} mt-1`}
                  value={theme[key] || ""}
                  placeholder={
                    isPage
                      ? parent[key]
                        ? `Inherit (${parent[key]})`
                        : "Inherit"
                      : fallback
                  }
                  onChange={(e) => setField(key, e.target.value || null)}
                />
                {isPage ? (
                  <button
                    type="button"
                    className="mt-1 text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
                    onClick={() => setField(key, null)}
                  >
                    Inherit {inheritShort}
                  </button>
                ) : null}
              </Field>
            ))}
          </div>
        </div>
      ) : null}

      {activeTab === "surface" ? (
        <Field
          label="Section band pattern"
          hint="Build any repeating sequence of band colors. Add hex colors or gradients — no code changes needed."
        >
          <CmsSurfacePatternEditor
            value={theme.surface_pattern}
            inheritedTheme={parent}
            isPage={isPage}
            onInherit={
              isPage
                ? () =>
                    onChange?.({
                      ...theme,
                      surface_mode: null,
                      surface_pattern: null,
                    })
                : undefined
            }
            onChange={(pattern) =>
              onChange?.({
                ...theme,
                surface_mode:
                  pattern.layout === "transparent" ? "transparent" : "custom",
                surface_pattern: pattern,
              })
            }
          />
        </Field>
      ) : null}

      {activeTab === "background" ? (
        <div className="space-y-4">
          <Field
            label="Page background color"
            hint="Shows behind transparent sections. Section-specific bg is unchanged."
          >
            <CmsBgColorPicker
              value={theme.page_bg_color || ""}
              onChange={(v) =>
                setField("page_bg_color", v || (isPage ? null : ""))
              }
              variant="theme"
              defaultLabel={isPage ? `Inherit ${inheritShort}` : "None"}
            />
            {isPage ? (
              <button
                type="button"
                className="mt-1 text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
                onClick={() => setField("page_bg_color", null)}
              >
                Inherit {inheritShort}
              </button>
            ) : null}
          </Field>

          <Field label="Page background image URL">
            <input
              className={inputClass}
              value={theme.page_bg_img || ""}
              placeholder={
                isPage
                  ? parent.page_bg_img
                    ? `Inherit (${parent.page_bg_img})`
                    : "Inherit / empty"
                  : "/uploads/… or https://…"
              }
              onChange={(e) =>
                setField("page_bg_img", e.target.value || (isPage ? null : ""))
              }
            />
            {isPage && theme.page_bg_img ? (
              <button
                type="button"
                className="mt-1 text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
                onClick={() => setField("page_bg_img", null)}
              >
                Inherit {inheritShort}
              </button>
            ) : null}
          </Field>
        </div>
      ) : null}

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
