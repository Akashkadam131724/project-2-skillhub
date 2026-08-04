"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Drawer from "@/components/ui/Drawer";
import { SectionPreviewThumb, inputClass } from "@/components/cms/admin/CmsUi";
import CmsSectionBandEditor from "@/components/cms/sections/CmsSectionBandEditor";
import CmsButtonsEditor, {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/editors/CmsButtonsEditor";
import CmsItemsEditor, {
  normalizeItemsDraft,
  serializeItemsDraft,
  validateItemsDraft,
} from "@/components/cms/editors/CmsItemsEditor";
import CmsRichTextEditor from "@/components/cms/editors/CmsRichTextEditor";
import {
  contentLockedAtLayer,
  liveEditContentLayer,
  lockedContentHref,
  lockedContentMessage,
  normalizeContentScope,
} from "@/lib/cms/content-scope";
import {
  getSectionItemsConfig,
  sectionUsesBg,
  sectionUsesBgColor,
} from "@/lib/sections/section-registry";
import { itemsConfigRenderKey } from "@/lib/sections/section-render-key";
import { sectionSupportsBandTheme } from "@/lib/sections/section-theme";
import { bandDraftFromSection } from "@/lib/sections/section-band-cms";
import { saveSectionBandForPlacement } from "@/lib/sections/placement-save";
import { placementKey } from "@/lib/sections/page-sections-stack";
import { mediaUrl, uploadCmsImage } from "@/lib/api/cms-api";
import { sanitizeRichHtml } from "@/lib/utils/rich-text";
import {
  FIELD_META,
  fieldValue,
  previewSrc,
} from "@/components/cms/pages/live/field-meta";
import { useCmsLiveEdit } from "@/components/cms/pages/live/CmsLiveEditContext";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";

/**
 * Field / band edit drawer — owns drafts and save UI for one placement field.
 */
export default function CmsLiveFieldEditDrawer() {
  const { pageKey, entityId, pageTheme } = useCmsLiveEdit();
  const {
    catalog,
    visibleWithSurface = [],
    editing,
    fieldDrawerOpen: open,
    closeFieldEdit: onClose,
    savePlacement,
    handleFieldSaved: onSaved,
  } = useCmsLivePagePlacements();
  const [fieldValueState, setFieldValueState] = useState("");
  const [buttonsDraft, setButtonsDraft] = useState([]);
  const [itemsDraft, setItemsDraft] = useState([]);
  const buttonsDraftRef = useRef(buttonsDraft);
  const itemsDraftRef = useRef(itemsDraft);
  buttonsDraftRef.current = buttonsDraft;
  itemsDraftRef.current = itemsDraft;
  const [bandDraft, setBandDraft] = useState(() => bandDraftFromSection(null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [itemFieldErrors, setItemFieldErrors] = useState(null);

  const meta = editing ? FIELD_META[editing.field] : null;
  const itemsConfig =
    editing?.field === "items"
      ? getSectionItemsConfig(
          editing.section.section_key,
          itemsConfigRenderKey(editing.section)
        )
      : null;
  const drawerTitle = editing
    ? editing.field === "items"
      ? itemsConfig?.label || "Cards"
      : meta?.label || "Edit"
    : "Edit";

  const bandEditorPlacement = useMemo(() => {
    if (!editing?.section) {
      return {
        inheritedSurfaceTone: undefined,
        inheritedSurfaceBand: undefined,
      };
    }
    const row = visibleWithSurface.find(
      ({ section }) => placementKey(section) === placementKey(editing.section)
    );
    return {
      inheritedSurfaceTone: row?.surfaceTone,
      inheritedSurfaceBand: row?.surfaceBand,
    };
  }, [editing, visibleWithSurface]);

  useEffect(() => {
    if (!editing?.section || !editing?.field) {
      setBandDraft(bandDraftFromSection(null));
      setButtonsDraft([]);
      setItemsDraft([]);
      setFieldValueState("");
      setError(null);
      setItemFieldErrors(null);
      return;
    }
    const { section, field } = editing;
    if (field === "section_band") {
      setBandDraft(bandDraftFromSection(section));
      setButtonsDraft([]);
      setItemsDraft([]);
      setFieldValueState("");
    } else if (field === "buttons") {
      setButtonsDraft(normalizeButtonsDraft(section.buttons));
      setItemsDraft([]);
      setFieldValueState("");
    } else if (field === "items") {
      setItemsDraft(normalizeItemsDraft(section.items));
      setButtonsDraft([]);
      setFieldValueState("");
    } else {
      setFieldValueState(fieldValue(section, field));
      setButtonsDraft([]);
      setItemsDraft([]);
    }
    setError(null);
    setItemFieldErrors(null);
  }, [editing]);

  async function saveField(e) {
    e.preventDefault();
    if (!editing) return;
    const { section, field } = editing;
    const editLayer = liveEditContentLayer();
    const pageContentLocked = contentLockedAtLayer(
      section.content_scope,
      editLayer
    );
    if (pageContentLocked) {
      setError(lockedContentMessage(section.content_scope, editLayer));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (field === "buttons") {
        await savePlacement(section, {
          buttons: serializeButtonsDraft(buttonsDraftRef.current),
        });
      } else if (field === "items") {
        const renderKey = itemsConfigRenderKey(section);
        const validation = validateItemsDraft(
          itemsDraftRef.current,
          section.section_key,
          renderKey
        );
        if (!validation.ok) {
          setItemFieldErrors(validation.errorsByKey);
          setError("Fix required item fields before saving");
          return;
        }
        setItemFieldErrors(null);
        await savePlacement(section, {
          items: serializeItemsDraft(
            itemsDraftRef.current,
            section.section_key,
            renderKey
          ),
        });
      } else if (field === "body") {
        const value = sanitizeRichHtml(fieldValueState);
        await savePlacement(section, {
          data: { ...(section.data || {}), body: value || null },
        });
      } else if (field === "faq_header_side") {
        const side = fieldValueState === "right" ? "right" : "left";
        await savePlacement(section, {
          data: { ...(section.data || {}), header_side: side },
        });
      } else if (field === "cta_image_side") {
        const side = fieldValueState === "left" ? "left" : "right";
        await savePlacement(section, {
          data: { ...(section.data || {}), image_side: side },
        });
      } else if (field === "form_content_side") {
        const side = fieldValueState === "right" ? "right" : "left";
        await savePlacement(section, {
          data: { ...(section.data || {}), content_side: side },
        });
      } else if (field === "section_band") {
        const result = await saveSectionBandForPlacement(section, {
          draft: bandDraft,
          savePlacement,
          contentLocked: pageContentLocked,
          pageKey,
          entityId,
        });
        await onSaved?.(result);
        onClose();
        return;
      } else {
        const value = fieldValueState.trim();
        await savePlacement(section, {
          [field]: value || null,
        });
      }
      await onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      open={open && Boolean(editing && meta)}
      onClose={onClose}
      side="right"
      size={
        editing?.field === "items" || editing?.field === "body" ? "full" : "xl"
      }
      widthControl
      defaultWidthPct={
        editing?.field === "items" || editing?.field === "body" ? 75 : 50
      }
      title={drawerTitle}
    >
      {error ? (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {editing && meta ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
            <SectionPreviewThumb
              src={previewSrc(editing.section, catalog)}
              alt={editing.section.section_key}
              className="h-16 w-24"
            />
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                {editing.section.section_key}
              </p>
              <p className="m-0 text-xs text-slate-500">
                {editing.section.section_title ||
                  editing.section.name ||
                  "Section"}
              </p>
            </div>
          </div>
          {contentLockedAtLayer(
            editing.section.content_scope,
            liveEditContentLayer()
          ) ? (
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <p className="m-0">
                {lockedContentMessage(
                  editing.section.content_scope,
                  liveEditContentLayer()
                )}
              </p>
              <Link
                href={lockedContentHref(editing.section.content_scope, {
                  sectionKey: editing.section.section_key,
                  pageKey,
                  tagId: editing.section.page_tag_id,
                })}
                className="inline-flex font-semibold text-brand no-underline"
              >
                Edit at{" "}
                {normalizeContentScope(editing.section.content_scope) ===
                "template"
                  ? "template"
                  : "global"}{" "}
                level →
              </Link>
            </div>
          ) : meta.input === "section_band" ? (
            <CmsSectionBandEditor
              draft={bandDraft}
              onChange={setBandDraft}
              showBgImage={sectionUsesBg(editing.section.section_key)}
              showBgColor={sectionUsesBgColor(editing.section.section_key)}
              showTheme={sectionSupportsBandTheme(
                editing.section.section_key,
                itemsConfigRenderKey(editing.section)
              )}
              sectionKey={editing.section.section_key}
              renderKey={itemsConfigRenderKey(editing.section)}
              inheritedSurfaceTone={bandEditorPlacement.inheritedSurfaceTone}
              inheritedSurfaceBand={bandEditorPlacement.inheritedSurfaceBand}
              pageTheme={pageTheme}
              pageSurfaceMode={pageTheme?.surface_mode}
              pageInk={pageTheme?.ink}
              saving={saving}
              onSubmit={saveField}
              onCancel={onClose}
            />
          ) : (
            <>
              <p className="m-0 text-xs text-slate-500">{meta.hint}</p>
              {meta.input === "buttons" ? (
                <CmsButtonsEditor
                  value={buttonsDraft}
                  onChange={setButtonsDraft}
                />
              ) : meta.input === "items" ? (
                <CmsItemsEditor
                  value={itemsDraft}
                  onChange={setItemsDraft}
                  sectionKey={editing.section.section_key}
                  renderKey={itemsConfigRenderKey(editing.section)}
                  expandItemButtons={Boolean(editing.expandItemButtons)}
                  errorsByKey={itemFieldErrors}
                />
              ) : (
                <form onSubmit={saveField} className="space-y-3">
                  <div className="block text-sm">
                    <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">
                      {meta.label}
                    </span>
                    {meta.input === "richtext" ? (
                      <CmsRichTextEditor
                        value={fieldValueState}
                        onChange={setFieldValueState}
                        placeholder={`Write ${meta.label.toLowerCase()}…`}
                      />
                    ) : meta.input === "textarea" ? (
                      <textarea
                        className={`${inputClass} min-h-[120px]`}
                        value={fieldValueState}
                        onChange={(e) => setFieldValueState(e.target.value)}
                        autoFocus
                      />
                    ) : meta.input === "select" ? (
                      <select
                        className={inputClass}
                        value={
                          fieldValueState || meta.options?.[0]?.value || ""
                        }
                        onChange={(e) => setFieldValueState(e.target.value)}
                        autoFocus
                      >
                        {(meta.options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : meta.input === "image" ? (
                      <div className="space-y-3">
                        {fieldValueState ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaUrl(fieldValueState)}
                            alt="Image preview"
                            className="h-28 w-full rounded-lg object-cover"
                          />
                        ) : null}
                        <input
                          className={inputClass}
                          value={fieldValueState}
                          onChange={(e) => setFieldValueState(e.target.value)}
                          placeholder="https://… or /uploads/…"
                          autoFocus
                        />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="block w-full text-xs text-slate-600"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            e.target.value = "";
                            if (!file) return;
                            setSaving(true);
                            setError(null);
                            try {
                              const dataUrl = await new Promise(
                                (resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () => resolve(reader.result);
                                  reader.onerror = () =>
                                    reject(new Error("Could not read file"));
                                  reader.readAsDataURL(file);
                                }
                              );
                              const res = await uploadCmsImage(
                                dataUrl,
                                "sections"
                              );
                              setFieldValueState(res.data?.url || "");
                            } catch (err) {
                              setError(err.message || "Upload failed");
                            } finally {
                              setSaving(false);
                            }
                          }}
                        />
                        {fieldValueState ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-rose-600"
                            onClick={() => setFieldValueState("")}
                          >
                            Clear image
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <input
                        className={inputClass}
                        value={fieldValueState}
                        onChange={(e) => setFieldValueState(e.target.value)}
                        autoFocus
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save for this page"}
                  </button>
                </form>
              )}
              {meta.input === "buttons" || meta.input === "items" ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => saveField({ preventDefault() {} })}
                  className="w-full rounded-lg bg-brand px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save for this page"}
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </Drawer>
  );
}
