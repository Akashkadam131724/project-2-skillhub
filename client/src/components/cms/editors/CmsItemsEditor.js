"use client";

import { useEffect, useRef, useState } from "react";
import {
  normalizeButtonsDraft,
  serializeButtonsDraft,
} from "@/components/cms/editors/CmsButtonsEditor";
import CmsItemPreview from "@/components/cms/editors/CmsItemPreview";
import ItemFieldControl from "@/components/cms/editors/ItemFieldControl";
import { getSectionItemsConfig } from "@/lib/sections/section-items-config";
import {
  getItemFieldDefs,
  getItemFieldKeys,
  validateSectionItem,
} from "@/lib/sections/section-items-fields";
import { isRichTextEmpty, sanitizeRichHtml } from "@/lib/utils/rich-text";
import DragHandleIcon from "@/components/icons/DragHandleIcon";

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

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

let draftKeySeq = 0;
function nextDraftKey() {
  draftKeySeq += 1;
  return `item-draft-${Date.now()}-${draftKeySeq}`;
}

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

export function serializeItemsDraft(draft, sectionKey, renderKey = "") {
  const config = getSectionItemsConfig(sectionKey, renderKey);
  const nested = Boolean(config?.nestedTabs);
  const tabFields = getItemFieldKeys(config, { child: false });
  const childFields = getItemFieldKeys(config, { child: true });
  const fallbackFields = tabFields.length ? tabFields : ALL_ITEM_FIELDS;
  const childFallback = childFields.length ? childFields : fallbackFields;

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
    if (nested && String(item.item_type || "").toLowerCase() === "tab") {
      return true;
    }
    return false;
  }

  return (draft || [])
    .filter((item) => {
      const child = nested && isNestedChild(item);
      const fields = child ? childFallback : fallbackFields;
      return hasContent(item, fields);
    })
    .map((item, i) => {
      const child = nested && isNestedChild(item);
      const fields = child ? childFallback : fallbackFields;
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

export function validateItemsDraft(draft, sectionKey, renderKey = "") {
  const config = getSectionItemsConfig(sectionKey, renderKey);
  if (!config) return { ok: true, errorsByKey: {} };
  const nested = Boolean(config.nestedTabs);
  const tabFields = getItemFieldKeys(config, { child: false });
  const childFields = getItemFieldKeys(config, { child: true });
  const fallbackFields = tabFields.length ? tabFields : ALL_ITEM_FIELDS;
  const childFallback = childFields.length ? childFields : fallbackFields;

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
    if (nested && String(item.item_type || "").toLowerCase() === "tab") {
      return true;
    }
    return false;
  }

  const errorsByKey = {};
  let ok = true;
  for (const item of draft || []) {
    const child = nested && isNestedChild(item);
    const fields = child ? childFallback : fallbackFields;
    if (!hasContent(item, fields)) continue;
    const result = validateSectionItem(item, config, { child });
    if (!result.ok) {
      ok = false;
      const key = item._key || item._id || item.id;
      if (key) errorsByKey[String(key)] = result.errors;
    }
  }
  return { ok, errorsByKey };
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

export default function CmsItemsEditor({
  value = [],
  onChange,
  sectionKey = "",
  renderKey = "",
  expandItemButtons = false,
  /** External Zod errors keyed by item _key/_id */
  errorsByKey = null,
}) {
  const config = getSectionItemsConfig(sectionKey, renderKey);
  const list = Array.isArray(value) ? value : [];
  const nested = Boolean(config?.nestedTabs);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [openButtons, setOpenButtons] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  /** Fields the user edited since last external validation — hide those errors */
  const [clearedFields, setClearedFields] = useState({});
  const dragIndexRef = useRef(null);

  useEffect(() => {
    setClearedFields({});
  }, [errorsByKey]);

  function errorsForItem(itemKey) {
    const raw = {
      ...(errorsByKey?.[itemKey] || {}),
      ...(fieldErrors[itemKey] || {}),
    };
    const cleared = clearedFields[itemKey];
    if (cleared) {
      for (const k of cleared) delete raw[k];
    }
    return raw;
  }

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
    const item = list[index];
    const key = item?._key || item?._id || index;
    if (key != null && patch && typeof patch === "object") {
      const keys = Object.keys(patch);
      setClearedFields((prev) => ({
        ...prev,
        [key]: [...new Set([...(prev[key] || []), ...keys])],
      }));
      setFieldErrors((prev) => {
        const cur = { ...(prev[key] || {}) };
        for (const k of keys) delete cur[k];
        return { ...prev, [key]: cur };
      });
    }
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
        const child = nested && isNestedChild(item);
        const tab = nested && isNestedTab(item);

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
                <CmsItemPreview
                  preview={config.preview}
                  item={item}
                  index={index}
                />
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

                {getItemFieldDefs(config, { child }).map((field) => (
                  <ItemFieldControl
                    key={field.key}
                    field={field}
                    item={item}
                    itemKey={item._key || item._id || index}
                    error={errorsForItem(item._key || item._id || index)?.[field.key]}
                    onChange={(patch) => updateAt(index, patch)}
                    onButtonsChange={(buttonsOrUpdater) =>
                      setItemButtons(index, buttonsOrUpdater)
                    }
                    buttonsOpen={buttonsOpen}
                    onToggleButtons={() =>
                      setOpenButtons((prev) => ({
                        ...prev,
                        [item._key || index]: !buttonsOpen,
                      }))
                    }
                  />
                ))}

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
