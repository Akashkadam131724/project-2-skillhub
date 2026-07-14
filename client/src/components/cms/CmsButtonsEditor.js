"use client";

import { useRef, useState } from "react";
import {
  BUTTON_ACTION_LABELS,
  BUTTON_ACTION_TYPES,
  BUTTON_VARIANT_LABELS,
  BUTTON_VARIANTS,
} from "@/lib/button-types";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

let draftKeySeq = 0;
function nextDraftKey() {
  draftKeySeq += 1;
  return `btn-draft-${Date.now()}-${draftKeySeq}`;
}

function emptyButton(sort_order = 0) {
  return {
    _key: nextDraftKey(),
    label: "",
    variant: "primary",
    action_type: "url",
    target_url: "",
    target_id: "",
    form_key: "",
    open_in_new_tab: false,
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

/** Normalize API / legacy button objects for the editor */
export function normalizeButtonsDraft(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons.map((b, i) => ({
    ...emptyButton(i),
    ...b,
    _key: b?._key || b?._id || b?.id || nextDraftKey(),
    label: b?.label || "",
    variant: b?.variant || "primary",
    action_type: b?.action_type || "url",
    target_url: b?.target_url || "",
    target_id: String(b?.target_id || "").replace(/^#/, ""),
    form_key: b?.form_key || "",
    open_in_new_tab: Boolean(b?.open_in_new_tab),
    sort_order: b?.sort_order ?? i,
    status: b?.status !== false,
    _id: b?._id || b?.id,
  }));
}

function isMongoId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || ""));
}

export function serializeButtonsDraft(draft) {
  return (draft || [])
    .filter((b) => String(b.label || "").trim())
    .map((b, i) => {
      const out = {
        label: String(b.label).trim(),
        variant: b.variant || "primary",
        action_type: b.action_type || "url",
        target_url:
          b.action_type === "url" || b.action_type === "youtube"
            ? String(b.target_url || "").trim()
            : "",
        target_id:
          b.action_type === "anchor"
            ? String(b.target_id || "")
                .replace(/^#/, "")
                .trim()
            : "",
        form_key:
          b.action_type === "form" ? String(b.form_key || "").trim() : "",
        open_in_new_tab: Boolean(b.open_in_new_tab),
        sort_order: i,
        status: b.status !== false,
      };
      const id = b._id || b.id;
      if (isMongoId(id)) out._id = String(id);
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
 * Multi-button editor for page-section mappings.
 * Drag the handle to reorder; ↑/↓ still available.
 *
 * onChange must accept a React setState updater: (prev) => next
 * (so nested item-button edits never wipe sibling fields).
 */
export default function CmsButtonsEditor({ value = [], onChange }) {
  const list = Array.isArray(value) ? value : [];
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const dragIndexRef = useRef(null);

  function commit(updater) {
    onChange((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return updater(base);
    });
  }

  function updateAt(index, patch) {
    commit((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  function removeAt(index) {
    commit((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index, dir) {
    commit((prev) => reorder(prev, index, index + dir));
  }

  function addButton() {
    commit((prev) => [...prev, emptyButton(prev.length)]);
  }

  function onDragStart(index, e) {
    dragIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    // Improve drag ghost in some browsers
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(
        e.currentTarget.closest("[data-button-card]") || e.currentTarget,
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
      dragIndexRef.current ??
      Number(e.dataTransfer.getData("text/plain"));
    if (Number.isFinite(from)) {
      commit((prev) => reorder(prev, from, index));
    }
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
      {!list.length ? (
        <p className="m-0 rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center text-xs text-slate-500 dark:border-slate-700">
          No buttons yet. Add one below.
        </p>
      ) : (
        <p className="m-0 text-[11px] text-slate-500">
          Drag the handle to reorder buttons
        </p>
      )}

      {list.map((btn, index) => {
        const isDragging = dragIndex === index;
        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

        return (
          <div
            key={btn._key || btn._id || `btn-${index}`}
            data-button-card
            onDragOver={(e) => onDragOver(index, e)}
            onDrop={(e) => onDrop(index, e)}
            className={`space-y-2.5 rounded-xl border bg-slate-50/80 p-3 transition dark:bg-slate-900/50 ${
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
                  aria-label={`Drag to reorder button ${index + 1}`}
                >
                  <DragHandleIcon />
                </button>
                <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  Button {index + 1}
                  {btn.label ? (
                    <span className="ml-1.5 font-normal normal-case text-slate-400">
                      · {btn.label}
                    </span>
                  ) : null}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-white disabled:opacity-30 dark:hover:bg-slate-800"
                  disabled={index === list.length - 1}
                  onClick={() => move(index, 1)}
                  title="Move down"
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

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                Label
              </span>
              <input
                className={inputClass}
                value={btn.label}
                onChange={(e) => updateAt(index, { label: e.target.value })}
                placeholder="e.g. Get started"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Style
                </span>
                <select
                  className={inputClass}
                  value={btn.variant}
                  onChange={(e) => updateAt(index, { variant: e.target.value })}
                >
                  {BUTTON_VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {BUTTON_VARIANT_LABELS[v] || v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Action
                </span>
                <select
                  className={inputClass}
                  value={btn.action_type}
                  onChange={(e) =>
                    updateAt(index, { action_type: e.target.value })
                  }
                >
                  {BUTTON_ACTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {BUTTON_ACTION_LABELS[t] || t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {btn.action_type === "url" ? (
              <>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    URL
                  </span>
                  <input
                    className={inputClass}
                    value={btn.target_url}
                    onChange={(e) =>
                      updateAt(index, { target_url: e.target.value })
                    }
                    placeholder="/courses or https://…"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(btn.open_in_new_tab)}
                    onChange={(e) =>
                      updateAt(index, { open_in_new_tab: e.target.checked })
                    }
                  />
                  Open in new tab
                </label>
              </>
            ) : null}

            {btn.action_type === "youtube" ? (
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  YouTube URL
                </span>
                <input
                  className={inputClass}
                  value={btn.target_url}
                  onChange={(e) =>
                    updateAt(index, { target_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=…"
                />
                <span className="mt-1 block text-[11px] text-slate-500">
                  Accepts watch, youtu.be, shorts, or embed links
                </span>
              </label>
            ) : null}

            {btn.action_type === "anchor" ? (
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Target id (without #)
                </span>
                <input
                  className={inputClass}
                  value={btn.target_id}
                  onChange={(e) =>
                    updateAt(index, { target_id: e.target.value })
                  }
                  placeholder="cms-section-…"
                />
              </label>
            ) : null}

            {btn.action_type === "form" ? (
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Form key
                </span>
                <input
                  className={inputClass}
                  value={btn.form_key}
                  onChange={(e) =>
                    updateAt(index, { form_key: e.target.value })
                  }
                  placeholder="contact"
                />
              </label>
            ) : null}

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={btn.status !== false}
                onChange={(e) => updateAt(index, { status: e.target.checked })}
              />
              Enabled
            </label>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addButton}
        className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
      >
        + Add button
      </button>
    </div>
  );
}
