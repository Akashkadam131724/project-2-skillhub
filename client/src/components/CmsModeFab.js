"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const CMS_FAB_STORAGE_KEY = "cms-fab-enabled";

export function enableCmsFab() {
  try {
    localStorage.setItem(CMS_FAB_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function UserIcon({ className = "size-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path
        d="M5.5 19.5c.9-3.1 3.4-5 6.5-5s5.6 1.9 6.5 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon({ className = "size-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        d="M4 20l4.2-1 10.6-10.6a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m14.5 6.7 3 3" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "size-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function FabButton({
  as: Comp = "button",
  href,
  onClick,
  pressed,
  label,
  className,
  children,
}) {
  const shared =
    "group/fab relative inline-flex size-12 items-center justify-center rounded-full shadow-lg ring-1 transition hover:scale-105 active:scale-95";

  const tip = (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-95 rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 shadow-md transition group-hover/fab:scale-100 group-hover/fab:opacity-100 dark:bg-white dark:text-ink"
    >
      {label}
    </span>
  );

  if (Comp === "a" || href) {
    return (
      <Link href={href} aria-label={label} className={`${shared} ${className}`}>
        {children}
        {tip}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={`${shared} ${className}`}
    >
      {children}
      {tip}
    </button>
  );
}

function CmsModeFabInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [editorUnlocked, setEditorUnlocked] = useState(false);

  const on = String(searchParams.get("cms") || "").toLowerCase() === "true";

  useEffect(() => {
    try {
      if (localStorage.getItem(CMS_FAB_STORAGE_KEY) === "1") {
        setEditorUnlocked(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!on) return;
    enableCmsFab();
    setEditorUnlocked(true);
  }, [on]);

  // Hidden on /cms and for public visitors who never opened CMS / edit mode
  if (!pathname || pathname === "/cms" || pathname.startsWith("/cms/")) {
    return null;
  }

  if (!on && !editorUnlocked) {
    return null;
  }

  const editLabel = on ? "CMS Off — exit edit mode" : "CMS On — edit this page";

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    if (on) params.delete("cms");
    else {
      params.set("cms", "true");
      enableCmsFab();
      setEditorUnlocked(true);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 print:hidden">
      <FabButton
        href="/cms"
        label="CMS Admin"
        className="bg-white text-ink ring-slate-200/90 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-800"
      >
        <UserIcon />
      </FabButton>

      <FabButton
        onClick={toggle}
        pressed={on}
        label={editLabel}
        className="bg-amber-500 text-white ring-amber-600/40 hover:bg-amber-600"
      >
        {on ? <CloseIcon /> : <EditIcon />}
      </FabButton>
    </div>
  );
}

/**
 * Floating CMS controls — only for editors.
 * Unlocks after visiting /cms or opening ?cms=true (persisted in localStorage).
 */
export default function CmsModeFab() {
  return (
    <Suspense fallback={null}>
      <CmsModeFabInner />
    </Suspense>
  );
}
