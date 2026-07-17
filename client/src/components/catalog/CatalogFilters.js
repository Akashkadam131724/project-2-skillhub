"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";
import { applyLockedParams } from "@/lib/catalogParams";

function Chevron({ open }) {
  return (
    <svg
      className={`size-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
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

  return (
    <section className="border-t border-slate-200 pt-4 dark:border-slate-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-bold text-ink dark:text-white">
          {title}
        </span>
        <Chevron open={open} />
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
              const checked = selectedIds.includes(id);
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
                      className="size-4 shrink-0 cursor-pointer appearance-none rounded-[3px] border border-slate-300 bg-white checked:border-brand checked:bg-brand checked:bg-[length:0.7rem] checked:bg-center checked:bg-no-repeat checked:bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%2016%2016%27%20fill%3D%27white%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M6.2%2011.4%202.8%208l1.1-1.1%202.3%202.3%205-5L12.3%205.3z%27/%3E%3C/svg%3E')] disabled:cursor-not-allowed disabled:opacity-50"
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

function parseList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
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
          const items = term
            ? (group.options || []).filter((opt) =>
                String(opt.label || "")
                  .toLowerCase()
                  .includes(term)
              )
            : group.options || [];

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
              selectedIds={selectedByKey[group.key] || []}
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

  const lockedKeySet = useMemo(
    () => new Set(lockedKeys.length ? lockedKeys : Object.keys(lockedParams)),
    [lockedKeys, lockedParams]
  );

  const selectedByKey = useMemo(() => {
    const map = {};
    for (const group of groups) {
      map[group.key] = parseList(searchParams.get(group.key));
    }
    return map;
  }, [groups, searchParams]);

  const hasFilters = useMemo(() => {
    if (searchParams.get("q")) return true;
    return groups.some((group) => {
      if (lockedKeySet.has(group.key)) return false;
      return (selectedByKey[group.key] || []).length > 0;
    });
  }, [groups, selectedByKey, searchParams, lockedKeySet]);

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
      router.push(qs ? `${pathname}?${qs}` : pathname);
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

    updateParams((params) => {
      const current = parseList(params.get(key));
      const next = current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id];

      if (next.length) params.set(key, next.join(","));
      else params.delete(key);

      clearKeys.forEach((k) => {
        if (!lockedKeySet.has(k)) params.delete(k);
      });
    });
  }

  function clearAll() {
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
    selectedByKey,
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
        />
        <span className="text-sm font-semibold text-ink dark:text-white">
          Filters
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
