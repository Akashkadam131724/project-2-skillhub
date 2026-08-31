"use client";

import dynamic from "next/dynamic";
import SearchIcon from "@/components/icons/SearchIcon";

function SearchPlaceholder() {
  return (
    <div
      className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-400 dark:border-slate-700 dark:bg-slate-900/70"
      aria-hidden
    >
      <SearchIcon />
    </div>
  );
}

const HeaderSearch = dynamic(() => import("@/components/search/HeaderSearch"), {
  loading: () => <SearchPlaceholder />,
});

export default HeaderSearch;
