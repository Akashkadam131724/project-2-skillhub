"use client";

import { THEME_PRESETS } from "@/lib/theme";
import { Field, inputClass } from "@/components/cms/admin/CmsUi";
import { useCmsThemeEditor } from "@/components/cms/theme/editor-tabs/CmsThemeEditorContext";

const COLOR_FIELDS = [
  { key: "brand_primary", label: "Brand", fallback: "#1b4de4" },
  { key: "brand_hover", label: "Brand hover", fallback: "#153fc0" },
  { key: "ink", label: "Ink", fallback: "#0b1f4d" },
];

/** Color preset + brand/hover/ink fields. */
export default function ColorsTab() {
  const { isPage, theme, parent, inheritShort, setField, patchTheme } =
    useCmsThemeEditor();

  function applyPreset(presetKey) {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    if (isPage) {
      // Preset only — leave colors empty so they follow this preset via merge,
      // and clearing the preset later truly inherits from the parent layer.
      patchTheme({
        preset: presetKey,
        brand_primary: null,
        brand_hover: null,
        ink: null,
      });
      return;
    }
    patchTheme({
      preset: presetKey,
      brand_primary: preset.brand_primary,
      brand_hover: preset.brand_hover,
      ink: preset.ink,
    });
  }

  function colorDisplay(key, fallback) {
    const raw = theme[key];
    if (/^#[0-9a-fA-F]{6}$/.test(String(raw || ""))) return raw;
    if (/^#[0-9a-fA-F]{6}$/.test(String(parent[key] || ""))) return parent[key];
    return fallback;
  }

  return (
    <div className="space-y-4">
      <Field label="Color preset">
        <div className="flex flex-wrap gap-1.5">
          {isPage ? (
            <button
              type="button"
              onClick={() => setField("preset", null)}
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
        {COLOR_FIELDS.map(({ key, label, fallback }) => (
          <Field key={key} label={isPage ? `${label} (or inherit)` : label}>
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
  );
}
