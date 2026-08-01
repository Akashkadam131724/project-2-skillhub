"use client";

import { useRef, useState } from "react";
import {
  BUTTON_ACTION_LABELS,
  BUTTON_ACTION_TYPES,
  BUTTON_ICON_GROUPS,
  BUTTON_ICON_LABELS,
  BUTTON_ICON_POSITION_LABELS,
  BUTTON_ICON_POSITIONS,
  BUTTON_SHAPE_LABELS,
  BUTTON_SHAPES,
  BUTTON_SIZE_LABELS,
  BUTTON_SIZES,
  BUTTON_VARIANT_LABELS,
  BUTTON_VARIANTS,
  BUTTON_DARK_CTA_PRESETS,
  normalizeButton,
} from "@/lib/utils/button-types";
import DsButton from "@/components/ui/DsButton";
import ButtonAppearanceFields from "@/components/cms/editors/ButtonAppearanceFields";
import DragHandleIcon from "@/components/icons/DragHandleIcon";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900";

let draftKeySeq = 0;
function nextDraftKey() {
  draftKeySeq += 1;
  return `btn-draft-${Date.now()}-${draftKeySeq}`;
}

function emptyButton(sort_order = 0) {
  return {
    ...normalizeButton({ label: "", sort_order }),
    _key: nextDraftKey(),
  };
}

/** Normalize API / legacy button objects for the editor */
export function normalizeButtonsDraft(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons.map((b, i) => ({
    ...emptyButton(i),
    ...b,
    _key: b?._key || b?._id || b?.id || nextDraftKey(),
    _id: b?._id || b?.id,
    ...normalizeButton(b),
  }));
}

function isMongoId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || ""));
}

export function serializeButtonsDraft(draft) {
  return (draft || [])
    .filter((b) => String(b.label || "").trim())
    .map((b, i) => {
      const normalized = normalizeButton({ ...b, sort_order: i });
      const usesTargetUrl = [
        "url",
        "youtube",
        "email",
        "phone",
        "download",
      ].includes(normalized.action_type);
      const out = {
        label: normalized.label,
        variant: normalized.variant,
        size: normalized.size,
        shape: normalized.shape,
        icon: normalized.icon,
        icon_position: normalized.icon_position,
        action_type: normalized.action_type,
        target_url: usesTargetUrl ? normalized.target_url : "",
        target_id:
          normalized.action_type === "anchor" ? normalized.target_id : "",
        form_key:
          normalized.action_type === "form" ? normalized.form_key : "",
        open_in_new_tab: normalized.open_in_new_tab,
        full_width: normalized.full_width,
        aria_label: normalized.aria_label,
        download_filename:
          normalized.action_type === "download"
            ? normalized.download_filename
            : "",
        cls_bg: normalized.cls_bg,
        cls_text: normalized.cls_text,
        cls_border: normalized.cls_border,
        cls_hover_bg: normalized.cls_hover_bg,
        cls_hover_text: normalized.cls_hover_text,
        cls_hover_border: normalized.cls_hover_border,
        sort_order: i,
        status: normalized.status,
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

function ButtonDesignPreview({ button }) {
  const normalized = normalizeButton(button);
  if (!normalized.label) {
    return (
      <p className="m-0 text-[11px] text-slate-400 italic">
        Enter a label to preview
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        Preview
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div
          className="flex min-h-[4.5rem] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700"
          data-light-surface
        >
          <span className="w-full text-[10px] font-medium text-slate-400">
            Light section
          </span>
          <DsButton button={normalized} preview surface="light" />
        </div>
        <div
          className="flex min-h-[4.5rem] flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 p-3"
          data-section-theme="dark"
        >
          <span className="w-full text-[10px] font-medium text-white/50">
            Dark section
          </span>
          <DsButton button={normalized} preview surface="dark" />
        </div>
      </div>
    </div>
  );
}

/**
 * Multi-button editor for page-section mappings.
 * Drag the handle to reorder; ↑/↓ still available.
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
    commit((prev) =>
      prev.map((b, i) => (i === index ? normalizeButton({ ...b, ...patch }) : b))
    );
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

  function addDarkCtaPair() {
    commit((prev) => {
      const start = prev.length;
      const pair = BUTTON_DARK_CTA_PRESETS.map((preset, i) =>
        normalizeButton({
          ...emptyButton(start + i),
          label: preset.label,
          variant: preset.variant,
          size: "md",
          shape: "rounded",
          icon: "none",
          action_type: "url",
          target_url: "/",
        })
      );
      return [...prev, ...pair];
    });
  }

  function onDragStart(index, e) {
    dragIndexRef.current = index;
    setDragIndex(index);
    setOverIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
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
      dragIndexRef.current ?? Number(e.dataTransfer.getData("text/plain"));
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
        const isOver =
          overIndex === index && dragIndex !== null && dragIndex !== index;

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

            <ButtonDesignPreview button={btn} />

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
                  Button style
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

            <ButtonAppearanceFields
              value={btn}
              onPatch={(patch) => updateAt(index, patch)}
            />

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Size
                </span>
                <select
                  className={inputClass}
                  value={btn.size || "md"}
                  onChange={(e) => updateAt(index, { size: e.target.value })}
                >
                  {BUTTON_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {BUTTON_SIZE_LABELS[s] || s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Shape
                </span>
                <select
                  className={inputClass}
                  value={btn.shape || "rounded"}
                  onChange={(e) => updateAt(index, { shape: e.target.value })}
                >
                  {BUTTON_SHAPES.map((s) => (
                    <option key={s} value={s}>
                      {BUTTON_SHAPE_LABELS[s] || s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Icon
                </span>
                <select
                  className={inputClass}
                  value={btn.icon || "auto"}
                  onChange={(e) => updateAt(index, { icon: e.target.value })}
                >
                  {BUTTON_ICON_GROUPS.map((group) => (
                    <optgroup key={group.id} label={group.label}>
                      {group.icons.map((iconKey) => (
                        <option key={iconKey} value={iconKey}>
                          {BUTTON_ICON_LABELS[iconKey] || iconKey}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Icon position
                </span>
                <select
                  className={inputClass}
                  value={btn.icon_position || "start"}
                  onChange={(e) =>
                    updateAt(index, { icon_position: e.target.value })
                  }
                  disabled={(btn.icon || "auto") === "none"}
                >
                  {BUTTON_ICON_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {BUTTON_ICON_POSITION_LABELS[pos] || pos}
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

            {btn.action_type === "email" ? (
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Email address
                </span>
                <input
                  className={inputClass}
                  type="email"
                  value={btn.target_url}
                  onChange={(e) =>
                    updateAt(index, { target_url: e.target.value })
                  }
                  placeholder="hello@example.com"
                />
              </label>
            ) : null}

            {btn.action_type === "phone" ? (
              <label className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                  Phone number
                </span>
                <input
                  className={inputClass}
                  type="tel"
                  value={btn.target_url}
                  onChange={(e) =>
                    updateAt(index, { target_url: e.target.value })
                  }
                  placeholder="+1 800 555 0100"
                />
              </label>
            ) : null}

            {btn.action_type === "download" ? (
              <>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    File URL
                  </span>
                  <input
                    className={inputClass}
                    value={btn.target_url}
                    onChange={(e) =>
                      updateAt(index, { target_url: e.target.value })
                    }
                    placeholder="/uploads/brochure.pdf"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                    Download filename (optional)
                  </span>
                  <input
                    className={inputClass}
                    value={btn.download_filename || ""}
                    onChange={(e) =>
                      updateAt(index, { download_filename: e.target.value })
                    }
                    placeholder="skillhub-brochure.pdf"
                  />
                </label>
              </>
            ) : null}

            {btn.action_type === "scroll_top" ? (
              <p className="m-0 text-[11px] text-slate-500">
                Scrolls the visitor smoothly to the top of the page. No extra
                fields needed.
              </p>
            ) : null}

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-200">
                Accessibility label (optional)
              </span>
              <input
                className={inputClass}
                value={btn.aria_label || ""}
                onChange={(e) =>
                  updateAt(index, { aria_label: e.target.value })
                }
                placeholder="Overrides visible label for screen readers"
              />
            </label>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={Boolean(btn.full_width)}
                  onChange={(e) =>
                    updateAt(index, { full_width: e.target.checked })
                  }
                />
                Full width
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={btn.status !== false}
                  onChange={(e) => updateAt(index, { status: e.target.checked })}
                />
                Enabled
              </label>
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addButton}
          className="min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
        >
          + Add button
        </button>
        <button
          type="button"
          onClick={addDarkCtaPair}
          className="min-w-0 flex-1 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-brand hover:text-brand dark:border-slate-600 dark:text-slate-300"
          title="Adds a white primary + white-outline secondary for dark bands"
        >
          + Dark outline CTAs
        </button>
      </div>
    </div>
  );
}
