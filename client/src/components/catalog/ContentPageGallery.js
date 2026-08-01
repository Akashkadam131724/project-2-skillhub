"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  accentForPath,
  groupContentPages,
} from "@/lib/content/content-catalog";
import SectionWrapper from "@/components/sections/SectionWrapper";
import DsButton from "@/components/ui/DsButton";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

function GalleryModal({ pages, index, onClose, onChangeIndex }) {
  const page = pages[index];
  const total = pages.length;

  const goPrev = useCallback(() => {
    onChangeIndex((index - 1 + total) % total);
  }, [index, onChangeIndex, total]);

  const goNext = useCallback(() => {
    onChangeIndex((index + 1) % total);
  }, [index, onChangeIndex, total]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [goNext, goPrev, onClose]);

  if (!page) return null;

  const accent = accentForPath(page.path);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery: ${page.name}`}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="m-0 text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
            Gallery · {index + 1} / {total}
          </p>
          <p className="m-0 truncate font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            {page.name}
          </p>
          <p className="m-0 truncate text-sm text-white/60">{page.path}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Next page"
          >
            <ChevronRightIcon className="size-5" />
          </button>
          <DsButton
            label="Open page"
            variant="inverse"
            size="md"
            shape="rounded"
            icon="external"
            icon_position="end"
            action_type="url"
            target_url={page.path}
            open_in_new_tab
            surface="dark"
            className="hidden sm:inline-flex"
          />
          <DsButton
            label="Close"
            variant="outline"
            size="md"
            shape="rounded"
            icon="none"
            onClick={onClose}
            surface="dark"
          />
        </div>
      </div>

      <div className="relative min-h-0 flex-1 p-3 sm:p-5">
        <div
          className={`pointer-events-none absolute inset-3 rounded-[1.5rem] bg-gradient-to-br opacity-30 sm:inset-5 ${accent}`}
          aria-hidden
        />
        <iframe
          key={page.path}
          title={page.name}
          src={page.path}
          className="relative z-10 h-full w-full rounded-[1.25rem] border border-white/15 bg-white shadow-2xl"
        />
      </div>
    </div>
  );
}

function ContentCard({ page, onOpenAt }) {
  const accent = accentForPath(page.path);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div
        className={`relative flex aspect-[16/10] items-end overflow-hidden bg-gradient-to-br p-4 ${accent}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <p className="relative m-0 font-mono text-xs font-medium text-white/90">
          {page.path}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="m-0 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-ink dark:text-white">
            {page.name}
          </h3>
          {page.description ? (
            <p className="mt-1.5 mb-0 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {page.description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <DsButton
            label="Gallery"
            variant="primary"
            size="sm"
            shape="rounded"
            icon="none"
            onClick={() => onOpenAt(page)}
            className="flex-1"
          />
          <DsButton
            label="Open"
            variant="outline"
            size="sm"
            shape="rounded"
            icon="none"
            action_type="url"
            target_url={page.path}
          />
        </div>
      </div>
    </article>
  );
}

export default function ContentPageGallery({ pages, title, subtitle }) {
  const [q, setQ] = useState("");
  const [galleryIndex, setGalleryIndex] = useState(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return pages;
    return pages.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(needle) ||
        (p.path || "").toLowerCase().includes(needle) ||
        (p.description || "").toLowerCase().includes(needle)
    );
  }, [pages, q]);

  const groups = useMemo(() => groupContentPages(filtered), [filtered]);

  const flatFiltered = useMemo(() => {
    const out = [];
    for (const [, items] of groups) out.push(...items);
    return out;
  }, [groups]);

  function openAt(page) {
    const idx = flatFiltered.findIndex((p) => p.path === page.path);
    setGalleryIndex(idx >= 0 ? idx : 0);
  }

  function openGallery() {
    if (flatFiltered.length) setGalleryIndex(0);
  }

  return (
    <>
      <SectionWrapper className="py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="m-0 text-xs font-semibold tracking-[0.22em] text-brand uppercase">
              Catalog
            </p>
            <h1 className="mt-2 mb-0 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 mb-0 text-slate-600 dark:text-slate-400">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <DsButton
              label="Browse gallery"
              variant="primary"
              size="md"
              shape="rounded"
              icon="none"
              onClick={openGallery}
              disabled={!flatFiltered.length}
            />
            <DsButton
              label="All catalogs"
              variant="outline"
              size="md"
              shape="rounded"
              icon="none"
              action_type="url"
              target_url="/catalog"
            />
          </div>
        </div>

        <div className="mb-8">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search content pages…"
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink outline-none ring-brand/30 transition focus:border-brand focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <p className="mt-2 mb-0 text-sm text-slate-500">
            {flatFiltered.length} page{flatFiltered.length === 1 ? "" : "s"}
            {q.trim() ? ` matching “${q.trim()}”` : ""}
          </p>
        </div>

        {groups.map(([label, items]) => (
          <section key={label} className="mb-10">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold text-ink dark:text-white">
              {label}
              <span className="ml-2 text-sm font-normal text-slate-400">({items.length})</span>
            </h2>
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((page) => (
                <li key={page.path}>
                  <ContentCard page={page} onOpenAt={openAt} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {!flatFiltered.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-slate-500 dark:border-slate-700">
            No content pages match your search.
          </p>
        ) : null}
      </SectionWrapper>

      {galleryIndex !== null && flatFiltered.length ? (
        <GalleryModal
          pages={flatFiltered}
          index={galleryIndex}
          onClose={() => setGalleryIndex(null)}
          onChangeIndex={setGalleryIndex}
        />
      ) : null}
    </>
  );
}
