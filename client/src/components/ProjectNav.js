"use client";

import { useState } from "react";
import Link from "next/link";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";

/**
 * Temporary static project nav — useful SkillHub demo pages.
 * Dynamic mega-nav (SiteHeaderNav + getNavigationTree) is paused for now.
 */
export const PROJECT_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Catalog guide", href: "/catalog-guide" },
  { name: "CMS preview", href: "/cms-preview" },
  { name: "Sections", href: "/sections" },
  { name: "The Odyssey", href: "/odyssey" },
];

const linkClass =
  "whitespace-nowrap rounded-lg px-2 py-1.5 text-[13px] font-semibold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

function DesktopProjectNav() {
  return (
    <nav aria-label="Project" className="flex items-center gap-0.5">
      {PROJECT_NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
        <Link key={link.href} href={link.href} className={linkClass}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

function MobileProjectNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <HamburgerButton
        open={open}
        onClick={() => setOpen((v) => !v)}
        label={open ? "Close navigation" : "Open navigation"}
      />
      <Drawer open={open} onClose={() => setOpen(false)} title="SkillHub">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-ink to-brand px-4 py-4 text-white">
          <p className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
            Project pages
          </p>
          <p className="mt-1 mb-0 text-sm text-white/70">
            Useful links for this SkillHub demo.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {PROJECT_NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink no-underline transition hover:border-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {link.name}
                <span aria-hidden className="text-slate-400">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/contact-us"
          onClick={() => setOpen(false)}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-sm font-semibold tracking-wide text-white no-underline transition hover:bg-brand dark:bg-white dark:text-ink dark:hover:bg-brand dark:hover:text-white"
        >
          Contact us
        </Link>
      </Drawer>
    </div>
  );
}

export default function ProjectNav({ showDesktop = true, showMobile = true }) {
  return (
    <>
      {showDesktop ? (
        <div className="hidden lg:block">
          <DesktopProjectNav />
        </div>
      ) : null}
      {showMobile ? <MobileProjectNav /> : null}
    </>
  );
}
