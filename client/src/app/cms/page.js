"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CmsHeading,
  CmsPanel,
  ErrorBanner,
  btnPrimary,
  btnSecondary,
} from "@/components/cms/CmsUi";

const QUICK_LINKS = [
  { href: "/cms/site-theme", label: "Site theme", hint: "Global brand & surfaces" },
  { href: "/cms/contents", label: "Content pages", hint: "About us, our team, … free-form" },
  { href: "/cms/pages", label: "Page templates", hint: "Section placements by page type" },
  { href: "/cms/pages-content-sections", label: "Content sections", hint: "Global section defaults" },
  { href: "/cms-preview", label: "CMS preview", hint: "Client showcase of CMS features" },
  { href: "/cms/vendors", label: "Vendors", hint: "Open a vendor → live CMS" },
  { href: "/cms/products", label: "Products", hint: "Open a product → live CMS" },
  { href: "/cms/courses", label: "Courses", hint: "Open a course → live CMS" },
];

export default function CmsOverviewPage() {
  const [navBusy, setNavBusy] = useState(false);
  const [navMsg, setNavMsg] = useState(null);
  const [navError, setNavError] = useState(null);

  async function refreshNavigation() {
    setNavBusy(true);
    setNavMsg(null);
    setNavError(null);
    try {
      const res = await fetch("/api/publish/navigation", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to refresh navigation");
      }
      setNavMsg("Navigation cache refreshed — header will reload on next visit.");
    } catch (err) {
      setNavError(err);
    } finally {
      setNavBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <CmsHeading
        title="SkillHub CMS"
        subtitle="Entity pages always load fresh (SSR). Only the site header navigation is cached — refresh it here after nav changes."
      />

      <CmsPanel title="Site navigation">
        <p className="m-0 mb-4 text-sm text-slate-600 dark:text-slate-300">
          The header menu is cached (ISR). After you change navigation on the
          nav service, refresh it here so the site picks up the new tree.
        </p>
        {navError ? <ErrorBanner error={navError} /> : null}
        {navMsg ? (
          <p className="mb-3 text-sm text-emerald-700 dark:text-emerald-400">
            {navMsg}
          </p>
        ) : null}
        <button
          type="button"
          disabled={navBusy}
          onClick={refreshNavigation}
          className={btnPrimary}
        >
          {navBusy ? "Refreshing…" : "Refresh navigation cache"}
        </button>
      </CmsPanel>

      <CmsPanel title="Quick links">
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
          {QUICK_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${btnSecondary} inline-flex w-full flex-col items-start gap-0.5 !no-underline`}
              >
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="text-xs font-normal text-slate-500">
                  {item.hint}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CmsPanel>
    </div>
  );
}
