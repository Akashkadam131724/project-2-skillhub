"use client";

import { useState } from "react";
import Link from "next/link";
import Drawer, { HamburgerButton } from "@/components/ui/Drawer";
import HeaderContactButton from "@/components/layout/HeaderContactButton";
import { PROJECT_NAV_LINKS } from "@/lib/content/project-nav-links";
import type { ProjectNavProps } from "./types";

export { PROJECT_NAV_LINKS };

/**
 * Static project nav — SkillHub demo & showcase pages (code-defined, not API).
 */

const linkClass =
  "whitespace-nowrap rounded-lg px-2 py-1.5 text-[12px] font-semibold text-slate-600 no-underline transition hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

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
        active={open}
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
        <HeaderContactButton
          className="mt-6"
          fullWidth
          onNavigate={() => setOpen(false)}
        />
      </Drawer>
    </div>
  );
}

export default function ProjectNav({ showDesktop = true, showMobile = true }: ProjectNavProps) {
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
