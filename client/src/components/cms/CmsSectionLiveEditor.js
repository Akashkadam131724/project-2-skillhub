"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Drawer from "@/components/ui/Drawer";
import { SectionPreviewThumb } from "@/components/cms/CmsUi";
import CmsButtonsEditor, {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/CmsButtonsEditor";
import CmsItemsEditor, {
  normalizeItemsDraft,
  serializeItemsDraft,
} from "@/components/cms/CmsItemsEditor";
import {
  SECTION_COMPONENTS,
  sectionUsesImage,
  sectionUsesBg,
  sectionUsesBgColor,
  sectionUsesItems,
  getSectionItemsConfig,
} from "@/lib/section-registry";
import { FallbackSection } from "@/components/sections";
import { mediaUrl, uploadCmsImage } from "@/lib/cms-api";
import { mediaAlt } from "@/lib/media-alt";
import { normalizeContentScope } from "@/lib/content-scope";
import CmsSectionToolbar from "@/components/cms/CmsSectionToolbar";
import SectionSurface from "@/components/sections/SectionSurface";
import CmsBgColorPicker from "@/components/cms/CmsBgColorPicker";
import CmsRichTextEditor from "@/components/cms/CmsRichTextEditor";
import { sanitizeRichHtml } from "@/lib/rich-text";

export const CMS_FIELD_META = {
  section_title: {
    label: "Title",
    input: "text",
    hint: "Section heading shown on the page",
  },
  sub_title: {
    label: "Subtitle",
    input: "textarea",
    hint: "Supporting line under the title",
  },
  in_page_nav_title: {
    label: "In-page nav title",
    input: "text",
    hint: "Label in the sticky on-page nav",
  },
  section_bg_img: {
    label: "Background image",
    input: "image",
    hint: "Upload an image or paste a URL",
  },
  section_img_url: {
    label: "Section image",
    input: "image",
    hint: "Only rendered when this section’s layout uses it",
  },
  body: {
    label: "Body",
    input: "richtext",
    hint: "Rich text — lists, links, images, color, alignment (stored in section data)",
  },
  section_bg_color: {
    label: "Background color",
    input: "bg_color",
    hint: "Solid color or gradient for this section band",
  },
  buttons: {
    label: "Buttons",
    input: "buttons",
    hint: "CTAs — URL, YouTube, on-page #id, or form",
  },
  items: {
    label: "Cards",
    input: "items",
    hint: "Structured cards — fields follow the section layout",
  },
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

function fieldValue(section, field) {
  if (field === "body") return section?.data?.body || "";
  if (field === "section_bg_color") {
    return section?.section_bg_color || section?.data?.bg_color || "";
  }
  return section?.[field] || "";
}

/**
 * Live section preview + pencil drawers — same UX as per-page CMS.
 *
 * @param {object} props
 * @param {object} props.section - Placement-shaped props for the React section
 * @param {(patch: object) => Promise<void>} props.onSavePatch - Persist field changes
 * @param {string} [props.layerLabel] - Badge e.g. "Global" / "Template"
 * @param {boolean} [props.contentLocked] - Read-only content (e.g. global scope on template)
 * @param {string} [props.contentLockedHref] - Link when locked
 * @param {string} [props.contentLockedMessage]
 * @param {React.ReactNode} [props.toolbarExtra] - Extra chrome above the preview
 * @param {boolean} [props.showVisibilityToggle]
 * @param {(next: boolean) => Promise<void>} [props.onToggleStatus]
 * @param {object} [props.pageContext]
 */
export default function CmsSectionLiveEditor({
  section,
  onSavePatch,
  layerLabel = "Edit",
  contentLocked = false,
  contentLockedHref,
  contentLockedMessage,
  toolbarExtra = null,
  showVisibilityToggle = false,
  onToggleStatus,
  pageContext = null,
  saveLabel = "Save",
}) {
  const [editingField, setEditingField] = useState(null);
  const [fieldValueState, setFieldValueState] = useState("");
  const [buttonsDraft, setButtonsDraft] = useState([]);
  const [itemsDraft, setItemsDraft] = useState([]);
  const buttonsDraftRef = useRef(buttonsDraft);
  const itemsDraftRef = useRef(itemsDraft);
  buttonsDraftRef.current = buttonsDraft;
  itemsDraftRef.current = itemsDraft;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEditingField(null);
    setDrawerOpen(false);
    setError(null);
  }, [section?.section_key, section?.placement_id, section?._id]);

  if (!section) return null;

  const key = section.section_key || section.key;
  const meta = editingField ? CMS_FIELD_META[editingField] : null;
  const itemsConfig =
    editingField === "items" ? getSectionItemsConfig(key) : null;
  const drawerTitle =
    editingField === "items"
      ? `Edit ${itemsConfig?.label || "cards"} · ${key}`
      : `Edit ${meta?.label || "field"} · ${key}`;

  function openFieldEdit(field) {
    if (!CMS_FIELD_META[field]) return;
    if (field === "items" && !sectionUsesItems(key)) return;
    if (field === "section_img_url" && !sectionUsesImage(key)) return;
    if (field === "section_bg_img" && !sectionUsesBg(key)) return;

    setEditingField(field);
    if (field === "buttons") {
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
    setDrawerOpen(true);
    setError(null);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditingField(null);
    setFieldValueState("");
    setButtonsDraft([]);
    setItemsDraft([]);
  }

  async function saveField(e) {
    e?.preventDefault?.();
    if (!editingField) return;
    if (contentLocked) {
      setError(
        contentLockedMessage ||
          "Content is locked at this layer. Edit it at the global section instead."
      );
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let patch = {};
      if (editingField === "buttons") {
        patch = { buttons: serializeButtonsDraft(buttonsDraftRef.current) };
      } else if (editingField === "items") {
        patch = {
          items: serializeItemsDraft(itemsDraftRef.current, key),
        };
      } else if (editingField === "body") {
        const value = sanitizeRichHtml(fieldValueState);
        patch = {
          data: { ...(section.data || {}), body: value || null },
        };
      } else if (editingField === "section_bg_color") {
        const value = fieldValueState.trim();
        patch = { section_bg_color: value || null };
      } else {
        const value = fieldValueState.trim();
        patch = { [editingField]: value || null };
      }
      await onSavePatch(patch);
      closeDrawer();
    } catch (err) {
      setError(err?.message || err || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const Comp =
    SECTION_COMPONENTS[String(key || "").toLowerCase()] || FallbackSection;
  const hidden = section.status === false;
  // Section catalog docs use `key` — must not spread into JSX (React reserved)
  const { key: _catalogKey, ...sectionProps } = section;

  return (
    <div>
      {toolbarExtra}

      <div
        className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${
          hidden ? "opacity-50" : ""
        }`}
      >
        <CmsSectionToolbar
          section={section}
          preview={section.section_preview_img}
          hidden={hidden}
          layerLabel={layerLabel}
          contentLocked={contentLocked}
          onEditField={(_section, field) => openFieldEdit(field)}
          onToggleVisibility={
            showVisibilityToggle && onToggleStatus
              ? () => onToggleStatus(!hidden)
              : undefined
          }
        />

        {String(key || "").toLowerCase() === "in_page_nav" ? (
          <Comp
            {...sectionProps}
            section_key={key || _catalogKey}
            cmsMode
            onEditField={openFieldEdit}
            surfaceTone="white"
            pageContext={pageContext}
          />
        ) : (
          <SectionSurface
            sectionKey={key || _catalogKey}
            section_bg_color={section.section_bg_color}
            section_bg_img={section.section_bg_img}
            legacy_bg_color={section.data?.bg_color}
            surfaceTone="white"
          >
            <Comp
              {...sectionProps}
              section_key={key || _catalogKey}
              cmsMode
              onEditField={openFieldEdit}
              surfaceTone="white"
              pageContext={pageContext}
            />
          </SectionSurface>
        )}
      </div>

      <Drawer
        open={drawerOpen && Boolean(editingField && meta)}
        onClose={closeDrawer}
        side="right"
        size={
          editingField === "items" || editingField === "body" ? "full" : "xl"
        }
        widthControl
        defaultWidthPct={
          editingField === "items" || editingField === "body" ? 75 : 50
        }
        title={drawerTitle}
      >
        {error ? (
          <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {typeof error === "string" ? error : error.message || "Error"}
          </div>
        ) : null}

        {editingField && meta ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
              <SectionPreviewThumb
                src={section.section_preview_img}
                alt={key}
                className="h-16 w-24"
              />
              <div className="min-w-0">
                <p className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
                  {key}
                </p>
                <p className="m-0 text-xs text-slate-500">
                  {section.section_title || section.name || layerLabel}
                </p>
              </div>
            </div>

            {contentLocked ? (
              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
                <p className="m-0">
                  {contentLockedMessage ||
                    "This section uses global content. Edit it on the content section page."}
                </p>
                {contentLockedHref ? (
                  <Link
                    href={contentLockedHref}
                    className="inline-flex font-semibold text-brand no-underline"
                  >
                    Edit global content →
                  </Link>
                ) : null}
              </div>
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
                    sectionKey={key}
                  />
                ) : meta.input === "bg_color" ? (
                  <form onSubmit={saveField} className="space-y-3">
                    <div>
                      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                        {meta.label}
                      </span>
                      <CmsBgColorPicker
                        value={fieldValueState}
                        onChange={setFieldValueState}
                        variant="theme"
                        defaultLabel="Default"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center rounded-lg border-0 bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
                      >
                        {saving ? "Saving…" : saveLabel}
                      </button>
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
                      ) : meta.input === "image" ? (
                        <div className="space-y-2">
                          {fieldValueState ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={mediaUrl(fieldValueState)}
                              alt={mediaAlt(meta.label, "Image preview")}
                              className="h-28 w-full rounded-lg object-cover"
                            />
                          ) : null}
                          <input
                            className={inputClass}
                            value={fieldValueState}
                            onChange={(e) =>
                              setFieldValueState(e.target.value)
                            }
                            placeholder="/uploads/… or https://…"
                          />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="block w-full text-xs"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              setSaving(true);
                              try {
                                const dataUrl = await new Promise(
                                  (resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = () =>
                                      resolve(reader.result);
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
                      {saving ? "Saving…" : saveLabel}
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
                    {saving ? "Saving…" : saveLabel}
                  </button>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

/** Shape a Section catalog doc into props the live section components expect */
export function sectionDocToLiveProps(doc) {
  if (!doc) return null;
  return {
    ...doc,
    section_key: doc.key,
    placement_id: String(doc._id || doc.id || doc.key),
    name: doc.name,
    buttons: Array.isArray(doc.buttons) ? doc.buttons : [],
    items: Array.isArray(doc.items) ? doc.items : [],
    data: doc.data || {},
    status: doc.status !== false,
    content_scope: normalizeContentScope(doc.content_scope),
  };
}

/** Merge template tag over section defaults for live preview */
export function templatePlacementToLiveProps(tag, sectionDoc) {
  if (!tag) return null;
  const scope = normalizeContentScope(
    tag.content_scope || sectionDoc?.content_scope
  );
  const base = sectionDocToLiveProps(sectionDoc) || {
    section_key: tag.section_key,
    buttons: [],
    items: [],
    data: {},
  };

  if (scope === "global") {
    return {
      ...base,
      placement_id: String(tag.id),
      page_tag_id: tag.id,
      status: tag.status !== false,
      content_scope: "global",
      sort_order: tag.sort_order,
    };
  }

  const pick = (key) => {
    const v = tag[key];
    if (v !== null && v !== undefined && v !== "") return v;
    return base[key] ?? "";
  };

  const pickArr = (key) => {
    if (Array.isArray(tag[key])) return tag[key];
    if (Array.isArray(base[key])) return base[key];
    return [];
  };

  return {
    ...base,
    placement_id: String(tag.id),
    page_tag_id: tag.id,
    section_key: tag.section_key,
    sort_order: tag.sort_order,
    section_title: pick("section_title"),
    sub_title: pick("sub_title"),
    in_page_nav_title: pick("in_page_nav_title"),
    section_bg_img: pick("section_bg_img"),
    section_bg_color: pick("section_bg_color"),
    section_img_url: pick("section_img_url"),
    section_preview_img:
      tag.section_preview_img || base.section_preview_img || "",
    buttons: pickArr("buttons"),
    items: pickArr("items"),
    data: tag.data ?? base.data ?? {},
    status: tag.status !== false,
    content_scope: scope,
  };
}
