"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SkillHubLogo from "@/components/SkillHubLogo";

const NAV = [
  { href: "/cms", label: "Dashboard", exact: true },
  { href: "/cms/site-theme", label: "Site theme" },
  { href: "/cms/contents", label: "Content pages" },
  { href: "/cms/pages", label: "Manage sections for templates / pages" },
  { href: "/cms/pages-content-sections", label: "All content sections" },
  { href: "/cms/vendors", label: "Vendors" },
  { href: "/cms/products", label: "Products" },
  { href: "/cms/courses", label: "Courses" },
  { href: "/cms/blogs", label: "Blogs" },
  { href: "/cms/industries", label: "Industries" },
  { href: "/cms/skilling-areas", label: "Skilling areas" },
];

const STORAGE_KEY = "cms-sidebar-open";

function navActive(pathname, href, exact) {
  if (exact) return pathname === href;
  if (href === "/cms/pages") {
    return pathname === "/cms/pages" || /^\/cms\/pages\/[^/]+$/.test(pathname);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuIcon({ open }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      {open ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16" />
          <path strokeLinecap="round" d="M4 12h16" />
          <path strokeLinecap="round" d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export default function CmsShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "0") setOpen(false);
      else if (stored === "1") setOpen(true);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/40">
      <div className="flex w-full flex-col gap-4 px-4 py-6 sm:px-6 md:px-8 lg:flex-row lg:gap-6">
        {/* Collapsed rail (desktop) */}
        {ready && !open ? (
          <div className="hidden shrink-0 lg:block">
            <div className="sticky top-6">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                aria-label="Open CMS sidebar"
                title="Open sidebar"
              >
                <MenuIcon open={false} />
              </button>
            </div>
          </div>
        ) : null}

        {/* Sidebar */}
        <aside
          className={`w-full shrink-0 transition-[width,opacity] lg:w-56 ${
            ready && !open ? "hidden lg:hidden" : ""
          }`}
        >
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Link
                href="/"
                className="group flex min-w-0 flex-1 items-center gap-2.5 no-underline"
                aria-label="SkillHub home"
              >
                <SkillHubLogo size={32} showWordmark={false} />
                <span className="flex min-w-0 flex-col leading-none">
                  <span className="font-[family-name:var(--font-display)] text-[1.02rem] font-semibold tracking-tight text-ink dark:text-white">
                    SkillHub
                  </span>
                  <span className="mt-1 text-[9px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                    Learn · Build · Ship
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={toggle}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close CMS sidebar"
                title="Close sidebar"
              >
                <MenuIcon open />
              </button>
            </div>
            <p className="m-0 mb-2 px-1 text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
              CMS
            </p>
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {NAV.map((item) => {
                const active = navActive(pathname, item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium no-underline whitespace-nowrap transition ${
                      active
                        ? "bg-brand text-white"
                        : "text-slate-700 hover:bg-slate-200/70 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile: open button when closed */}
        {ready && !open ? (
          <div className="lg:hidden">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              aria-label="Open CMS sidebar"
            >
              <MenuIcon open={false} />
              Menu
            </button>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
