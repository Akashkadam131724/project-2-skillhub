"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * CMS On/Off + Admin — used in site header (when CMS off) and CMS top bar.
 */
export default function CmsModeToggle({
  variant = "header",
  showAdmin = true,
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!pathname || pathname === "/cms" || pathname.startsWith("/cms/")) {
    return null;
  }

  const on = String(searchParams.get("cms") || "").toLowerCase() === "true";

  // Header: only when CMS is off (CMS bar owns the controls when on)
  if (variant === "header" && on) {
    return null;
  }

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (on) params.delete("cms");
    else params.set("cms", "true");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const isBar = variant === "bar";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        title={on ? "Turn off page CMS edit mode" : "Turn on page CMS edit mode"}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide uppercase transition ${
          isBar
            ? on
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
            : on
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${
            on ? "bg-white" : isBar ? "bg-emerald-700/50" : "bg-slate-400 dark:bg-slate-500"
          }`}
          aria-hidden
        />
        CMS {on ? "On" : "Off"}
      </button>
      {showAdmin ? (
        <Link
          href="/cms"
          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide no-underline uppercase ${
            isBar
              ? "text-emerald-900 hover:bg-emerald-100 dark:text-emerald-100 dark:hover:bg-emerald-900/60"
              : "hidden text-slate-600 hover:bg-slate-50 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
          title="CMS admin"
        >
          Admin
        </Link>
      ) : null}
    </div>
  );
}
