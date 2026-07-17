"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";

function isInternalHref(url) {
  return typeof url === "string" && url.startsWith("/") && !url.startsWith("//");
}

function Chevron({ open }) {
  return (
    <svg
      className={`size-3.5 transition ${open ? "rotate-180 text-brand" : "text-slate-400"}`}
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

function NavLink({ href, className, onClick, children }) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

const ACCENTS = [
  "from-ink to-brand",
  "from-brand to-ink",
  "from-ink via-brand to-ink",
];

/**
 * Spotlight mega menu — vertical column rail + large destination cards.
 * Colors use theme tokens only (`ink` / `brand`).
 */
function MegaPanel({ item, columns, onNavigate }) {
  const [activeCol, setActiveCol] = useState(0);
  const safeIndex = Math.min(activeCol, Math.max(columns.length - 1, 0));
  const active = columns[safeIndex];
  const links = active?.navLinks || [];
  const accent = ACCENTS[safeIndex % ACCENTS.length];

  useEffect(() => {
    setActiveCol(0);
  }, [item?._id, columns.length]);

  return (
    <div className="flex h-full min-h-0 max-h-[inherit] flex-col overflow-hidden">
      <div
        className={`relative shrink-0 bg-gradient-to-br ${accent} px-5 py-4 text-white`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 90% at 80% 20%, black, transparent)",
          }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="m-0 text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase">
              Menu · {item.name}
            </p>
            <p className="mt-1.5 mb-0 font-[family-name:var(--font-display)] text-2xl leading-none font-semibold tracking-tight sm:text-3xl">
              {active?.name || "Explore"}
            </p>
          </div>
          <p className="m-0 text-sm text-white/70">
            {links.length} destination{links.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 overflow-hidden bg-white lg:grid-cols-[minmax(18rem,28%)_minmax(0,1fr)] dark:bg-slate-950">
        <aside className="w-full shrink-0 border-b border-slate-200 p-3 lg:overflow-y-auto lg:border-r lg:border-b-0 dark:border-slate-800">
          <p className="m-0 mb-2 px-2 text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
            Categories
          </p>
          <ul className="m-0 flex w-full list-none flex-col gap-1.5 p-0">
            {columns.map((column, i) => {
              const on = i === safeIndex;
              return (
                <li key={String(column._id)} className="w-full">
                  <button
                    type="button"
                    onClick={() => setActiveCol(i)}
                    className={`flex w-full cursor-pointer items-start gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition ${
                      on
                        ? "border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink"
                        : "border-transparent bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                        on
                          ? "bg-white/15 text-white dark:bg-ink/10 dark:text-ink"
                          : "bg-white text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 whitespace-normal text-sm leading-snug font-semibold break-words">
                      {column.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {links.length ? (
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {links.map((link, i) => (
                <li key={String(link._id)} className={i === 0 ? "sm:col-span-2" : ""}>
                  <NavLink
                    href={link.url || "#"}
                    onClick={onNavigate}
                    className={`group relative flex h-full overflow-hidden rounded-[1.35rem] border border-slate-200/90 no-underline transition hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_color-mix(in_srgb,var(--ink)_45%,transparent)] dark:border-slate-800 dark:hover:border-white/20 ${
                      i === 0
                        ? "min-h-[8.5rem] bg-slate-50 dark:bg-slate-900"
                        : "min-h-[6.5rem] bg-white dark:bg-slate-950"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${accent}`}
                    />
                    <span className="relative flex flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
                      <span className="flex items-start justify-between gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-ink text-xs font-bold text-white dark:bg-white dark:text-ink">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                          {active?.name || "Link"}
                        </span>
                      </span>
                      <span>
                        <span className="block font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-ink transition group-hover:text-brand dark:text-white sm:text-2xl">
                          {link.name}
                        </span>
                        {link.description ? (
                          <span className="mt-1.5 block text-sm text-slate-500 dark:text-slate-400">
                            {link.description}
                          </span>
                        ) : null}
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink dark:text-white">
                        Open
                        <span
                          aria-hidden
                          className="transition group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </span>
                    {i === 0 ? (
                      <span
                        aria-hidden
                        className="absolute -right-8 -bottom-10 size-36 rounded-full bg-brand/20"
                      />
                    ) : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="m-0 rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400 dark:border-slate-700">
              No links in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileColumnList({ column, onNavigate }) {
  const links = column.navLinks || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-3.5 py-2.5 text-[11px] font-bold tracking-[0.14em] text-brand uppercase dark:border-slate-800">
        {column.name}
      </div>
      <ul className="m-0 list-none p-2">
        {links.map((link, i) => (
          <li key={String(link._id)}>
            <NavLink
              href={link.url || "#"}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 no-underline hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-ink text-[10px] font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink dark:text-white">
                  {link.name}
                </span>
                {link.description ? (
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {link.description}
                  </span>
                ) : null}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DesktopNav({ navigation }) {
  const [openId, setOpenId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const openItem = useMemo(
    () => navigation.find((item) => String(item._id) === openId) || null,
    [navigation, openId]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onDocClick(event) {
      const t = event.target;
      if (navRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpenId(null);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpenId(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={navRef} className="relative">
      <ul className="m-0 flex list-none items-center justify-center gap-0.5 p-0">
        {navigation.map((item) => {
          const id = String(item._id);
          const isOpen = openId === id;
          return (
            <li key={id}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(isOpen ? null : id);
                }}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 px-3.5 py-2 text-sm font-semibold transition ${
                  isOpen
                    ? "bg-ink text-white dark:bg-white dark:text-ink"
                    : "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <span>{item.name}</span>
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {mounted && openItem
        ? createPortal(
            <div
              ref={panelRef}
              className="fixed top-[calc(var(--site-header-h,4.75rem)+0.75rem)] left-1/2 z-[60] flex max-h-[calc(100vh-var(--site-header-h,4.75rem)-1.5rem)] w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_34px_100px_-36px_color-mix(in_srgb,var(--ink)_55%,transparent)] animate-[megaIn_180ms_ease-out] dark:border-slate-700 dark:bg-slate-950 dark:shadow-[0_34px_100px_-36px_color-mix(in_srgb,var(--ink)_80%,transparent)]"
              onClick={(e) => e.stopPropagation()}
            >
              {openItem.columns?.length ? (
                <MegaPanel
                  item={openItem}
                  columns={openItem.columns}
                  onNavigate={() => setOpenId(null)}
                />
              ) : (
                <p className="m-0 p-5 text-sm text-slate-400">No columns</p>
              )}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function MobileNavSections({ navigation, onNavigate }) {
  const [openId, setOpenId] = useState(null);

  return (
    <ul className="m-0 grid list-none gap-2.5 p-0">
      {navigation.map((item) => {
        const id = String(item._id);
        const isOpen = openId === id;
        return (
          <li
            key={id}
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : id)}
              className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-4 py-3.5 text-left text-sm font-semibold text-ink dark:text-white"
            >
              <span>{item.name}</span>
              <Chevron open={isOpen} />
            </button>
            {isOpen && (
              <div className="grid gap-2.5 border-t border-slate-100 px-3 py-3 dark:border-slate-800">
                {item.columns?.length ? (
                  item.columns.map((column) => (
                    <MobileColumnList
                      key={String(column._id)}
                      column={column}
                      onNavigate={onNavigate}
                    />
                  ))
                ) : (
                  <p className="m-0 text-sm text-slate-400">No columns</p>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteHeaderNav({
  navigation,
  showDesktop = true,
  showMobile = true,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!navigation?.length) {
    if (!showDesktop) return null;
    return (
      <p className="m-0 hidden text-sm text-slate-400 lg:block">
        No navigation items.
      </p>
    );
  }

  return (
    <>
      {showMobile ? (
        <div className="lg:hidden">
          <HamburgerButton
            label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          />
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Menu"
            side="left"
          >
            <div className="mb-4 overflow-hidden rounded-2xl bg-ink p-4 text-white">
              <p className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
                Explore SkillHub
              </p>
              <p className="mt-1 mb-0 text-sm text-white/65">
                Courses, vendors, and solutions in one place.
              </p>
            </div>
            <MobileNavSections
              navigation={navigation}
              onNavigate={() => setDrawerOpen(false)}
            />
            <Link
              href="/contact-us"
              onClick={() => setDrawerOpen(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold tracking-wide text-white no-underline transition hover:bg-brand dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white"
            >
              Contact us
            </Link>
          </Drawer>
        </div>
      ) : null}

      {showDesktop ? <DesktopNav navigation={navigation} /> : null}
    </>
  );
}
