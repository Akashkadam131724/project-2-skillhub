"use client";

import { useMemo, useState } from "react";
import SectionWrapper from "@/components/sections/SectionWrapper";

export default function NetcomSectionPreviewGallery({ sections }) {
  const [query, setQuery] = useState("");
  const [template, setTemplate] = useState("all");

  const templates = useMemo(() => {
    const ids = [...new Set(sections.map((s) => s.template))].sort((a, b) => a - b);
    return ids;
  }, [sections]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.filter((section) => {
      if (template !== "all" && String(section.template) !== template) return false;
      if (!q) return true;
      return (
        section.name.toLowerCase().includes(q) ||
        section.title.toLowerCase().includes(q) ||
        String(section.id).includes(q)
      );
    });
  }, [query, sections, template]);

  return (
    <SectionWrapper className="py-10 sm:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="m-0 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
          Static showcase
        </p>
        <h1 className="mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
          NetCom section previews
        </h1>
        <p className="mt-3 mb-0 text-slate-600 dark:text-slate-400">
          {sections.length} CMS sections with preview images from NetCom Learning — filtered
          from the legacy section catalog (non-empty <code className="text-sm">image_url</code>
          ).
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, title, or id…"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none ring-brand/30 transition focus:border-brand focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:max-w-md"
        />
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="all">All templates</option>
          {templates.map((id) => (
            <option key={id} value={String(id)}>
              Template {id}
            </option>
          ))}
        </select>
        <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
          Showing {filtered.length} of {sections.length}
        </p>
      </div>

      <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((section) => (
          <li key={section.id}>
            <article className="overflow-hidden rounded-[1.25rem] border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <a
                href={section.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-slate-100 dark:bg-slate-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.image_url}
                  alt={section.title || section.name}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top transition group-hover:opacity-95"
                />
              </a>
              <div className="space-y-1 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase">
                    #{section.id}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    T{section.template}
                  </span>
                </div>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-lg font-semibold text-ink dark:text-white">
                  {section.name}
                </h2>
                <p className="m-0 text-sm text-slate-500 dark:text-slate-400">{section.title}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {!filtered.length ? (
        <p className="mt-8 text-center text-sm text-slate-500">No sections match your filters.</p>
      ) : null}
    </SectionWrapper>
  );
}
