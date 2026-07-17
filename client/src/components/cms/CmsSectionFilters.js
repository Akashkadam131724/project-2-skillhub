"use client";

import {
  SECTION_CATEGORIES,
  getSectionCatalogMeta,
} from "@/lib/section-registry";
import {
  contentScopeLabel,
  normalizeContentScope,
} from "@/lib/content-scope";

export function sectionCategory(section) {
  const catalog = getSectionCatalogMeta(section?.key);
  return (
    String(section?.category || catalog?.category || "").toLowerCase() ||
    "uncategorized"
  );
}

/** Legacy type buckets used by add-section pickers */
export function sectionKind(key) {
  const k = String(key || "").toLowerCase();
  if (k.startsWith("hero_") || k === "site_builder_hero") return "hero";
  if (
    k === "training_options" ||
    k === "awards" ||
    k === "key_benefits" ||
    k === "team" ||
    k === "feature_spotlight" ||
    k === "process_steps" ||
    k === "bento_grid" ||
    k === "pillar_destinations" ||
    k === "card_stack" ||
    k === "feature_tabs" ||
    k === "pricing_tiers" ||
    k === "masonry_quotes" ||
    k === "builder_feature_cards" ||
    k === "why_choose"
  ) {
    return "cards";
  }
  if (k === "horizon_gallery" || k === "split_narrative" || k === "template_gallery") {
    return "cards";
  }
  if (k === "metric_rail" || k === "domain_search_band" || k === "website_build_steps") {
    return "cards";
  }
  if (k === "in_page_nav") return "nav";
  if (
    k === "overview" ||
    k === "text_media" ||
    k === "faq" ||
    k === "testimonials" ||
    k === "customer_testimonials" ||
    k === "page_testimonials" ||
    k === "resources" ||
    k === "curriculum" ||
    k === "stats" ||
    k === "partners" ||
    k === "partners_marquee" ||
    k === "catalog" ||
    k === "products" ||
    k === "related_courses"
  ) {
    return "content";
  }
  return "other";
}

export function FilterOption({ active, label, count, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md py-1.5 text-left text-xs text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
    >
      <span
        className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded border ${
          active
            ? "border-brand bg-brand"
            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
        }`}
      >
        {active ? <span className="h-1.5 w-1.5 rounded-sm bg-white" /> : null}
      </span>
      <span
        className={`min-w-0 flex-1 truncate ${
          active ? "font-semibold text-slate-950 dark:text-white" : ""
        }`}
      >
        {label}
      </span>
      {count != null ? (
        <span className="ml-auto shrink-0 text-[11px] text-slate-400">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function FilterGroup({
  title,
  search,
  onSearch,
  placeholder,
  options,
  value,
  onChange,
  maxHeightClass = "max-h-72",
}) {
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(String(search || "").trim().toLowerCase())
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h3>
        <span className="text-xs text-slate-400">^</span>
      </div>
      <input
        className="mb-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className={`${maxHeightClass} overflow-y-auto pr-1`}>
        {filtered.map((opt) => (
          <FilterOption
            key={opt.value}
            active={value === opt.value}
            label={opt.label}
            count={opt.count}
            onClick={() => onChange(value === opt.value ? "all" : opt.value)}
          />
        ))}
        {!filtered.length ? (
          <p className="m-0 py-1 text-xs text-slate-400">No matches</p>
        ) : null}
      </div>
    </div>
  );
}

export function buildCategoryOptions(sections = []) {
  const counts = { all: sections.length, uncategorized: 0 };
  for (const section of sections) {
    const category = sectionCategory(section);
    counts[category] = (counts[category] || 0) + 1;
  }
  const options = [
    { value: "all", label: "All categories", count: counts.all },
    ...SECTION_CATEGORIES.map((category) => ({
      value: category.key,
      label: category.name,
      count: counts[category.key] || 0,
    })),
  ];
  if (counts.uncategorized) {
    options.push({
      value: "uncategorized",
      label: "Uncategorized",
      count: counts.uncategorized,
    });
  }
  return options;
}

export function sectionScope(section) {
  return normalizeContentScope(section?.content_scope);
}

export function buildScopeOptions(sections = []) {
  const counts = { all: sections.length, global: 0, template: 0, page: 0 };
  for (const section of sections) {
    const scope = sectionScope(section);
    if (scope in counts) counts[scope] += 1;
  }
  return [
    { value: "all", label: "All scopes", count: counts.all },
    {
      value: "global",
      label: contentScopeLabel("global"),
      count: counts.global,
    },
    {
      value: "template",
      label: contentScopeLabel("template"),
      count: counts.template,
    },
    { value: "page", label: contentScopeLabel("page"), count: counts.page },
  ];
}

/** Colored pill for global / template / page content scope */
export function ScopeBadge({ scope, className = "" }) {
  const normalized = normalizeContentScope(scope);
  const label = contentScopeLabel(normalized);
  const styles =
    normalized === "global"
      ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
      : normalized === "template"
        ? "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300"
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${styles} ${className}`.trim()}
    >
      {label}
    </span>
  );
}

/** Chip row used by add-section pickers (scope / type / on page). */
export function FilterChipRow({ label, options, value, onChange, activeClass }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
        {label}
      </span>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
              active
                ? activeClass || "bg-brand text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {opt.label}
            {opt.count != null ? (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                {opt.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
