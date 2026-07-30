"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { btnSecondary } from "@/components/cms/CmsUi";

function PriorityList({ items }) {
  return (
    <ol className="m-0 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li key={item}>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function ScopeTable() {
  const rows = [
    {
      scope: "Global",
      edit: "Content sections (catalog)",
      locked: "Template & entity pages",
    },
    {
      scope: "Template",
      edit: "Page template placement",
      locked: "Entity pages (vendor, product, …)",
    },
    {
      scope: "Page",
      edit: "Template + entity CMS mode",
      locked: "—",
    },
  ];
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[20rem] border-collapse text-left text-[11px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60">
            <th className="px-2 py-1.5 font-semibold text-slate-500">Scope</th>
            <th className="px-2 py-1.5 font-semibold text-slate-500">Edit on</th>
            <th className="px-2 py-1.5 font-semibold text-slate-500">Locked on</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.scope}
              className="border-b border-slate-100 last:border-0 dark:border-slate-800"
            >
              <td className="px-2 py-1.5 font-semibold text-slate-800 dark:text-slate-100">
                {row.scope}
              </td>
              <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">
                {row.edit}
              </td>
              <td className="px-2 py-1.5 text-slate-500">{row.locked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CheatSheet() {
  const rows = [
    ["Brand color site-wide", "Site theme → Colors"],
    ["One template’s band pattern", "Template theme → Surface"],
    ["One row always dark", "Section band → Dark or dark bg color"],
    ["Custom alternating colors", "Surface → Repeat sequence"],
    ["Same block on every page", "Content scope: Global"],
    ["Per-vendor content", "Content scope: Page + entity CMS"],
    ["Reset template to site", "Clear template theme overrides"],
  ];
  return (
    <ul className="m-0 space-y-1.5 p-0 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
      {rows.map(([want, action]) => (
        <li key={want} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <span className="min-w-[10rem] font-semibold text-slate-700 dark:text-slate-200">
            {want}
          </span>
          <span className="text-slate-500">→ {action}</span>
        </li>
      ))}
    </ul>
  );
}

function GuideBody({ showBandOnly = false }) {
  if (showBandOnly) {
    return (
      <div className="space-y-3">
        <p className="m-0 text-xs text-slate-500">
          What wins for <strong>this section row</strong> (highest first):
        </p>
        <PriorityList
          items={[
            "Background image — replaces the default band fill",
            "Background color — overrides page surface for this row only",
            "Band theme — Light, Dark, or Inherit",
            "Page surface pattern — from Site / Template theme (Surface tab)",
            "Page background — visible in gaps or when surface is transparent",
          ]}
        />
        <p className="m-0 text-[11px] text-slate-500">
          Use <strong>Inherit</strong> on most sections so the template surface
          pattern controls alternation. Use Light/Dark only to break the pattern
          on one row.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-2.5 dark:bg-brand/10">
        <p className="m-0 text-xs font-semibold text-slate-800 dark:text-slate-100">
          Highest priority first
        </p>
        <PriorityList
          items={[
            "Section band (image, color, light/dark) — per section row",
            "Page template theme — overrides site for that template",
            "Site theme — global defaults",
          ]}
        />
      </div>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-800 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Page theme cascade
            <span className="text-slate-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="border-t border-slate-200 px-3 py-2.5 dark:border-slate-700">
          <p className="mt-0 mb-2 text-xs text-slate-500">
            Site theme → Page template theme. Only{" "}
            <strong>non-empty</strong> fields at the template level replace the
            site. Empty or <strong>Inherit</strong> uses the parent layer.
          </p>
          <ul className="m-0 space-y-1 p-0 text-[11px] text-slate-600 dark:text-slate-300">
            <li>
              <strong>Colors</strong> — brand, hover, ink
            </li>
            <li>
              <strong>Surface</strong> — repeating band colors on section rows
            </li>
            <li>
              <strong>Background</strong> — page bg color/image behind transparent
              sections
            </li>
          </ul>
        </div>
      </details>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-800 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Section band priority
            <span className="text-slate-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="border-t border-slate-200 px-3 py-2.5 dark:border-slate-700">
          <GuideBody showBandOnly />
        </div>
      </details>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-800 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Section content scope
            <span className="text-slate-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="border-t border-slate-200 px-3 py-2.5 dark:border-slate-700">
          <p className="mt-0 mb-2 text-xs text-slate-500">
            For titles, cards, buttons, and images — resolution order depends on
            scope. <strong>Page</strong> scope: entity → template → catalog.
          </p>
          <ScopeTable />
        </div>
      </details>

      <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-slate-800 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Quick decisions
            <span className="text-slate-400 group-open:rotate-180">▼</span>
          </span>
        </summary>
        <div className="border-t border-slate-200 px-3 py-2.5 dark:border-slate-700">
          <CheatSheet />
        </div>
      </details>
    </div>
  );
}

/**
 * In-app override priority guide for CMS users.
 *
 * @param {"panel"|"compact"|"band"|"drawer-button"} [variant]
 */
export default function CmsOverrideGuide({ variant = "panel" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (variant === "band") {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900/40">
        <p className="m-0 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          Band priority (highest wins)
        </p>
        <GuideBody showBandOnly />
      </div>
    );
  }

  if (variant === "drawer-button") {
    return (
      <>
        <button
          type="button"
          className={`${btnSecondary} text-xs`}
          onClick={() => setDrawerOpen(true)}
        >
          Override guide
        </button>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="CMS override guide"
          side="right"
          size="lg"
          widthControl
          defaultWidthPct={50}
        >
          <GuideBody />
        </Drawer>
      </>
    );
  }

  if (variant === "compact") {
    return (
      <details className="rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
        <summary className="cursor-pointer list-none px-3 py-2 text-xs font-semibold text-brand marker:content-none [&::-webkit-details-marker]:hidden">
          How overrides work (priority guide)
        </summary>
        <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-800">
          <GuideBody />
        </div>
      </details>
    );
  }

  return <GuideBody />;
}
