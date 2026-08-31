"use client";

import { Field, inputClass } from "@/components/cms/admin/CmsUi";
import CmsBgColorPicker from "@/components/cms/editors/CmsBgColorPicker";
import { useCmsThemeEditor } from "@/components/cms/theme/editor-tabs/CmsThemeEditorContext";

/** Page background color + image tab. */
export default function BackgroundTab() {
  const { isPage, theme, parent, inheritShort, setField } = useCmsThemeEditor();

  function setPageBgColor(v: string) {
    setField("page_bg_color", v || (isPage ? null : ""));
  }

  function setPageBgImg(v: string) {
    setField("page_bg_img", v || (isPage ? null : ""));
  }

  return (
    <div className="space-y-4">
      <Field
        label="Page background color"
        hint="Shows behind transparent sections. Section-specific bg is unchanged."
      >
        <CmsBgColorPicker
          value={String(theme.page_bg_color || "")}
          onChange={setPageBgColor}
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
          value={String(theme.page_bg_img || "")}
          placeholder={
            isPage
              ? parent.page_bg_img
                ? `Inherit (${parent.page_bg_img})`
                : "Inherit / empty"
              : "/uploads/… or https://…"
          }
          onChange={(e) => setPageBgImg(e.target.value)}
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
  );
}
