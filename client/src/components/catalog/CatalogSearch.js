"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  applyLockedParams,
} from "@/lib/api/catalogParams";
import { scrollToCatalogAnchor } from "@/lib/catalog/scrollAnchor";
import SearchIcon from "@/components/icons/SearchIcon";
import CloseIcon from "@/components/icons/CloseIcon";

export default function CatalogSearch({
  placeholder = "Search and press Enter",
  lockedParams = {},
  scrollTargetId,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  function scrollToResults() {
    scrollToCatalogAnchor(scrollTargetId);
  }

  function runSearch(nextValue = value) {
    const params = new URLSearchParams(searchParams.toString());
    const q = nextValue.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    applyLockedParams(params, lockedParams);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      requestAnimationFrame(scrollToResults);
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    runSearch();
  }

  function onClear() {
    setValue("");
    runSearch("");
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-md sm:max-w-lg ${isPending ? "opacity-70" : ""}`}
    >
      <label className="group flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/90 px-3 shadow-sm shadow-slate-900/[0.03] transition focus-within:border-brand/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-none dark:focus-within:bg-slate-950">
        <SearchIcon className="size-4 shrink-0 text-slate-400 transition group-focus-within:text-brand" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-200/80 text-slate-500 transition hover:bg-slate-300 hover:text-ink dark:bg-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
            aria-label="Clear search"
          >
            <CloseIcon className="size-3.5" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-400 sm:inline-block dark:border-slate-600 dark:bg-slate-800">
            Enter
          </kbd>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-brand text-white transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <SearchIcon className="size-3.5" />
        </button>
      </label>
    </form>
  );
}
