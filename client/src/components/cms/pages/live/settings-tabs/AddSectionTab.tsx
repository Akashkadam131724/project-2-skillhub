"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  EmptyState,
  SectionPreviewThumb,
  inputClass,
} from "@/components/cms/admin/CmsUi";
import {
  FilterGroup,
  FilterChipRow,
  ScopeBadge,
  buildCategoryOptions,
  sectionCategory,
  sectionKind,
} from "@/components/cms/sections/CmsSectionFilters";
import { normalizeContentScope } from "@/lib/cms/content-scope";
import { useCmsLivePagePlacements } from "@/context/CmsLivePlacementsContext";
import type { AddSectionTabProps } from "../../types";

/** Add-section picker — owns filters + lazy catalog load. */
export default function AddSectionTab({ onError }: AddSectionTabProps) {
  const {
    sections,
    catalog,
    catalogLoading = false,
    ensureCatalog,
    saving: busy = false,
    addOnThisPage,
  } = useCmsLivePagePlacements();
  const [addKey, setAddKey] = useState("");
  const [addSearch, setAddSearch] = useState("");
  const [addScopeFilter, setAddScopeFilter] = useState("all");
  const [addKindFilter, setAddKindFilter] = useState("all");
  const [addPlacedFilter, setAddPlacedFilter] = useState("all");
  const [addCategoryFilter, setAddCategoryFilter] = useState("all");
  const [addCategorySearch, setAddCategorySearch] = useState("");

  useEffect(() => {
    ensureCatalog?.().catch(() => {});
  }, [ensureCatalog]);

  const sectionOptions = useMemo(
    () => (catalog || []).filter((s) => s.status !== false),
    [catalog]
  );

  const placedKeys = useMemo(
    () => new Set((sections || []).map((s) => s.section_key)),
    [sections]
  );

  const filteredAddOptions = useMemo(() => {
    const q = addSearch.trim().toLowerCase();
    return sectionOptions.filter((s) => {
      const scope = normalizeContentScope(s.content_scope);
      if (addScopeFilter !== "all" && scope !== addScopeFilter) return false;
      if (addKindFilter !== "all" && sectionKind(s.key) !== addKindFilter) {
        return false;
      }
      if (
        addCategoryFilter !== "all" &&
        sectionCategory(s) !== addCategoryFilter
      ) {
        return false;
      }
      const onPage = placedKeys.has(s.key);
      if (addPlacedFilter === "available" && onPage) return false;
      if (addPlacedFilter === "placed" && !onPage) return false;
      if (!q) return true;
      return (
        String(s.name || "")
          .toLowerCase()
          .includes(q) ||
        String(s.key || "")
          .toLowerCase()
          .includes(q) ||
        String(s.section_title || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [
    sectionOptions,
    addScopeFilter,
    addKindFilter,
    addCategoryFilter,
    addPlacedFilter,
    addSearch,
    placedKeys,
  ]);

  const categoryOptions = useMemo(
    () => buildCategoryOptions(sectionOptions),
    [sectionOptions]
  );

  const addFilterCounts = useMemo(() => {
    const scope = {
      all: sectionOptions.length,
      global: 0,
      template: 0,
      page: 0,
    };
    const kind = {
      all: sectionOptions.length,
      hero: 0,
      cards: 0,
      content: 0,
      nav: 0,
      other: 0,
    };
    let placed = 0;
    for (const s of sectionOptions) {
      scope[normalizeContentScope(s.content_scope)] += 1;
      kind[sectionKind(s.key) as keyof typeof kind] += 1;
      if (placedKeys.has(s.key)) placed += 1;
    }
    return {
      scope,
      kind,
      placed: {
        all: sectionOptions.length,
        available: sectionOptions.length - placed,
        placed,
      },
    };
  }, [sectionOptions, placedKeys]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!addKey) return;
    onError?.(null);
    try {
      await addOnThisPage(addKey);
      setAddKey("");
    } catch (err) {
      onError?.((err as Error).message || "Could not add section");
    }
  }

  return (
    <form onSubmit={handleAdd} className="space-y-3">
      <p className="m-0 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
        Add on this page
      </p>

      {catalogLoading && !sectionOptions.length ? (
        <p className="m-0 text-xs text-slate-500">Loading sections…</p>
      ) : null}

      <input
        className={inputClass}
        value={addSearch}
        onChange={(e) => setAddSearch(e.target.value)}
        placeholder="Search by name or key…"
      />

      <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <FilterGroup
          title="Category"
          search={addCategorySearch}
          onSearch={setAddCategorySearch}
          placeholder="Search Category"
          options={categoryOptions}
          value={addCategoryFilter}
          onChange={setAddCategoryFilter}
          maxHeightClass="max-h-36"
        />
      </div>

      <FilterChipRow
        label="Scope"
        value={addScopeFilter}
        onChange={setAddScopeFilter}
        activeClass="bg-brand text-white"
        options={[
          { value: "all", label: "All scopes" },
          { value: "global", label: "Global" },
          { value: "template", label: "Template" },
          { value: "page", label: "Page" },
        ].map((opt) => ({
          ...opt,
          count: addFilterCounts.scope[opt.value as keyof typeof addFilterCounts.scope] ?? 0,
        }))}
      />

      <FilterChipRow
        label="Type"
        value={addKindFilter}
        onChange={setAddKindFilter}
        activeClass="bg-ink text-white"
        options={[
          { value: "all", label: "All types" },
          { value: "hero", label: "Hero" },
          { value: "cards", label: "Cards" },
          { value: "content", label: "Content" },
          { value: "nav", label: "Nav" },
          { value: "other", label: "Other" },
        ].map((opt) => ({
          ...opt,
          count: addFilterCounts.kind[opt.value as keyof typeof addFilterCounts.kind] ?? 0,
        }))}
      />

      <FilterChipRow
        label="On page"
        value={addPlacedFilter}
        onChange={setAddPlacedFilter}
        activeClass="bg-teal-700 text-white"
        options={[
          { value: "all", label: "All sections" },
          { value: "available", label: "Not on page" },
          { value: "placed", label: "Already on page" },
        ].map((opt) => ({
          ...opt,
          count: addFilterCounts.placed[opt.value as keyof typeof addFilterCounts.placed] ?? 0,
        }))}
      />

      {!filteredAddOptions.length ? (
        <EmptyState message="No sections match these filters." />
      ) : (
        <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto">
          {filteredAddOptions.map((s) => {
            const selected = addKey === s.key;
            const onPage = placedKeys.has(s.key);
            return (
              <div
                key={s.key}
                role="button"
                tabIndex={0}
                onClick={() => setAddKey(s.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAddKey(s.key);
                  }
                }}
                className={`flex cursor-pointer flex-col overflow-hidden rounded-lg border text-left transition ${
                  selected
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                }`}
              >
                <SectionPreviewThumb
                  src={s.section_preview_img}
                  alt={s.name}
                  className="h-16 w-full"
                  rounded="rounded-none"
                  expandable={false}
                />
                <div className="flex flex-wrap gap-1 px-2 pt-1">
                  <ScopeBadge scope={s.content_scope} />
                  {onPage ? (
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      On page
                    </span>
                  ) : null}
                </div>
                <span className="truncate px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200">
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="m-0 text-[11px] text-slate-500">
        Showing {filteredAddOptions.length} of {sectionOptions.length}
        {addKey ? ` · selected: ${addKey}` : ""}
      </p>

      <button
        type="submit"
        disabled={!addKey || busy}
        className="w-full rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        Add (this page only)
      </button>
    </form>
  );
}
