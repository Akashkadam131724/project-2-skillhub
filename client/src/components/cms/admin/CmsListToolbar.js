"use client";

import { useEffect } from "react";
import { CMS_LIST_FILTERS } from "@/lib/cms/cms-list-filters";
import { DEFAULT_SEARCH_DEBOUNCE_MS } from "@/hooks/useDebouncedValue";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { inputClass } from "@/components/cms/admin/CmsUi";

const tabClass = (active) =>
  `rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
    active
      ? "bg-brand text-white"
      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
  }`;

export default function CmsListToolbar({
  onSearchChange,
  debounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  filter,
  onFilterChange,
  activeTotal,
  loading = false,
  searchPlaceholder = "Search…",
}) {
  const { value, setValue, debouncedValue } = useDebouncedSearch("", debounceMs);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {CMS_LIST_FILTERS.map((tab) => {
          const showCount =
            filter === tab.id && !loading && typeof activeTotal === "number";
          return (
            <button
              key={tab.id}
              type="button"
              className={tabClass(filter === tab.id)}
              onClick={() => onFilterChange(tab.id)}
            >
              {tab.label}
              {showCount ? <span className="ml-1 opacity-90">({activeTotal})</span> : null}
            </button>
          );
        })}
      </div>
      <input
        className={`${inputClass} w-full sm:max-w-xs`}
        placeholder={searchPlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
