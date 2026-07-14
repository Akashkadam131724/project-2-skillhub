"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchGlobalSearch } from "@/lib/api";

const CATALOG_LINKS = [
  {
    label: "Course Catalog",
    href: "/course-catalog",
    description: "Browse all courses with filters",
  },
  {
    label: "Vendors",
    href: "/vendors",
    description: "Technology partners & vendors",
  },
  {
    label: "Products",
    href: "/products",
    description: "Training products & learning paths",
  },
  {
    label: "Skilling Areas",
    href: "/skilling-areas",
    description: "Capability domains & skills",
  },
  {
    label: "Industries",
    href: "/industries",
    description: "Industry-aligned solutions",
  },
];

const TABS = [
  { id: "all", label: "All" },
  { id: "vendor", label: "Vendors" },
  { id: "product", label: "Products" },
  { id: "course", label: "Courses" },
  { id: "skillingArea", label: "Skilling" },
  { id: "industry", label: "Industries" },
  { id: "catalogs", label: "Catalogs" },
];

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

function ResultRow({ item, onSelect }) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="flex items-start gap-3 rounded-xl px-3 py-2.5 no-underline transition hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      {item.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logo}
          alt=""
          className="mt-0.5 size-8 shrink-0 rounded-md bg-white object-contain"
        />
      ) : (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          {item.name?.slice(0, 2)?.toUpperCase() || "?"}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink dark:text-white">
          {item.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
          {item.vendorName || item.description || item.type}
        </span>
      </span>
    </Link>
  );
}

function CatalogLinkRow({ item, onSelect }) {
  return (
    <Link
      href={item.href}
      onClick={onSelect}
      className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 no-underline transition hover:border-brand/40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink dark:text-white">
          {item.label}
        </span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
          {item.description}
        </span>
      </span>
      <span className="shrink-0 text-slate-400" aria-hidden="true">
        →
      </span>
    </Link>
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

    if (tab === "catalogs") {
      close();
      router.push("/course-catalog");
      return;
    }

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
    router.push(`/course-catalog?q=${encodeURIComponent(q)}`);
  }

  const q = value.trim();
  const hasQuery = q.length >= 2;
  const visibleGroups =
    tab === "all" || tab === "catalogs"
      ? groups
      : groups.filter((g) => g.type === tab);
  const visibleTotal = visibleGroups.reduce((sum, g) => sum + g.count, 0);
  const showCatalogs = tab === "all" || tab === "catalogs" || !hasQuery;
  const filteredCatalogs = !hasQuery
    ? CATALOG_LINKS
    : CATALOG_LINKS.filter(
        (link) =>
          link.label.toLowerCase().includes(q.toLowerCase()) ||
          link.description.toLowerCase().includes(q.toLowerCase())
      );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="Open search"
      >
        <SearchIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:pt-[14vh]">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer border-0 bg-slate-950/50"
            aria-label="Close search"
            onClick={close}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[81] flex max-h-[min(72vh,640px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="border-b border-slate-200 px-4 pt-4 pb-3 dark:border-slate-800">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2
                  id={titleId}
                  className="m-0 text-base font-bold text-ink dark:text-white"
                >
                  Search
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={onSubmit}>
                <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-brand/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:bg-slate-950">
                  <SearchIcon className="size-4 shrink-0 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search vendors, products, courses…"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  />
                </label>
              </form>

              <div className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
                {TABS.map((item) => {
                  const active = tab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
              {showCatalogs && filteredCatalogs.length > 0 && (
                <section className="mb-4">
                  <h3 className="m-0 px-1 pb-2 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                    Catalogs
                  </h3>
                  <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
                    {filteredCatalogs.map((link) => (
                      <li key={link.href}>
                        <CatalogLinkRow item={link} onSelect={close} />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {tab !== "catalogs" && hasQuery && (
                <>
                  {loading && (
                    <p className="m-0 px-1 py-4 text-sm text-slate-500">
                      Searching…
                    </p>
                  )}

                  {!loading && visibleTotal === 0 && (
                    <p className="m-0 px-1 py-4 text-sm text-slate-500">
                      No results for “{q}”
                    </p>
                  )}

                  {!loading &&
                    visibleGroups.map((group) => (
                      <section key={group.type} className="mb-3">
                        <h3 className="m-0 px-1 pb-1 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                          {group.label}
                        </h3>
                        <ul className="m-0 list-none p-0">
                          {group.items.map((item) => (
                            <li key={`${group.type}-${item.id}`}>
                              <ResultRow item={item} onSelect={close} />
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}

                  {!loading && visibleTotal > 0 && (
                    <div className="border-t border-slate-100 px-1 pt-3 dark:border-slate-800">
                      <Link
                        href={`/course-catalog?q=${encodeURIComponent(q)}`}
                        onClick={close}
                        className="text-xs font-semibold text-brand no-underline"
                      >
                        Search courses for “{q}”
                      </Link>
                    </div>
                  )}
                </>
              )}

              {tab !== "catalogs" && !hasQuery && (
                <p className="m-0 px-1 pt-1 text-sm text-slate-500">
                  Type at least 2 characters to search vendors, products,
                  courses, skilling areas, and industries.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
