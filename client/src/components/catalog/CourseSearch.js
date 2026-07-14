"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CourseSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const q = value.trim();
    if (q) params.set("q", q);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-md ${isPending ? "opacity-70" : ""}`}
    >
      <label className="flex h-11 w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/20">
        <svg
          className="size-4 shrink-0 text-slate-400"
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
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search Course"
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </label>
    </form>
  );
}
