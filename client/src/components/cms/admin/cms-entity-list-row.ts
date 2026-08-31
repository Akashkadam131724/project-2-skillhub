/**
 * Standard full-width row layout for CMS entity lists.
 */
export function cmsEntityListRowClass(extra = "") {
  return `flex w-full flex-wrap items-center justify-between gap-3 py-3 ${extra}`.trim();
}

export function cmsEntityListPrimaryClass() {
  return "min-w-0 flex-1";
}

export function cmsEntityListTitleClass() {
  return "m-0 font-semibold text-slate-900 dark:text-white";
}

export function cmsEntityListMetaClass() {
  return "mt-0.5 mb-0 text-xs text-slate-500";
}
