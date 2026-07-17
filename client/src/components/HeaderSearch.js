"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchGlobalSearch } from "@/lib/api";
import { mediaAlt } from "@/lib/media-alt";

const TABS = [
  { id: "all", label: "All" },
  { id: "vendor", label: "Vendors" },
  { id: "product", label: "Products" },
  { id: "course", label: "Courses" },
  { id: "skillingArea", label: "Skilling" },
  { id: "industry", label: "Industries" },
  { id: "content", label: "Pages" },
];

const TYPE_META = {
  vendor: { label: "Vendor", tone: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300" },
  product: {
    label: "Product",
    tone: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  },
  course: {
    label: "Course",
    tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  skillingArea: {
    label: "Skilling",
    tone: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  industry: {
    label: "Industry",
    tone: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
  content: {
    label: "Page",
    tone: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
};

function SearchIcon({ className = "size-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 20L16.65 16.65"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-slate-300 transition group-hover:text-brand dark:text-slate-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResultRow({ item, onSelect }) {
  const meta = TYPE_META[item.type] || TYPE_META.content;
  const subtitle =
    item.vendorName || item.description || item.path || meta.label;

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition hover:bg-slate-50 dark:hover:bg-slate-900/80"
    >
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt={mediaAlt(item.name, "Search result")}
          className="size-10 shrink-0 rounded-lg border border-slate-100 bg-white object-contain p-1 dark:border-slate-800"
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-[family-name:var(--font-display)] text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {item.name?.slice(0, 2)?.toUpperCase() || "?"}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-ink dark:text-white">
            {item.name}
          </span>
          <span
            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${meta.tone}`}
          >
            {meta.label}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </span>
      </span>
      <ArrowIcon />
    </Link>
  );
}

function EmptyState({ hasQuery, q }) {
  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          <SearchIcon className="size-5" />
        </span>
        <p className="m-0 text-sm font-semibold text-ink dark:text-white">
          Search the catalog
        </p>
        <p className="mt-1.5 mb-0 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Find vendors, products, courses, industries, skilling areas, and
          pages. Type at least 2 characters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <p className="m-0 text-sm font-semibold text-ink dark:text-white">
        No matches for “{q}”
      </p>
      <p className="mt-1.5 mb-0 text-sm text-slate-500 dark:text-slate-400">
        Try another keyword, or browse the course catalog.
      </p>
      <Link
        href={`/courses?q=${encodeURIComponent(q)}`}
        className="mt-4 inline-flex items-center rounded-xl bg-ink px-3.5 py-2 text-xs font-semibold text-white no-underline transition hover:bg-brand dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white"
      >
        Search courses
      </Link>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2 px-1 py-1" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
        >
          <div className="size-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HeaderSearch() {
  const router = useRouter();
  const titleId = useId();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => inputRef.current?.focus(), 40);

    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const q = value.trim();
    if (q.length < 2) {
      setGroups([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await fetchGlobalSearch({ q, limit: 8 });
        if (cancelled) return;
        setGroups(data.groups || []);
        setTotal(data.total || 0);
      } catch {
        if (cancelled) return;
        setGroups([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, open]);

  function close() {
    setOpen(false);
  }

  function openSearch() {
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;

    if (tab !== "all") {
      const group = groups.find((g) => g.type === tab);
      if (group?.items?.[0]) {
        close();
        router.push(group.items[0].href);
        return;
      }
    }

    if (groups[0]?.items?.[0]) {
      close();
      router.push(groups[0].items[0].href);
      return;
    }

    close();
    router.push(`/courses?q=${encodeURIComponent(q)}`);
  }

  const q = value.trim();
  const hasQuery = q.length >= 2;
  const visibleGroups =
    tab === "all" ? groups : groups.filter((g) => g.type === tab);
  const visibleTotal = visibleGroups.reduce((sum, g) => sum + g.count, 0);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-ink transition hover:border-ink/20 hover:bg-white hover:text-brand dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:hover:bg-slate-900"
        aria-label="Open search"
      >
        <SearchIcon className="size-[1.15rem]" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[8vh] sm:px-4 sm:pt-[10vh]">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer border-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label="Close search"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[81] flex max-h-[min(78vh,680px)] w-full max-w-xl flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_32px_80px_-24px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="border-b border-slate-100 px-4 pt-4 pb-3 dark:border-slate-800">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2
                    id={titleId}
                    className="m-0 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-ink dark:text-white"
                  >
                    Search
                  </h2>
                  <p className="mt-0.5 mb-0 text-xs text-slate-400">
                    {hasQuery && !loading
                      ? `${visibleTotal} result${visibleTotal === 1 ? "" : "s"}`
                      : "Vendors · products · courses · pages"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-ink dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={onSubmit}>
                <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3.5 transition focus-within:border-brand/35 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand/10 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-950">
                  <SearchIcon className="size-4 shrink-0 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search vendors, courses, pages…"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                    autoComplete="off"
                  />
                  {value ? (
                    <button
                      type="button"
                      onClick={() => setValue("")}
                      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-200/80 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                      aria-label="Clear search"
                    >
                      <CloseIcon />
                    </button>
                  ) : (
                    <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-slate-400 sm:inline-block dark:border-slate-600 dark:bg-slate-800">
                      ESC
                    </kbd>
                  )}
                </label>
              </form>

              <div
                role="tablist"
                aria-label="Search filters"
                className="mt-3 flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {TABS.map((item) => {
                  const active = tab === item.id;
                  const count =
                    item.id === "all"
                      ? total
                      : groups.find((g) => g.type === item.id)?.count || 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(item.id)}
                      className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "bg-ink text-white dark:bg-white dark:text-ink"
                          : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      {item.label}
                      {hasQuery && !loading && count > 0 ? (
                        <span
                          className={`rounded-full px-1.5 py-px text-[10px] font-bold ${
                            active
                              ? "bg-white/20 text-white dark:bg-ink/10 dark:text-ink"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }`}
                        >
                          {count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3">
              {loading && <LoadingRows />}

              {!loading && (!hasQuery || visibleTotal === 0) && (
                <EmptyState hasQuery={hasQuery} q={q} />
              )}

              {!loading &&
                hasQuery &&
                visibleTotal > 0 &&
                visibleGroups.map((group) => (
                  <section key={group.type} className="mb-2">
                    <div className="sticky top-0 z-[1] flex items-center justify-between bg-white/95 px-3 py-2 backdrop-blur dark:bg-slate-950/95">
                      <h3 className="m-0 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                        {group.label}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">
                        {group.count}
                      </span>
                    </div>
                    <ul className="m-0 list-none p-0">
                      {group.items.map((item) => (
                        <li key={`${group.type}-${item.id}`}>
                          <ResultRow item={item} onSelect={close} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
            </div>

            {hasQuery && !loading && visibleTotal > 0 ? (
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="m-0 text-xs text-slate-400">
                  Enter opens the top match
                </p>
                <Link
                  href={`/courses?q=${encodeURIComponent(q)}`}
                  onClick={close}
                  className="text-xs font-semibold text-brand no-underline hover:underline"
                >
                  Browse courses for “{q}”
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
