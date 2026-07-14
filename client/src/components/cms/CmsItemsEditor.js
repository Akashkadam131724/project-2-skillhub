"use client";

import { useRef, useState } from "react";
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

function emptyItem(sort_order = 0) {
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
    buttons: [],
    sort_order,
    status: true,
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

function fieldLabel(config, field, fallback) {
  return config?.fieldLabels?.[field] || fallback;
}

function usesField(config, field) {
  return Boolean(config?.fields?.includes(field));
}

export function normalizeItemsDraft(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item, i) => ({
    ...emptyItem(i),
    ...item,
    _key: item?._key || item?._id || item?.id || nextDraftKey(),
    title: item?.title || item?.q || item?.question || "",
    subtitle: item?.subtitle || "",
    body: item?.body || item?.a || item?.answer || item?.quote || item?.text || "",
    label: item?.label || item?.author || "",
    value: item?.value || "",
    image_url: item?.image_url || "",
    bg_color: item?.bg_color || "",
    icon: item?.icon || "",
    href: item?.href || "",
    buttons: normalizeButtonsDraft(item?.buttons || []),
    sort_order: item?.sort_order ?? i,
    status: item?.status !== false,
    _id: item?._id || item?.id,
  }));
}

/** Persist only fields this section’s UI uses (+ buttons if configured) */
export function serializeItemsDraft(draft, sectionKey) {
  const config = getSectionItemsConfig(sectionKey);
  const fields = config?.fields || ALL_ITEM_FIELDS;

  function isMongoId(value) {
    return /^[a-f\d]{24}$/i.test(String(value || ""));
  }

  return (draft || [])
    .filter((item) => {
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
      return false;
    })
    .map((item, i) => {
      const out = {
        sort_order: i,
        status: item.status !== false,
      };
      const id = item._id || item.id;
      if (isMongoId(id)) out._id = String(id);

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
      // Always persist buttons key when section supports it (even [])
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
}) {
  const config = getSectionItemsConfig(sectionKey);
  const list = Array.isArray(value) ? value : [];
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [openButtons, setOpenButtons] = useState({});
  const dragIndexRef = useRef(null);

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
    commit((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index, dir) {
    commit((prev) => reorder(prev, index, index + dir));
  }

  function addItem() {
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

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
        <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          {config.label}
        </p>
        <p className="mt-0.5 mb-0 text-[11px] text-slate-500">
          Form fields match this section’s layout · preview updates live
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

        return (
          <div
            key={item._key || item._id || `item-${index}`}
            data-item-card
            onDragOver={(e) => onDragOver(index, e)}
            onDrop={(e) => onDrop(index, e)}
            className={`space-y-3 rounded-xl border bg-slate-50/80 p-3 transition dark:bg-slate-900/50 ${
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
                  Item {index + 1}
                </span>
              </div>
              <div className="flex items-center gap-1">
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
            {/* Live card preview — always above form fields */}
            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                {config.preview === "hero_banner"
                  ? "Live banner preview"
                  : "Preview"}
              </p>
              <CmsItemPreview preview={config.preview} item={item} />
            </div>

            <div className="space-y-2">
              {usesField(config, "title") ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "title", "Title")}
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

              {usesField(config, "subtitle") ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "subtitle", "Subtitle")}
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

              {usesField(config, "body") ? (
                <div className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "body", "Body")}
                  </span>
                  <CmsRichTextEditor
                    key={`${item._key || item._id || index}-body`}
                    value={item.body}
                    onChange={(html) => updateAt(index, { body: html })}
                    placeholder={`${fieldLabel(config, "body", "Body")}…`}
                  />
                </div>
              ) : null}

              {usesField(config, "label") || usesField(config, "value") ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {usesField(config, "value") ? (
                    <label className="block text-sm">
                      <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                        {fieldLabel(config, "value", "Value")}
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
                  {usesField(config, "label") ? (
                    <label className="block text-sm">
                      <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                        {fieldLabel(config, "label", "Label")}
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

              {usesField(config, "image_url") ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "image_url", "Image URL")}
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

              {usesField(config, "bg_color") ? (
                <div className="block text-sm">
                  <span className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "bg_color", "Background")}
                  </span>
                  <p className="mt-0 mb-2 text-[11px] text-slate-500">
                    Solids and themed gradients for white text — with or without
                    an image.
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
                          /^#[0-9a-fA-F]{6}$/.test(String(item.bg_color || ""))
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

              {usesField(config, "icon") ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "icon", "Icon")}
                  </span>
                  <input
                    className={inputClass}
                    value={item.icon}
                    onChange={(e) => updateAt(index, { icon: e.target.value })}
                    placeholder="Image URL or path"
                  />
                </label>
              ) : null}

              {usesField(config, "href") ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    {fieldLabel(config, "href", "Link URL")}
                  </span>
                  <input
                    className={inputClass}
                    value={item.href}
                    onChange={(e) => updateAt(index, { href: e.target.value })}
                    placeholder={
                      fieldLabel(config, "href", "") === "Video URL (optional)"
                        ? "https://youtube.com/… or video link"
                        : "/path or https://"
                    }
                  />
                </label>
              ) : null}

              {usesField(config, "buttons") ? (
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

      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
      >
        + Add {config.label.replace(/s$/i, "").toLowerCase() || "item"}
      </button>
    </div>
  );
}
