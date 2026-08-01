"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";
import { applyLockedParams } from "@/lib/api/catalogParams";
import { scrollToCatalogAnchor } from "@/lib/catalog/scrollAnchor";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeId(value) {
  return String(value || "").trim();
}

function isOptionSelected(option, selectedIds) {
  const selected = selectedIds.map(normalizeId);
  const id = normalizeId(option?.id);
  if (id && selected.includes(id)) return true;
  const slug = normalizeId(option?.slug);
  if (slug && selected.includes(slug)) return true;
  return false;
}

function FilterAccordion({
  title,
  searchPlaceholder,
  searchable,
  searchValue,
  onSearchChange,
  items,
  selectedIds,
  onToggle,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const activeCount = selectedIds.length;

  return (
    <section
      className={`border-t border-slate-200 pt-4 dark:border-slate-700 ${
        activeCount ? "border-brand/20" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-base font-bold ${
            activeCount
              ? "text-brand dark:text-brand"
              : "text-ink dark:text-white"
          }`}
        >
          {title}
          {activeCount ? (
            <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={`size-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {searchable && (
            <div className="relative mb-3">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand/40 focus:bg-white focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          )}

          <ul className="m-0 grid max-h-[140px] list-none gap-2 overflow-auto p-0">
            {items.map((item) => {
              const id = String(item.id);
              const checked = isOptionSelected(item, selectedIds);
              const empty = typeof item.count === "number" && item.count === 0;
              const disabled = empty && !checked;
              return (
                <li key={id}>
                  <label
                    className={`flex cursor-pointer items-center gap-2.5 text-sm ${
                      disabled
                        ? "cursor-not-allowed text-slate-400 dark:text-slate-500"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onToggle(id)}
                      className="size-4 shrink-0 cursor-pointer rounded accent-brand disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="min-w-0 flex-1 leading-snug">
                      {item.label}
                    </span>
                    {typeof item.count === "number" && (
                      <span className="shrink-0 text-xs tabular-nums text-slate-400">
                        {item.count}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
            {items.length === 0 && (
              <li className="text-sm text-slate-400">No matches</li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}

function FiltersPanel({
  groups,
  searches,
  setSearch,
  selectedByKey,
  toggleOption,
  hasFilters,
  clearAll,
  isPending,
  className = "",
}) {
  return (
    <div
      className={`rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50 ${isPending ? "opacity-70" : ""} ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold text-ink dark:text-white">
          Filters
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer border-0 bg-transparent text-sm font-medium text-brand"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {groups.map((group) => {
          const term = (searches[group.key] || "").trim().toLowerCase();
          const selectedIds = selectedByKey[group.key] || [];
          const selectedSet = new Set(selectedIds.map(normalizeId));
          const options = group.options || [];
          const items = term
            ? options.filter((opt) => {
                const id = normalizeId(opt.id);
                if (id && selectedSet.has(id)) return true;
                const slug = normalizeId(opt.slug);
                if (slug && selectedSet.has(slug)) return true;
                return String(opt.label || "")
                  .toLowerCase()
                  .includes(term);
              })
            : options;

          return (
            <FilterAccordion
              key={group.key}
              title={group.label}
              searchable={group.searchable !== false}
              searchPlaceholder={
                group.searchPlaceholder || `Search ${group.label}`
              }
              searchValue={searches[group.key] || ""}
              onSearchChange={(value) => setSearch(group.key, value)}
              items={items}
              selectedIds={selectedIds}
              onToggle={(id) =>
                toggleOption(group.key, id, group.clearKeys || [])
              }
              defaultOpen={group.defaultOpen !== false}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renders filter groups from the backend schema.
 * Locked keys stay applied server-side and are not shown or cleared.
 */
export default function CatalogFilters({
  groups = [],
  lockedParams = {},
  lockedKeys = [],
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searches, setSearches] = useState({});
  const [pendingSelections, setPendingSelections] = useState({});

  const lockedKeySet = useMemo(
    () => new Set(lockedKeys.length ? lockedKeys : Object.keys(lockedParams)),
    [lockedKeys, lockedParams]
  );

  const paramsKey = searchParams.toString();

  const selectedByKey = useMemo(() => {
    const map = {};
    for (const group of groups) {
      const fromUrl = parseList(searchParams.get(group.key)).map(normalizeId);
      const fromLocked =
        lockedKeySet.has(group.key) && lockedParams[group.key] != null
          ? parseList(lockedParams[group.key]).map(normalizeId)
          : [];
      map[group.key] = [...new Set([...fromUrl, ...fromLocked])];
    }
    return map;
  }, [groups, paramsKey, searchParams, lockedKeySet, lockedParams]);

  useEffect(() => {
    setPendingSelections({});
  }, [paramsKey]);

  const effectiveSelectedByKey = useMemo(() => {
    const map = { ...selectedByKey };
    for (const [key, ids] of Object.entries(pendingSelections)) {
      if (Array.isArray(ids)) map[key] = ids;
    }
    return map;
  }, [selectedByKey, pendingSelections]);

  const hasFilters = useMemo(() => {
    if (searchParams.get("q")) return true;
    return groups.some((group) => {
      if (lockedKeySet.has(group.key)) return false;
      return (effectiveSelectedByKey[group.key] || []).length > 0;
    });
  }, [groups, effectiveSelectedByKey, searchParams, lockedKeySet]);

  function pushParams(params) {
    applyLockedParams(params, lockedParams);
    lockedKeySet.forEach((key) => {
      // Prefer lockedParams values; drop any user overrides for locked keys
      if (!(key in lockedParams) || lockedParams[key] == null) {
        params.delete(key);
      }
    });
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      requestAnimationFrame(() => scrollToCatalogAnchor());
    });
  }

  function updateParams(mutate) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    pushParams(params);
  }

  function toggleOption(key, id, clearKeys = []) {
    if (lockedKeySet.has(key)) return;

    const current = (
      pendingSelections[key] ??
      selectedByKey[key] ??
      []
    ).map(normalizeId);
    const normId = normalizeId(id);
    const next = current.includes(normId)
      ? current.filter((v) => v !== normId)
      : [...current, normId];

    setPendingSelections((prev) => {
      const pending = { ...prev, [key]: next };
      clearKeys.forEach((k) => {
        if (!lockedKeySet.has(k)) delete pending[k];
      });
      return pending;
    });

    updateParams((params) => {
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);

      clearKeys.forEach((k) => {
        if (!lockedKeySet.has(k)) params.delete(k);
      });
    });
  }

  function clearAll() {
    setPendingSelections({});
    const params = new URLSearchParams();
    pushParams(params);
  }

  function setSearch(key, value) {
    setSearches((prev) => ({ ...prev, [key]: value }));
  }

  if (!groups.length) {
    return null;
  }

  const panelProps = {
    groups,
    searches,
    setSearch,
    selectedByKey: effectiveSelectedByKey,
    toggleOption,
    hasFilters,
    clearAll,
    isPending,
  };

  return (
    <>
      <div className="mb-3 flex items-center gap-2 lg:hidden">
        <HamburgerButton
          label="Open filters"
          onClick={() => setDrawerOpen(true)}
          active={hasFilters}
        />
        <span
          className={`text-sm font-semibold ${
            hasFilters ? "text-brand" : "text-ink dark:text-white"
          }`}
        >
          Filters
          {hasFilters ? " (active)" : ""}
        </span>
      </div>

      <div className="hidden lg:block">
        <FiltersPanel {...panelProps} />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        side="left"
      >
        <FiltersPanel {...panelProps} className="border-0 p-0 shadow-none" />
      </Drawer>
    </>
  );
}
