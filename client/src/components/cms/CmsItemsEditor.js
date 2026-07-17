"use client";

import { useEffect, useRef, useState } from "react";
import CmsButtonsEditor, {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/CmsButtonsEditor";
import CmsItemPreview from "@/components/cms/CmsItemPreview";
import { getSectionItemsConfig } from "@/lib/section-items-config";
import {
  BANNER_SOLID_PRESETS,
  BANNER_GRADIENT_PRESETS,
  isBannerGradient,
} from "@/lib/banner-bg";
import CmsRichTextEditor from "@/components/cms/CmsRichTextEditor";
import { isRichTextEmpty, sanitizeRichHtml } from "@/lib/rich-text";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

const ALL_ITEM_FIELDS = [
  "title",
  "subtitle",
  "body",
  "label",
  "value",
  "image_url",
  "bg_color",
  "icon",
  "href",
  "buttons",
];

/** @deprecated use BANNER_SOLID_PRESETS — kept as alias for clarity in this file */
const BG_COLOR_PRESETS = BANNER_SOLID_PRESETS;

let draftKeySeq = 0;
function nextDraftKey() {
  draftKeySeq += 1;
  return `item-draft-${Date.now()}-${draftKeySeq}`;
}

/** Stable 24-char hex id so children can parent_id-reference a new tab before save */
function nextObjectId() {
  const bytes = new Uint8Array(12);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 12; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function emptyItem(sort_order = 0, extras = {}) {
  return {
    _key: nextDraftKey(),
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    bg_color: "",
    icon: "",
    href: "",
    item_type: "",
    parent_id: "",
    buttons: [],
    sort_order,
    status: true,
    ...extras,
  };
}

function DragHandleIcon() {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="9" cy="7" r="1.5" />
      <circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  );
}

function fieldLabel(config, field, fallback, nested = false) {
  if (nested && config?.childFieldLabels?.[field]) {
    return config.childFieldLabels[field];
  }
  return config?.fieldLabels?.[field] || fallback;
}

function usesField(config, field, nested = false) {
  const fields =
    nested && Array.isArray(config?.childFields)
      ? config.childFields
      : config?.fields;
  return Boolean(fields?.includes(field));
}

function itemStableId(item) {
  return String(item?._id || item?.id || "").trim();
}

function isNestedChild(item) {
  const type = String(item?.item_type || "").toLowerCase();
  if (type === "tab") return false;
  return Boolean(String(item?.parent_id || "").trim());
}

function isNestedTab(item) {
  if (isNestedChild(item)) return false;
  const type = String(item?.item_type || "").toLowerCase();
  return type === "tab" || type === "";
}

export function normalizeItemsDraft(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item, i) => {
    const id = item?._id || item?.id || "";
    return {
      ...emptyItem(i),
      ...item,
      _key: item?._key || id || nextDraftKey(),
      title: item?.title || item?.q || item?.question || "",
      subtitle: item?.subtitle || "",
      body:
        item?.body || item?.a || item?.answer || item?.quote || item?.text || "",
      label: item?.label || item?.author || "",
      value: item?.value || "",
      image_url: item?.image_url || "",
      bg_color: item?.bg_color || "",
      icon: item?.icon || "",
      href: item?.href || "",
      item_type: String(item?.item_type || "").toLowerCase(),
      parent_id: String(item?.parent_id || "").trim(),
      buttons: normalizeButtonsDraft(item?.buttons || []),
      sort_order: item?.sort_order ?? i,
      status: item?.status !== false,
      _id: id || undefined,
    };
  });
}

/** Persist only fields this section’s UI uses (+ buttons if configured) */
export function serializeItemsDraft(draft, sectionKey) {
  const config = getSectionItemsConfig(sectionKey);
  const nested = Boolean(config?.nestedTabs);
  const tabFields = config?.fields || ALL_ITEM_FIELDS;
  const childFields = config?.childFields || tabFields;

  function isMongoId(value) {
    return /^[a-f\d]{24}$/i.test(String(value || ""));
  }

  function hasContent(item, fields) {
    if (fields.includes("title") && String(item.title || "").trim()) return true;
    if (fields.includes("subtitle") && String(item.subtitle || "").trim())
      return true;
    if (fields.includes("body") && !isRichTextEmpty(item.body)) return true;
    if (fields.includes("label") && String(item.label || "").trim()) return true;
    if (fields.includes("value") && String(item.value || "").trim()) return true;
    if (fields.includes("image_url") && String(item.image_url || "").trim())
      return true;
    if (fields.includes("bg_color") && String(item.bg_color || "").trim())
      return true;
    if (fields.includes("icon") && String(item.icon || "").trim()) return true;
    if (fields.includes("href") && String(item.href || "").trim()) return true;
    if (
      fields.includes("buttons") &&
      Array.isArray(item.buttons) &&
      item.buttons.some((b) => String(b.label || "").trim())
    ) {
      return true;
    }
    // Allow empty tab shells that only group children
    if (nested && String(item.item_type || "").toLowerCase() === "tab") {
      return true;
    }
    return false;
  }

  return (draft || [])
    .filter((item) => {
      const child = nested && isNestedChild(item);
      const fields = child ? childFields : tabFields;
      return hasContent(item, fields);
    })
    .map((item, i) => {
      const child = nested && isNestedChild(item);
      const fields = child ? childFields : tabFields;
      const out = {
        sort_order: i,
        status: item.status !== false,
      };
      const id = item._id || item.id;
      if (isMongoId(id)) out._id = String(id);

      if (nested) {
        if (child) {
          out.item_type = "item";
          out.parent_id = String(item.parent_id || "").trim();
        } else {
          out.item_type = "tab";
          out.parent_id = "";
          // Ensure tabs always keep a stable id for children to reference
          if (!out._id) out._id = isMongoId(id) ? String(id) : nextObjectId();
        }
      }

      for (const field of ALL_ITEM_FIELDS) {
        if (!fields.includes(field)) continue;
        if (field === "buttons") {
          out.buttons = serializeButtonsDraft(item.buttons || []);
        } else if (field === "body") {
          out.body = sanitizeRichHtml(item.body || "");
        } else {
          out[field] = String(item[field] || "").trim();
        }
      }
      if (fields.includes("buttons") && !Array.isArray(out.buttons)) {
        out.buttons = [];
      }
      return out;
    });
}

function reorder(list, fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = list.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next.map((b, i) => ({ ...b, sort_order: i }));
}

/**
 * Section-aware items editor — only fields the section UI uses,
 * with a live card preview that mirrors the real layout.
 *
 * onChange must accept a React setState updater: (prev) => next
 */
export default function CmsItemsEditor({
  value = [],
  onChange,
  sectionKey = "",
  expandItemButtons = false,
}) {
  const config = getSectionItemsConfig(sectionKey);
  const list = Array.isArray(value) ? value : [];
  const nested = Boolean(config?.nestedTabs);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [openButtons, setOpenButtons] = useState({});
  const dragIndexRef = useRef(null);

  useEffect(() => {
    if (!expandItemButtons || !list.length) return;
    const first = list[0];
    const key = first?._key || 0;
    setOpenButtons((prev) => ({ ...prev, [key]: true }));
  }, [expandItemButtons, list]);

  const tabOptions = nested
    ? list.filter((item) => isNestedTab(item)).map((item) => ({
        id: itemStableId(item),
        label: item.title || item.value || "Untitled tab",
      }))
    : [];

  if (!config) {
    return (
      <p className="m-0 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-700">
        This section doesn’t use items — its layout owns other CMS fields
        instead.
      </p>
    );
  }

  function commit(updater) {
    onChange((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return updater(base);
    });
  }

  function updateAt(index, patch) {
    commit((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...patch } : b))
    );
  }

  function removeAt(index) {
    commit((prev) => {
      const target = prev[index];
      if (!target) return prev;
      const removedId = itemStableId(target);
      const next = prev.filter((_, i) => i !== index);
      // Drop children when a tab is removed
      if (nested && isNestedTab(target) && removedId) {
        return next.filter(
          (item) => String(item.parent_id || "").trim() !== removedId
        );
      }
      return next;
    });
  }

  function move(index, dir) {
    commit((prev) => reorder(prev, index, index + dir));
  }

  function addTab() {
    commit((prev) => [
      ...prev,
      emptyItem(prev.length, {
        _id: nextObjectId(),
        item_type: "tab",
        parent_id: "",
        title: "New tab",
      }),
    ]);
  }

  function addChild(parentId) {
    const pid = String(parentId || "").trim();
    if (!pid) return;
    commit((prev) => [
      ...prev,
      emptyItem(prev.length, {
        item_type: "item",
        parent_id: pid,
        title: "New item",
      }),
    ]);
  }

  function addItem() {
    if (nested) {
      addTab();
      return;
    }
    commit((prev) => [...prev, emptyItem(prev.length)]);
  }

  /** Nested button editor — keep functional updates so labels aren’t lost */
  function setItemButtons(index, buttonsOrUpdater) {
    commit((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const prevButtons = Array.isArray(item.buttons) ? item.buttons : [];
        const nextButtons =
          typeof buttonsOrUpdater === "function"
            ? buttonsOrUpdater(prevButtons)
            : buttonsOrUpdater;
        return { ...item, buttons: nextButtons };
      })
    );
  }

  function onDragStart(index, e) {
    dragIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(
        e.currentTarget.closest("[data-item-card]") || e.currentTarget,
        24,
        24
      );
    }
  }

  function onDragOver(index, e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overIndex !== index) setOverIndex(index);
  }

  function onDrop(index, e) {
    e.preventDefault();
    const from =
      dragIndexRef.current ?? Number(e.dataTransfer.getData("text/plain"));
    if (Number.isFinite(from)) commit((prev) => reorder(prev, from, index));
    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }

  function onDragEnd() {
    dragIndexRef.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }

  function roleBadge(item) {
    if (!nested) return `Item`;
    if (isNestedChild(item)) return "Item";
    return "Tab";
  }

  function parentLabel(item) {
    if (!isNestedChild(item)) return "";
    const parent = list.find(
      (t) => itemStableId(t) === String(item.parent_id || "").trim()
    );
    return parent?.title || parent?.value || "Tab";
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          {config.label}
        </p>
        <p className="mt-0.5 mb-0 text-[11px] text-slate-500">
          {nested
            ? "Add tabs first, then attach multiple items to each tab via Parent tab"
            : "Form fields match this section’s layout · preview updates live"}
        </p>
      </div>

      {!list.length ? (
        <p className="m-0 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-700">
          No items yet. Add one below.
        </p>
      ) : (
        <p className="m-0 text-[11px] text-slate-500">
          Drag the handle to reorder
        </p>
      )}

      {list.map((item, index) => {
        const isDragging = dragIndex === index;
        const isOver =
          overIndex === index && dragIndex !== null && dragIndex !== index;
        const buttonsOpen = Boolean(openButtons[item._key || index]);
        const btnCount = Array.isArray(item.buttons)
          ? item.buttons.filter((b) => b?.label).length
          : 0;
        const child = nested && isNestedChild(item);
        const tab = nested && isNestedTab(item);
        const fieldsForItem = child;

        return (
          <div
            key={item._key || item._id || `item-${index}`}
            data-item-card
            onDragOver={(e) => onDragOver(index, e)}
            onDrop={(e) => onDrop(index, e)}
            className={`space-y-3 rounded-xl border bg-slate-50/80 p-3 transition dark:bg-slate-900/50 ${
              child ? "ml-3 border-l-4 border-l-brand/40" : ""
            } ${
              isDragging
                ? "border-brand opacity-50"
                : isOver
                  ? "border-brand border-dashed bg-brand/5"
                  : "border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  draggable
                  onDragStart={(e) => onDragStart(index, e)}
                  onDragEnd={onDragEnd}
                  className="inline-flex cursor-grab touch-none items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 py-1 text-slate-500 hover:border-slate-300 hover:text-slate-700 active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  title="Drag to reorder"
                  aria-label={`Drag to reorder item ${index + 1}`}
                >
                  <DragHandleIcon />
                </button>
                <span className="truncate text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  {roleBadge(item)} {index + 1}
                  {child ? (
                    <span className="ml-1 font-normal normal-case text-slate-400">
                      · under {parentLabel(item)}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {tab ? (
                  <button
                    type="button"
                    className="rounded px-1.5 py-0.5 text-xs font-semibold text-brand hover:bg-brand/10"
                    onClick={() => addChild(itemStableId(item))}
                    title="Add item under this tab"
                  >
                    + Item
                  </button>
                ) : null}
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800"
                  disabled={index === list.length - 1}
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() => removeAt(index)}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  {config.preview === "hero_banner"
                    ? "Live banner preview"
                    : "Preview"}
                </p>
                <CmsItemPreview preview={config.preview} item={item} />
              </div>

              <div className="space-y-2">
                {nested ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                        Type
                      </span>
                      <select
                        className={inputClass}
                        value={child ? "item" : "tab"}
                        onChange={(e) => {
                          const nextType = e.target.value;
                          if (nextType === "tab") {
                            updateAt(index, {
                              item_type: "tab",
                              parent_id: "",
                              _id: itemStableId(item) || nextObjectId(),
                            });
                          } else {
                            const fallbackParent =
                              String(item.parent_id || "").trim() ||
                              tabOptions[0]?.id ||
                              "";
                            updateAt(index, {
                              item_type: "item",
                              parent_id: fallbackParent,
                            });
                          }
                        }}
                      >
                        <option value="tab">Tab</option>
                        <option value="item">Item (under a tab)</option>
                      </select>
                    </label>

                    {child ? (
                      <label className="block text-sm">
                        <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                          Parent tab
                        </span>
                        <select
                          className={inputClass}
                          value={String(item.parent_id || "")}
                          onChange={(e) =>
                            updateAt(index, { parent_id: e.target.value })
                          }
                        >
                          <option value="">Select a tab…</option>
                          {tabOptions
                            .filter((t) => t.id)
                            .map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label}
                              </option>
                            ))}
                        </select>
                      </label>
                    ) : null}
                  </div>
                ) : null}

                {usesField(config, "title", fieldsForItem) ? (
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(config, "title", "Title", fieldsForItem)}
                    </span>
                    <input
                      className={inputClass}
                      value={item.title}
                      onChange={(e) =>
                        updateAt(index, { title: e.target.value })
                      }
                    />
                  </label>
                ) : null}

                {usesField(config, "subtitle", fieldsForItem) ? (
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(
                        config,
                        "subtitle",
                        "Subtitle",
                        fieldsForItem
                      )}
                    </span>
                    <input
                      className={inputClass}
                      value={item.subtitle}
                      onChange={(e) =>
                        updateAt(index, { subtitle: e.target.value })
                      }
                    />
                  </label>
                ) : null}

                {usesField(config, "body", fieldsForItem) ? (
                  <div className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(config, "body", "Body", fieldsForItem)}
                    </span>
                    <CmsRichTextEditor
                      key={`${item._key || item._id || index}-body`}
                      value={item.body}
                      onChange={(html) => updateAt(index, { body: html })}
                      placeholder={`${fieldLabel(config, "body", "Body", fieldsForItem)}…`}
                    />
                  </div>
                ) : null}

                {usesField(config, "label", fieldsForItem) ||
                usesField(config, "value", fieldsForItem) ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {usesField(config, "value", fieldsForItem) ? (
                      <label className="block text-sm">
                        <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                          {fieldLabel(
                            config,
                            "value",
                            "Value",
                            fieldsForItem
                          )}
                        </span>
                        <input
                          className={inputClass}
                          value={item.value}
                          onChange={(e) =>
                            updateAt(index, { value: e.target.value })
                          }
                        />
                      </label>
                    ) : null}
                    {usesField(config, "label", fieldsForItem) ? (
                      <label className="block text-sm">
                        <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                          {fieldLabel(
                            config,
                            "label",
                            "Label",
                            fieldsForItem
                          )}
                        </span>
                        <input
                          className={inputClass}
                          value={item.label}
                          onChange={(e) =>
                            updateAt(index, { label: e.target.value })
                          }
                        />
                      </label>
                    ) : null}
                  </div>
                ) : null}

                {usesField(config, "image_url", fieldsForItem) ? (
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(
                        config,
                        "image_url",
                        "Image URL",
                        fieldsForItem
                      )}
                    </span>
                    <input
                      className={inputClass}
                      value={item.image_url}
                      onChange={(e) =>
                        updateAt(index, { image_url: e.target.value })
                      }
                    />
                  </label>
                ) : null}

                {usesField(config, "bg_color", fieldsForItem) ? (
                  <div className="block text-sm">
                    <span className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(
                        config,
                        "bg_color",
                        "Background",
                        fieldsForItem
                      )}
                    </span>
                    <p className="mt-0 mb-2 text-[11px] text-slate-500">
                      Solids and themed gradients for white text — with or
                      without an image.
                    </p>

                    <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Solid
                    </p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateAt(index, { bg_color: "" })}
                        className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
                          !item.bg_color
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                        }`}
                      >
                        Default
                      </button>
                      {BG_COLOR_PRESETS.map((preset) => {
                        const active =
                          String(item.bg_color || "").toLowerCase() ===
                          preset.value.toLowerCase();
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            title={preset.label}
                            onClick={() =>
                              updateAt(index, { bg_color: preset.value })
                            }
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold ${
                              active
                                ? "border-brand ring-2 ring-brand/25"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <span
                              className="size-3.5 rounded-sm ring-1 ring-black/10"
                              style={{ backgroundColor: preset.value }}
                              aria-hidden
                            />
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                      Gradients
                    </p>
                    <div className="mb-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                      {BANNER_GRADIENT_PRESETS.map((preset) => {
                        const active =
                          String(item.bg_color || "").replace(/\s+/g, "") ===
                          preset.value.replace(/\s+/g, "");
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            title={preset.label}
                            onClick={() =>
                              updateAt(index, { bg_color: preset.value })
                            }
                            className={`flex flex-col overflow-hidden rounded-lg border text-left transition ${
                              active
                                ? "border-brand ring-2 ring-brand/25"
                                : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            <span
                              className="h-10 w-full"
                              style={{ backgroundImage: preset.value }}
                              aria-hidden
                            />
                            <span className="px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <label className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        Custom
                      </span>
                      {!isBannerGradient(item.bg_color) ? (
                        <input
                          type="color"
                          value={
                            /^#[0-9a-fA-F]{6}$/.test(
                              String(item.bg_color || "")
                            )
                              ? item.bg_color
                              : "var(--ink)"
                          }
                          onChange={(e) =>
                            updateAt(index, { bg_color: e.target.value })
                          }
                          className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5 dark:border-slate-700"
                          aria-label="Custom background color"
                        />
                      ) : null}
                      <input
                        className={`${inputClass} min-w-0 flex-1 font-mono text-xs`}
                        placeholder="#0b1f4d or linear-gradient(…)"
                        value={item.bg_color || ""}
                        onChange={(e) =>
                          updateAt(index, { bg_color: e.target.value })
                        }
                      />
                    </label>
                  </div>
                ) : null}

                {usesField(config, "icon", fieldsForItem) ? (
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(config, "icon", "Icon", fieldsForItem)}
                    </span>
                    <input
                      className={inputClass}
                      value={item.icon}
                      onChange={(e) =>
                        updateAt(index, { icon: e.target.value })
                      }
                      placeholder="Image URL or path"
                    />
                  </label>
                ) : null}

                {usesField(config, "href", fieldsForItem) ? (
                  <label className="block text-sm">
                    <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                      {fieldLabel(config, "href", "Link URL", fieldsForItem)}
                    </span>
                    <input
                      className={inputClass}
                      value={item.href}
                      onChange={(e) =>
                        updateAt(index, { href: e.target.value })
                      }
                      placeholder={
                        fieldLabel(config, "href", "", fieldsForItem) ===
                        "Video URL (optional)"
                          ? "https://youtube.com/… or video link"
                          : "/path or https://"
                      }
                    />
                  </label>
                ) : null}

                {usesField(config, "buttons", fieldsForItem) ? (
                  <div className="rounded-lg border border-slate-200 bg-white/70 p-2 dark:border-slate-700 dark:bg-slate-950/40">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-700 dark:text-slate-200"
                      onClick={() =>
                        setOpenButtons((prev) => ({
                          ...prev,
                          [item._key || index]: !buttonsOpen,
                        }))
                      }
                    >
                      <span>
                        Item buttons{btnCount ? ` (${btnCount})` : ""}
                      </span>
                      <span className="text-slate-400">
                        {buttonsOpen ? "▾" : "▸"}
                      </span>
                    </button>
                    {buttonsOpen ? (
                      <div className="mt-2">
                        <CmsButtonsEditor
                          value={item.buttons || []}
                          onChange={(buttonsOrUpdater) =>
                            setItemButtons(index, buttonsOrUpdater)
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={item.status !== false}
                    onChange={(e) =>
                      updateAt(index, { status: e.target.checked })
                    }
                  />
                  Enabled
                </label>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={addItem}
          className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
        >
          {nested
            ? "+ Add tab"
            : `+ Add ${config.label.replace(/s$/i, "").toLowerCase() || "item"}`}
        </button>
        {nested && tabOptions.length ? (
          <button
            type="button"
            onClick={() => addChild(tabOptions[0]?.id)}
            className="w-full rounded-lg border border-dashed border-brand/40 px-3 py-2.5 text-sm font-semibold text-brand hover:bg-brand/5 dark:border-brand/50"
          >
            + Add item under first tab
          </button>
        ) : null}
      </div>
    </div>
  );
}
