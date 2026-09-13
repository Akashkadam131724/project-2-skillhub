"use client";

import { Field } from "@/components/cms/admin/CmsUi";
import ThemeFontLinks from "@/components/cms/theme/ThemeFontLinks";
import { useCmsThemeEditor } from "@/context/CmsThemeEditorContext";
import {
  FONT_PRESETS,
  fontFamilyStack,
  resolveThemeFontKey,
} from "@/lib/theme";

/** One site-wide font family — no separate body / heading faces. */
export default function TypographyTab() {
  const { isPage, theme, parent, inheritShort, patchTheme } =
    useCmsThemeEditor();

  const selected = resolveThemeFontKey(theme);
  const inherited = resolveThemeFontKey(parent);
  const isInherit = isPage && !String(theme.font_family || "").trim();

  function applyFont(key: string | null) {
    patchTheme({
      font_family: key,
      font_sans: key,
      font_display: key,
    });
  }

  return (
    <div className="space-y-4">
      <ThemeFontLinks theme={isInherit ? parent : theme} />
      <p className="m-0 text-xs text-slate-500">
        One font for the whole site — banner title, description, headings, and
        body.
      </p>

      <Field label={isPage ? "Font family (or inherit)" : "Font family"}>
        <div
          className="flex flex-wrap gap-1.5"
          role="radiogroup"
          aria-label="Font family"
        >
          {isPage ? (
            <label
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                isInherit
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-200 text-slate-600 dark:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="theme-font-family"
                className="sr-only"
                checked={isInherit}
                onChange={() => applyFont(null)}
              />
              Inherit{parent.font_family ? ` (${inherited})` : ""}
            </label>
          ) : null}
          {Object.entries(FONT_PRESETS).map(([key, preset]) => {
            const active = !isInherit && selected === key;
            return (
              <label
                key={key}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ${
                  active
                    ? "border-brand ring-2 ring-brand/25"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                style={{ fontFamily: fontFamilyStack(key) }}
              >
                <input
                  type="radio"
                  name="theme-font-family"
                  className="size-3 accent-brand"
                  checked={active}
                  onChange={() => applyFont(key)}
                />
                {preset.label}
              </label>
            );
          })}
        </div>
        {isPage && !isInherit ? (
          <button
            type="button"
            className="mt-2 text-[11px] font-semibold text-slate-500 underline-offset-2 hover:text-brand hover:underline"
            onClick={() => applyFont(null)}
          >
            Inherit {inheritShort}
          </button>
        ) : null}
      </Field>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <p
          className="m-0 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
          style={{
            fontFamily: fontFamilyStack(isInherit ? inherited : selected),
          }}
        >
          Accelerate workforce transformation
        </p>
        <p
          className="mt-2 mb-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          style={{
            fontFamily: fontFamilyStack(isInherit ? inherited : selected),
          }}
        >
          Authorized training paths, live CMS editing, and learner analytics in
          one platform.
        </p>
      </div>
    </div>
  );
}
