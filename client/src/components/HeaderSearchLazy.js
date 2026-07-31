"use client";

import dynamic from "next/dynamic";

function SearchPlaceholder() {
  return (
    <div
      className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-400 dark:border-slate-700 dark:bg-slate-900/70"
      aria-hidden
    >
      <svg className="size-5" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M20 20L16.65 16.65"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

const HeaderSearch = dynamic(() => import("@/components/HeaderSearch"), {
  loading: () => <SearchPlaceholder />,
});

export default HeaderSearch;
