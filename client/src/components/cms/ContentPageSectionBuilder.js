"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  buildCategoryOptions,
  FilterGroup,
  sectionCategory,
} from "@/components/cms/CmsSectionFilters";
import {
  EmptyState,
  SectionPreviewThumb,
  inputClass,
} from "@/components/cms/CmsUi";
import { CONTENT_PAGE_STARTERS } from "@/lib/content-page-starters";
import { mediaUrl } from "@/lib/cms-api";

function sectionScope(section) {
  const raw = String(section?.content_scope || "").toLowerCase().trim();
  if (raw === "global" || raw === "template" || raw === "page") return raw;
  return "page";
}

function newRow(sectionKey) {
  return {
    id: `${sectionKey}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    section_key: sectionKey,
  };
}

function moveRow(rows, index, delta) {
  const next = [...rows];
  const target = index + delta;
  if (target < 0 || target >= next.length) return rows;
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  return next;
}

function PageSectionList({ value, catalogByKey, disabled, onMove, onRemove }) {
  return (
    <ul className="m-0 max-h-[32rem] list-none space-y-2 overflow-y-auto p-3">
      {value.map((row, index) => {
        const meta = catalogByKey.get(row.section_key);
        const preview = mediaUrl(meta?.section_preview_img);
        return (
          <li
            key={row.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <span className="w-5 shrink-0 text-center text-[11px] font-semibold text-slate-400">
              {index + 1}
            </span>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="size-10 shrink-0 rounded object-cover"
              />
            ) : (
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] text-slate-500 dark:bg-slate-800">
                —
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                {meta?.name || row.section_key}
              </p>
              <p className="m-0 truncate text-[11px] text-slate-500">
                {row.section_key}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => onMove(index, -1)}
                className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] disabled:opacity-40 dark:border-slate-700"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={disabled || index === value.length - 1}
                onClick={() => onMove(index, 1)}
                className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] disabled:opacity-40 dark:border-slate-700"
                aria-label="Move down"
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(row.id)}
              className="shrink-0 rounded px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PageSectionPreviewStack({
  value,
  catalogByKey,
  disabled,
  onMove,
  onRemove,
}) {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {value.map((row, index) => {
        const meta = catalogByKey.get(row.section_key);
        const preview = mediaUrl(meta?.section_preview_img);
        return (
          <div key={row.id} className="group relative">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
              <button
                type="button"
                disabled={disabled || index === 0}
                onClick={() => onMove(index, -1)}
                className="rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-semibold shadow-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/95"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={disabled || index === value.length - 1}
                onClick={() => onMove(index, 1)}
                className="rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-semibold shadow-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/95"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(row.id)}
                className="rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/90 dark:text-rose-300"
              >
                Remove
              </button>
            </div>

            <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1">
              <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                #{index + 1}
              </span>
              <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {meta?.name || row.section_key}
              </span>
            </div>

            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={meta?.name || row.section_key}
                className="block h-auto w-full"
              />
            ) : (
              <div className="flex min-h-[120px] flex-col items-center justify-center bg-slate-100 px-4 py-10 text-center dark:bg-slate-900">
                <p className="m-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {meta?.name || row.section_key}
                </p>
                <p className="m-0 mt-1 text-xs text-slate-400">No preview image</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Local section list for new content pages — pick from catalog, reorder,
 * then parent saves via EntityPageSection on create.
 */
export default function ContentPageSectionBuilder({
  catalog = [],
  value = [],
  onChange,
  disabled = false,
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categorySearch, setCategorySearch] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [activeStarter, setActiveStarter] = useState("blank");
  const [showPreview, setShowPreview] = useState(false);

  const catalogByKey = useMemo(() => {
    const map = new Map();
    for (const s of catalog) map.set(s.key, s);
    return map;
  }, [catalog]);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(catalog),
    [catalog]
  );

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((s) => {
      if (s.status === false) return false;
      if (scopeFilter !== "all" && sectionScope(s) !== scopeFilter) {
        return false;
      }
      if (
        categoryFilter !== "all" &&
        sectionCategory(s) !== categoryFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        String(s.name || "").toLowerCase().includes(q) ||
        String(s.key || "").toLowerCase().includes(q)
      );
    });
  }, [catalog, categoryFilter, scopeFilter, search]);

  function applyStarter(starterKey) {
    setActiveStarter(starterKey);
    const starter = CONTENT_PAGE_STARTERS.find((s) => s.key === starterKey);
    const keys = starter?.sections || [];
    onChange?.(keys.map((key) => newRow(key)));
  }

  function addSection(sectionKey) {
    if (disabled) return;
    onChange?.([...value, newRow(sectionKey)]);
  }

  function removeRow(id) {
    onChange?.(value.filter((row) => row.id !== id));
  }

  function move(index, delta) {
    onChange?.(moveRow(value, index, delta));
  }

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-sm font-semibold text-slate-900 dark:text-white">
            Page sections
          </h3>
          <p className="m-0 mt-1 text-xs text-slate-500">
            Add sections from the library (left). Manage order on the right —
            toggle preview when you want the full layout mockup.
          </p>
        </div>
        <Link
          href="/sections"
          target="_blank"
          className="text-xs font-semibold text-brand no-underline hover:underline"
        >
          Browse live previews →
        </Link>
      </div>

      <div>
        <p className="m-0 mb-2 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          Starters
        </p>
        <div className="flex flex-wrap gap-2">
          {CONTENT_PAGE_STARTERS.map((starter) => {
            const active = activeStarter === starter.key;
            return (
              <button
                key={starter.key}
                type="button"
                disabled={disabled}
                onClick={() => applyStarter(starter.key)}
                className={`rounded-lg border px-3 py-2 text-left transition ${
                  active
                    ? "border-brand bg-brand/10 ring-2 ring-brand/20"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900"
                }`}
              >
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                  {starter.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {starter.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        {/* Narrow library picker with thumbs */}
        <div className="w-full max-w-[280px] rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="m-0 mb-2 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
            Add from library
          </p>
          <input
            className={`${inputClass} mb-2 !px-2 !py-1.5 !text-xs`}
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={disabled}
          />
          <div className="mb-2 rounded-md border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-950">
            <FilterGroup
              title="Category"
              search={categorySearch}
              onSearch={setCategorySearch}
              placeholder="Filter"
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              maxHeightClass="max-h-24"
            />
          </div>
          <div className="mb-2">
            <p className="m-0 mb-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Scope
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "All" },
                { value: "global", label: "Global" },
                { value: "template", label: "Template" },
                { value: "page", label: "Page" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setScopeFilter(opt.value)}
                  className={`rounded-full border px-2 py-1 text-[10px] font-semibold transition ${
                    scopeFilter === opt.value
                      ? "border-brand bg-brand text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {!filteredCatalog.length ? (
            <EmptyState message="No sections match." />
          ) : (
            <ul className="m-0 max-h-80 list-none space-y-1.5 overflow-y-auto p-0">
              {filteredCatalog.map((s) => (
                <li key={s.key}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => addSection(s.key)}
                    className="flex w-full gap-2 overflow-hidden rounded-lg border border-slate-200 bg-white text-left transition hover:border-brand/40 hover:ring-2 hover:ring-brand/15 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <SectionPreviewThumb
                      src={s.section_preview_img}
                      alt={s.name}
                      className="h-14 w-16 shrink-0"
                      rounded="rounded-none"
                    />
                    <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
                      <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {s.name || s.key}
                      </span>
                      <span className="truncate text-[10px] text-slate-400">
                        {s.key} · {sectionScope(s)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: list (default) or full preview stack */}
        <div className="min-w-0 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
            <div>
              <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                On this page ({value.length})
              </p>
              <p className="mt-0.5 mb-0 text-xs text-slate-400">
                {showPreview
                  ? "Full-width section preview images."
                  : "Reorder and remove sections."}
              </p>
            </div>
            <button
              type="button"
              disabled={!value.length}
              onClick={() => setShowPreview((v) => !v)}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                showPreview
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              } disabled:opacity-40`}
            >
              {showPreview ? "Show list" : "Show preview"}
            </button>
          </div>

          {!value.length ? (
            <div className="p-4">
              <EmptyState message="No sections yet. Pick a starter or add from the library." />
            </div>
          ) : showPreview ? (
            <PageSectionPreviewStack
              value={value}
              catalogByKey={catalogByKey}
              disabled={disabled}
              onMove={move}
              onRemove={removeRow}
            />
          ) : (
            <PageSectionList
              value={value}
              catalogByKey={catalogByKey}
              disabled={disabled}
              onMove={move}
              onRemove={removeRow}
            />
          )}
        </div>
      </div>
    </div>
  );
}
