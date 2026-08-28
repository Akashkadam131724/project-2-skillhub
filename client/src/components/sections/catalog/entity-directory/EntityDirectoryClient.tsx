"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CatalogPager from "../shared/CatalogPager";
import CatalogScrollAnchor from "../shared/CatalogScrollAnchor";
import CatalogSearch from "../shared/CatalogSearch";
import EntityDirectoryUi from "./EntityDirectoryUi";
import { DIRECTORY_META } from "./lib/directory-meta";
import { DirectoryCards } from "./lib/directory-cards";
import { fetchDirectory } from "./lib/fetch-directory";
import {
  resolveDirectoryType,
  resolveEntityDirectoryTitle,
} from "./lib/resolve-directory";
import type { EntityDirectorySectionProps } from "./lib/types";

export default function EntityDirectoryClient({
  section_title,
  sub_title,
  section_key = "entity_directory",
  data,
  pageContext,
  id,
  titleSlot,
  subtitleSlot,
}: EntityDirectorySectionProps & {
  titleSlot?: React.ReactNode;
  subtitleSlot?: React.ReactNode;
}) {
  const type = useMemo(
    () => resolveDirectoryType(section_key, data, pageContext),
    [section_key, data, pageContext]
  );
  const meta = DIRECTORY_META[type] || DIRECTORY_META.vendor;

  const searchParams = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const q = searchParams.get("q") || "";

  const [result, setResult] = useState({
    data: [] as Record<string, unknown>[],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchDirectory(type, { page, q, limit: 24 });
        if (!alive) return;
        setResult(
          (res as typeof result) || {
            data: [],
            total: 0,
            page: 1,
            totalPages: 1,
          }
        );
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load directory"
        );
        setResult({ data: [], total: 0, page: 1, totalPages: 1 });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [type, page, q]);

  const items = result.data || [];
  const total = result.total || 0;
  const title = resolveEntityDirectoryTitle(section_title, meta.label);
  const subtitle = (sub_title && String(sub_title).trim()) || "";

  const panel = (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_-48px_color-mix(in_srgb,var(--ink)_35%,transparent)] sm:p-6">
      <CatalogScrollAnchor className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="m-0 font-[family-name:var(--font-display)] text-xl font-semibold section-theme-heading">
          {loading
            ? "…"
            : error
              ? "—"
              : `${total.toLocaleString("en-US")} ${meta.label}`}
        </h3>
        <Suspense
          fallback={
            <div className="h-12 w-full max-w-md animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          }
        >
          <CatalogSearch placeholder={meta.searchPlaceholder} />
        </Suspense>
      </CatalogScrollAnchor>

      {error ? <p className="m-0 mb-4 text-sm text-rose-600">{error}</p> : null}

      {loading ? (
        <div className={`grid gap-3 ${meta.grid}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : !error && items.length === 0 ? (
        <p className="m-0 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          {meta.empty}
        </p>
      ) : (
        <ul className={`m-0 grid list-none gap-3 p-0 ${meta.grid}`}>
          <DirectoryCards type={type} items={items} />
        </ul>
      )}

      <div className="mt-5">
        <Suspense fallback={null}>
          <CatalogPager
            page={result.page || page}
            totalPages={result.totalPages || 1}
          />
        </Suspense>
      </div>
    </div>
  );

  return (
    <EntityDirectoryUi
      id={id}
      title={titleSlot ? undefined : title}
      subtitle={subtitleSlot ? undefined : subtitle || undefined}
      eyebrow={meta.label}
      titleSlot={titleSlot}
      subtitleSlot={subtitleSlot}
    >
      {panel}
    </EntityDirectoryUi>
  );
}
